import { randomBytes } from "node:crypto";
import { createClient, RedisClientType } from "redis";

/**
 * VisitorRepository - Data access layer for visitor tracking.
 * Wraps Redis operations with a clean interface.
 *
 * Privacy: no IP addresses or cities are stored. Visitors are identified by a
 * salted hash (see VisitorService) and only a country code is kept, which
 * expires along with their "online" status.
 */

// Keys used in Redis storage
const KEYS = {
  TOTAL_COUNT: "visitors:total_count",
  UNIQUE_VISITORS: "visitors:unique_set",
  ONLINE_SET: "visitors:online_set", // Sorted set with timestamps
  COUNTRY_PREFIX: "visitors:country:", // Per-visitor country code, expires
  SALT_PREFIX: "visitors:salt:", // Daily random salt for visitor ID hashing
} as const;

// How long (in seconds) before a user is considered "offline"
const ONLINE_TTL_SECONDS = 300; // 5 minutes

// Keep each salt slightly longer than a day so requests around midnight work
const SALT_TTL_SECONDS = 60 * 60 * 25;

// Fail fast if Redis is unreachable rather than hanging the function
const CONNECT_TIMEOUT_MS = 3000;
const MAX_RECONNECT_ATTEMPTS = 2;

export interface VisitorStats {
  totalCount: number;
  uniqueCount: number;
  onlineCount: number;
  onlineCountries: { code: string; count: number }[];
}

/**
 * Redis client singleton with lazy connection.
 * Connection is established on first use and reused for subsequent calls.
 */
class RedisConnection {
  private static client: RedisClientType | null = null;
  private static connectionPromise: Promise<RedisClientType> | null = null;

  /**
   * Gets the Redis client, connecting if necessary.
   * Uses a singleton pattern to reuse connections (important for serverless).
   */
  static async getClient(): Promise<RedisClientType> {
    if (this.client?.isReady) {
      return this.client;
    }

    if (!this.connectionPromise) {
      // Clear the cached promise on failure so the next request retries
      this.connectionPromise = this.connect().catch((err) => {
        this.connectionPromise = null;
        throw err;
      });
    }

    return this.connectionPromise;
  }

  private static async connect(): Promise<RedisClientType> {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      throw new Error("REDIS_URL environment variable is not set");
    }

    if (this.client) {
      this.destroyQuietly(this.client);
      this.client = null;
    }

    // Only retry once a connection has been established; if the first
    // connection attempt fails, give up straight away so requests fail fast.
    let hasConnected = false;

    const client: RedisClientType = createClient({
      url: redisUrl,
      disableOfflineQueue: true,
      socket: {
        connectTimeout: CONNECT_TIMEOUT_MS,
        reconnectStrategy: (retries) =>
          !hasConnected || retries >= MAX_RECONNECT_ATTEMPTS
            ? new Error("Redis unavailable")
            : Math.min(100 * 2 ** retries, 1000),
      },
    });

    client.on("ready", () => {
      hasConnected = true;
    });

    client.on("error", (err) => {
      console.error("[Redis] Connection error:", err);
    });

    try {
      await client.connect();
    } catch (err) {
      this.destroyQuietly(client);
      throw err;
    }

    this.client = client;
    return client;
  }

  private static destroyQuietly(client: RedisClientType): void {
    try {
      client.destroy();
    } catch {
      // Already closed
    }
  }
}

export class VisitorRepository {
  private async getClient(): Promise<RedisClientType> {
    return RedisConnection.getClient();
  }

  /**
   * Gets (or creates) the random salt for the given day.
   * Rotating the salt daily means visitor IDs can't be linked across days or
   * reversed back to an IP address.
   */
  async getDailySalt(day: string): Promise<string> {
    const client = await this.getClient();
    const key = `${KEYS.SALT_PREFIX}${day}`;

    await client.set(key, randomBytes(32).toString("hex"), {
      condition: "NX",
      expiration: { type: "EX", value: SALT_TTL_SECONDS },
    });

    const salt = await client.get(key);
    if (!salt) {
      throw new Error("Failed to read daily salt");
    }
    return salt;
  }

  /**
   * Increments the total visitor count and returns the new value.
   */
  async incrementTotalCount(): Promise<number> {
    const client = await this.getClient();
    return client.incr(KEYS.TOTAL_COUNT);
  }

  /**
   * Gets the current total visitor count.
   */
  async getTotalCount(): Promise<number> {
    const client = await this.getClient();
    const count = await client.get(KEYS.TOTAL_COUNT);
    return count ? parseInt(count, 10) : 0;
  }

  /**
   * Adds a visitor ID to the unique visitors set.
   * Returns true if this is a new unique visitor.
   */
  async addUniqueVisitor(visitorId: string): Promise<boolean> {
    const client = await this.getClient();
    // SADD returns the number of elements added (1 if new, 0 if existed)
    const added = await client.sAdd(KEYS.UNIQUE_VISITORS, visitorId);
    return added === 1;
  }

  /**
   * Gets the count of unique visitors.
   */
  async getUniqueCount(): Promise<number> {
    const client = await this.getClient();
    return client.sCard(KEYS.UNIQUE_VISITORS);
  }

  /**
   * Marks a visitor as online using a sorted set, and remembers their country
   * for as long as they're considered online.
   */
  async setVisitorOnline(
    visitorId: string,
    countryCode: string | null,
  ): Promise<void> {
    const client = await this.getClient();
    const now = Date.now();
    const cutoff = now - ONLINE_TTL_SECONDS * 1000;

    const multi = client
      .multi()
      .zAdd(KEYS.ONLINE_SET, { score: now, value: visitorId })
      .zRemRangeByScore(KEYS.ONLINE_SET, 0, cutoff);

    if (countryCode) {
      multi.set(`${KEYS.COUNTRY_PREFIX}${visitorId}`, countryCode, {
        expiration: { type: "EX", value: ONLINE_TTL_SECONDS },
      });
    }

    await multi.exec();
  }

  /**
   * Gets the count of currently online visitors and their countries.
   */
  async getOnline(): Promise<{
    onlineCount: number;
    onlineCountries: { code: string; count: number }[];
  }> {
    const client = await this.getClient();
    const cutoff = Date.now() - ONLINE_TTL_SECONDS * 1000;

    await client.zRemRangeByScore(KEYS.ONLINE_SET, 0, cutoff);
    const onlineIds = await client.zRange(KEYS.ONLINE_SET, 0, -1);

    if (onlineIds.length === 0) {
      return { onlineCount: 0, onlineCountries: [] };
    }

    const codes = await client.mGet(
      onlineIds.map((id) => `${KEYS.COUNTRY_PREFIX}${id}`),
    );

    const countryCounts: Record<string, number> = {};
    for (const code of codes) {
      if (code) {
        countryCounts[code] = (countryCounts[code] ?? 0) + 1;
      }
    }

    return {
      onlineCount: onlineIds.length,
      onlineCountries: Object.entries(countryCounts)
        .map(([code, count]) => ({ code, count }))
        .sort((a, b) => b.count - a.count),
    };
  }

  /**
   * Gets all visitor statistics including online count and countries.
   */
  async getStats(): Promise<VisitorStats> {
    const [totalCount, uniqueCount, online] = await Promise.all([
      this.getTotalCount(),
      this.getUniqueCount(),
      this.getOnline(),
    ]);

    return {
      totalCount,
      uniqueCount,
      ...online,
    };
  }
}

// Singleton instance - like dependency injection in C#
export const visitorRepository = new VisitorRepository();
