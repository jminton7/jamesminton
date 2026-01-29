import {
  visitorRepository,
  VisitorStats,
} from "@/lib/repositories/VisitorRepository";
import { geolocationService } from "@/lib/services/GeolocationService";

/**
 * VisitorService - Business logic layer for visitor tracking.
 * Handles the rules and orchestration, delegates data access to repository.
 *
 * Similar to a C# service class - contains business logic, not data access.
 */

export interface VisitorResponse {
  visitorNumber: number;
  isNewVisitor: boolean;
  message: string;
  stats: VisitorStats;
}

export interface TrackVisitorRequest {
  visitorId: string;
  userAgent?: string;
  ipAddress?: string;
}

export class VisitorService {
  /**
   * Tracks a visitor and returns their visitor number.
   * Handles both new and returning visitors.
   */
  async trackVisitor(request: TrackVisitorRequest): Promise<VisitorResponse> {
    const { visitorId, ipAddress } = request;

    // Check if this is a new unique visitor
    const isNewVisitor = await visitorRepository.addUniqueVisitor(visitorId);

    // Increment total count (page views)
    const visitorNumber = await visitorRepository.incrementTotalCount();

    // Mark as online
    await visitorRepository.setVisitorOnline(visitorId);

    // Fetch and store location (async, don't block response)
    if (ipAddress) {
      this.fetchAndStoreLocation(visitorId, ipAddress).catch((err) => {
        console.error("[VisitorService] Error storing location:", err);
      });
    }

    // Get current stats
    const stats = await visitorRepository.getStats();

    // Build response
    const message = this.buildWelcomeMessage(visitorNumber, isNewVisitor);

    return {
      visitorNumber,
      isNewVisitor,
      message,
      stats,
    };
  }

  /**
   * Fetches geolocation and stores visitor info.
   */
  private async fetchAndStoreLocation(
    visitorId: string,
    ipAddress: string,
  ): Promise<void> {
    const location = await geolocationService.getLocation(ipAddress);

    await visitorRepository.saveVisitorInfo(
      visitorId,
      ipAddress,
      location
        ? {
            country: location.country,
            countryCode: location.countryCode,
            city: location.city,
            region: location.region,
          }
        : null,
    );
  }

  /**
   * Gets visitor statistics without tracking a new visit.
   */
  async getStats(): Promise<VisitorStats> {
    return visitorRepository.getStats();
  }

  /**
   * Generates a visitor ID from request headers.
   * In production, you might use a more sophisticated fingerprinting approach.
   */
  generateVisitorId(ipAddress: string, userAgent: string): string {
    // Simple hash of IP + User Agent for unique-ish identification
    const input = `${ipAddress}-${userAgent}`;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `visitor_${Math.abs(hash).toString(36)}`;
  }

  /**
   * Builds a welcome message based on visitor status.
   */
  private buildWelcomeMessage(
    visitorNumber: number,
    isNewVisitor: boolean,
  ): string {
    const formattedNumber = visitorNumber.toLocaleString();

    if (isNewVisitor) {
      return `Welcome! You are visitor #${formattedNumber} 🎉`;
    }
    return `Welcome back! Total visits: ${formattedNumber}`;
  }
}

// Singleton instance
export const visitorService = new VisitorService();
