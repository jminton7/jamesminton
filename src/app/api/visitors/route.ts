import { NextRequest, NextResponse } from "next/server";
import { visitorService } from "@/lib/services/VisitorService";

/**
 * Visitors API Controller
 *
 * Endpoints:
 *   GET  /api/visitors - Track a visit and return visitor stats
 *
 * Similar to a C# API Controller - handles HTTP concerns,
 * delegates business logic to services.
 */

/**
 * GET /api/visitors
 * Tracks a visitor and returns their visitor number and stats.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Extract visitor identification from request
    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") ?? "unknown";

    // Generate a consistent visitor ID
    const visitorId = visitorService.generateVisitorId(ipAddress, userAgent);

    // Track the visitor (business logic in service)
    const result = await visitorService.trackVisitor({
      visitorId,
      userAgent,
      ipAddress,
    });

    // Return success response
    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store", // Don't cache visitor counts
      },
    });
  } catch (error) {
    // Log error (in production, use proper logging)
    console.error("[VisitorsController] Error tracking visitor:", error);

    // Return error response
    return NextResponse.json(
      {
        error: "Failed to track visitor",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * Extracts the client IP address from the request.
 * Handles various proxy headers (Vercel, Cloudflare, etc.)
 */
function getClientIp(request: NextRequest): string {
  // Vercel's dedicated header for real client IP (most reliable on Vercel)
  const vercelIp = request.headers.get("x-real-ip");
  if (vercelIp) {
    return vercelIp;
  }

  // Vercel also sets x-forwarded-for but it may contain proxy chain
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Take the first IP (original client) if there are multiple
    return forwardedFor.split(",")[0].trim();
  }

  // Cloudflare
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback
  return "unknown";
}
