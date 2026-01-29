import { NextResponse } from "next/server";
import { visitorRepository } from "@/lib/repositories/VisitorRepository";

/**
 * Debug API Controller - View Redis data
 *
 * GET /api/visitors/debug - Returns all visitor data for debugging
 *
 * ⚠️ WARNING: Only use in development! Remove or protect in production.
 */

export async function GET(): Promise<NextResponse> {
  // Optional: Block in production
  // if (process.env.NODE_ENV === "production") {
  //   return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  // }

  try {
    const debugData = await visitorRepository.getDebugData();
    const stats = await visitorRepository.getStats();

    return NextResponse.json(
      {
        stats,
        debug: {
          ...debugData,
          redisKeys: {
            totalCount: "visitors:total_count",
            uniqueVisitors: "visitors:unique_set",
            onlineSet: "visitors:online_set",
          },
          onlineTTL: "5 minutes",
        },
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("[DebugController] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch debug data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
