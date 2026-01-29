/**
 * GeolocationService - Fetches location data from IP addresses.
 * Uses ip-api.com (free, no API key required, 45 req/min limit).
 */

export interface GeoLocation {
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  isp?: string;
}

export class GeolocationService {
  private static readonly API_URL = "http://ip-api.com/json";

  /**
   * Fetches geolocation data for an IP address.
   * Returns null if the lookup fails or rate limited.
   */
  async getLocation(ipAddress: string): Promise<GeoLocation | null> {
    // Skip local/private IPs
    if (this.isPrivateIp(ipAddress)) {
      return {
        ip: ipAddress,
        country: "Local",
        countryCode: "XX",
        city: "Development",
        region: "Local",
      };
    }

    try {
      const response = await fetch(
        `${GeolocationService.API_URL}/${ipAddress}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,query`,
        {
          // Cache for 24 hours - IP locations rarely change
          next: { revalidate: 86400 },
        },
      );

      if (!response.ok) {
        console.warn(`[Geolocation] API error: ${response.status}`);
        return null;
      }

      const data = await response.json();

      if (data.status === "fail") {
        console.warn(`[Geolocation] Lookup failed: ${data.message}`);
        return null;
      }

      return {
        ip: data.query,
        country: data.country,
        countryCode: data.countryCode,
        city: data.city,
        region: data.regionName,
        lat: data.lat,
        lon: data.lon,
        timezone: data.timezone,
        isp: data.isp,
      };
    } catch (error) {
      console.error("[Geolocation] Error fetching location:", error);
      return null;
    }
  }

  /**
   * Checks if an IP address is private/local.
   */
  private isPrivateIp(ip: string): boolean {
    if (!ip || ip === "unknown" || ip === "::1" || ip === "127.0.0.1") {
      return true;
    }

    // Check for private IP ranges
    const parts = ip.split(".");
    if (parts.length === 4) {
      const first = parseInt(parts[0], 10);
      const second = parseInt(parts[1], 10);

      // 10.x.x.x, 192.168.x.x, 172.16-31.x.x
      if (first === 10) return true;
      if (first === 192 && second === 168) return true;
      if (first === 172 && second >= 16 && second <= 31) return true;
    }

    return false;
  }

  /**
   * Converts a country code to a flag emoji.
   * e.g., "GB" -> "🇬🇧", "US" -> "🇺🇸"
   */
  static countryCodeToFlag(countryCode: string): string {
    if (!countryCode || countryCode.length !== 2) return "🌍";

    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));

    return String.fromCodePoint(...codePoints);
  }
}

// Singleton instance
export const geolocationService = new GeolocationService();
