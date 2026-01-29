import { NextResponse } from "next/server";
import { visitorService } from "@/lib/services/VisitorService";

/**
 * Visitor Stats API Controller
 *
 * Endpoints:
 *   GET /api/visitors/stats - Get visitor statistics without tracking
 */

/**
 * GET /api/visitors/stats
 * Returns visitor statistics without incrementing counts.
 * Useful for displaying stats without affecting them.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const stats = await visitorService.getStats();

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        // Cache for 60 seconds to reduce KV reads
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("[VisitorStatsController] Error fetching stats:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch visitor stats",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
