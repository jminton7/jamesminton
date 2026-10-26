import { createHmac } from "node:crypto";
import {
  visitorRepository,
  VisitorStats,
} from "@/lib/repositories/VisitorRepository";

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
  countryCode: string | null;
}

export class VisitorService {
  /**
   * Tracks a visitor and returns their visitor number.
   * Handles both new and returning visitors.
   */
  async trackVisitor(request: TrackVisitorRequest): Promise<VisitorResponse> {
    const { visitorId, countryCode } = request;

    const [isNewVisitor, visitorNumber] = await Promise.all([
      visitorRepository.addUniqueVisitor(visitorId),
      visitorRepository.incrementTotalCount(),
      visitorRepository.setVisitorOnline(visitorId, countryCode),
    ]);

    const stats = await visitorRepository.getStats();

    return {
      visitorNumber,
      isNewVisitor,
      message: this.buildWelcomeMessage(visitorNumber, isNewVisitor),
      stats,
    };
  }

  /**
   * Gets visitor statistics without tracking a new visit.
   */
  async getStats(): Promise<VisitorStats> {
    return visitorRepository.getStats();
  }

  /**
   * Generates an anonymous visitor ID from the IP and user agent.
   * Uses an HMAC with a random salt that rotates daily, so the ID can't be
   * reversed to an IP or linked to the same person on a different day.
   */
  async generateVisitorId(
    ipAddress: string,
    userAgent: string,
  ): Promise<string> {
    const day = new Date().toISOString().slice(0, 10);
    const salt = await visitorRepository.getDailySalt(day);
    const hash = createHmac("sha256", salt)
      .update(`${ipAddress}|${userAgent}`)
      .digest("base64url")
      .slice(0, 22);
    return `visitor_${hash}`;
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
