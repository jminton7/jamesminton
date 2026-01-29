import { createClient, RedisClientType } from "redis";

/**
 * VisitorRepository - Data access layer for visitor tracking.
 * Wraps Redis operations with a clean interface.
 */

// Keys used in Redis storage
const KEYS = {
  TOTAL_COUNT: "visitors:total_count",
  UNIQUE_VISITORS: "visitors:unique_set",
  ONLINE_SET: "visitors:online_set", // Sorted set with timestamps
  VISITOR_DATA: "visitors:data", // Hash map for visitor details
  COUNTRY_STATS: "visitors:countries", // Hash map for country counts
} as const;

// How long (in seconds) before a user is considered "offline"
const ONLINE_TTL_SECONDS = 300; // 5 minutes

export interface VisitorLocation {
  country: string;
  countryCode: string;
  city: string;
  region: string;
}

export interface VisitorInfo {
  id: string;
  ip: string;
  location: VisitorLocation | null;
  lastSeen: Date;
  firstSeen: Date;
  visitCount: number;
}

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
    // Return existing client if connected
    if (this.client?.isOpen) {
      return this.client;
    }

    // If connection is in progress, wait for it
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // Start new connection
    this.connectionPromise = this.connect();
    return this.connectionPromise;
  }

  private static async connect(): Promise<RedisClientType> {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      throw new Error("REDIS_URL environment variable is not set");
    }

    this.client = createClient({ url: redisUrl });

    // Handle connection errors
    this.client.on("error", (err) => {
      console.error("[Redis] Connection error:", err);
    });

    await this.client.connect();
    console.log("[Redis] Connected successfully");

    return this.client;
  }
}

export class VisitorRepository {
  /**
   * Gets the Redis client (connects if needed).
   */
  private async getClient(): Promise<RedisClientType> {
    return RedisConnection.getClient();
  }

  /**
   * Increments the total visitor count and returns the new value.
   */
  async incrementTotalCount(): Promise<number> {
    const client = await this.getClient();
    const count = await client.incr(KEYS.TOTAL_COUNT);
    return count;
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
    const count = await client.sCard(KEYS.UNIQUE_VISITORS);
    return count ?? 0;
  }

  /**
   * Marks a visitor as online using a sorted set.
   * The score is the timestamp, allowing us to remove stale entries.
   */
  async setVisitorOnline(visitorId: string): Promise<void> {
    const client = await this.getClient();
    const now = Date.now();

    // Add/update visitor in sorted set with current timestamp as score
    await client.zAdd(KEYS.ONLINE_SET, {
      score: now,
      value: visitorId,
    });

    // Clean up stale entries (older than TTL)
    const cutoff = now - ONLINE_TTL_SECONDS * 1000;
    await client.zRemRangeByScore(KEYS.ONLINE_SET, 0, cutoff);
  }

  /**
   * Stores visitor information including location.
   */
  async saveVisitorInfo(
    visitorId: string,
    ip: string,
    location: VisitorLocation | null,
  ): Promise<void> {
    const client = await this.getClient();
    const key = `${KEYS.VISITOR_DATA}:${visitorId}`;
    const now = Date.now();

    // Check if visitor exists
    const existing = await client.hGet(key, "firstSeen");

    const data: Record<string, string> = {
      id: visitorId,
      ip: ip,
      lastSeen: now.toString(),
      visitCount: "1",
    };

    if (existing) {
      // Update existing visitor
      const currentCount = await client.hGet(key, "visitCount");
      data.visitCount = (parseInt(currentCount ?? "0", 10) + 1).toString();
    } else {
      // New visitor
      data.firstSeen = now.toString();
    }

    if (location) {
      data.country = location.country;
      data.countryCode = location.countryCode;
      data.city = location.city;
      data.region = location.region;

      // Increment country counter
      await client.hIncrBy(KEYS.COUNTRY_STATS, location.countryCode, 1);
    }

    await client.hSet(key, data);
  }

  /**
   * Gets visitor information by ID.
   */
  async getVisitorInfo(visitorId: string): Promise<VisitorInfo | null> {
    const client = await this.getClient();
    const key = `${KEYS.VISITOR_DATA}:${visitorId}`;

    const data = await client.hGetAll(key);
    if (!data || !data.id) return null;

    return {
      id: data.id,
      ip: data.ip,
      location: data.countryCode
        ? {
            country: data.country,
            countryCode: data.countryCode,
            city: data.city,
            region: data.region,
          }
        : null,
      lastSeen: new Date(parseInt(data.lastSeen, 10)),
      firstSeen: new Date(parseInt(data.firstSeen, 10)),
      visitCount: parseInt(data.visitCount, 10),
    };
  }

  /**
   * Gets country statistics for online visitors.
   */
  async getOnlineCountries(): Promise<{ code: string; count: number }[]> {
    const client = await this.getClient();
    const now = Date.now();
    const cutoff = now - ONLINE_TTL_SECONDS * 1000;

    // Clean up stale entries
    await client.zRemRangeByScore(KEYS.ONLINE_SET, 0, cutoff);

    // Get all online visitor IDs
    const onlineIds = await client.zRange(KEYS.ONLINE_SET, 0, -1);

    // Count countries
    const countryCounts: Record<string, number> = {};

    for (const visitorId of onlineIds) {
      const info = await this.getVisitorInfo(visitorId);
      if (info?.location?.countryCode) {
        const code = info.location.countryCode;
        countryCounts[code] = (countryCounts[code] ?? 0) + 1;
      }
    }

    // Convert to array and sort by count
    return Object.entries(countryCounts)
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Gets the count of currently online visitors.
   */
  async getOnlineCount(): Promise<number> {
    const client = await this.getClient();
    const now = Date.now();
    const cutoff = now - ONLINE_TTL_SECONDS * 1000;

    // First, clean up stale entries
    await client.zRemRangeByScore(KEYS.ONLINE_SET, 0, cutoff);

    // Count remaining (active) entries
    const count = await client.zCard(KEYS.ONLINE_SET);
    return count;
  }

  /**
   * Checks if a visitor is currently marked as online.
   */
  async isVisitorOnline(visitorId: string): Promise<boolean> {
    const client = await this.getClient();
    const score = await client.zScore(KEYS.ONLINE_SET, visitorId);
    if (score === null) return false;

    // Check if the entry is still valid (not expired)
    const cutoff = Date.now() - ONLINE_TTL_SECONDS * 1000;
    return score > cutoff;
  }

  /**
   * Gets all visitor statistics including online count and countries.
   */
  async getStats(): Promise<VisitorStats> {
    const [totalCount, uniqueCount, onlineCount, onlineCountries] =
      await Promise.all([
        this.getTotalCount(),
        this.getUniqueCount(),
        this.getOnlineCount(),
        this.getOnlineCountries(),
      ]);

    return {
      totalCount,
      uniqueCount,
      onlineCount,
      onlineCountries,
    };
  }

  /**
   * Gets all data for debugging purposes.
   * Only use in development!
   */
  async getDebugData(): Promise<{
    totalCount: number;
    uniqueVisitors: string[];
    onlineVisitors: VisitorInfo[];
    countryStats: Record<string, number>;
  }> {
    const client = await this.getClient();

    const [totalCount, uniqueVisitors, onlineRaw, countryStatsRaw] =
      await Promise.all([
        this.getTotalCount(),
        client.sMembers(KEYS.UNIQUE_VISITORS),
        client.zRangeWithScores(KEYS.ONLINE_SET, 0, -1),
        client.hGetAll(KEYS.COUNTRY_STATS),
      ]);

    // Get full info for each online visitor
    const onlineVisitors: VisitorInfo[] = [];
    for (const entry of onlineRaw) {
      const info = await this.getVisitorInfo(entry.value);
      if (info) {
        onlineVisitors.push(info);
      }
    }

    // Parse country stats
    const countryStats: Record<string, number> = {};
    for (const [code, count] of Object.entries(countryStatsRaw)) {
      countryStats[code] = parseInt(count, 10);
    }

    return {
      totalCount,
      uniqueVisitors,
      onlineVisitors,
      countryStats,
    };
  }
}

// Singleton instance - like dependency injection in C#
export const visitorRepository = new VisitorRepository();
