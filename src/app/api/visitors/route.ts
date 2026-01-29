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

    // Skip bots and crawlers - only track real users
    if (isBot(userAgent) || isBotIp(ipAddress)) {
      const stats = await visitorService.getStats();
      return NextResponse.json(
        {
          visitorNumber: 0,
          isNewVisitor: false,
          message: "Stats only (bot detected)",
          stats,
        },
        { status: 200 },
      );
    }

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

/**
 * Detects bots, crawlers, and monitoring services.
 * These shouldn't count as real visitors.
 */
function isBot(userAgent: string): boolean {
  const lowerUA = userAgent.toLowerCase();

  // Common bot identifiers (case-insensitive substring match)
  const botKeywords = [
    // Search engines
    "googlebot",
    "bingbot",
    "yandexbot",
    "duckduckbot",
    "baiduspider",
    "slurp", // Yahoo
    // Social media
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "pinterestbot",
    "whatsapp",
    "telegrambot",
    // Monitoring & uptime
    "uptimerobot",
    "pingdom",
    "statuscake",
    "newrelic",
    "datadog",
    "site24x7",
    // HTTP libraries (likely programmatic access)
    "node-fetch",
    "axios",
    "python-requests",
    "httpx",
    "curl/",
    "wget/",
    // Headless browsers
    "headlesschrome",
    "phantomjs",
    "selenium",
    "puppeteer",
    "playwright",
    // Preview/embed
    "slackbot",
    "discordbot",
    // Generic bot patterns - be careful not to match "robot" in legitimate UAs
    "spider",
    "crawl",
    "scraper",
  ];

  return botKeywords.some((keyword) => lowerUA.includes(keyword));
}

/**
 * Detects known bot/crawler IP ranges.
 * These are IPs from cloud providers and search engines that crawl sites.
 */
function isBotIp(ip: string): boolean {
  // Known bot IP prefixes (Google, Vercel, AWS monitoring, etc.)
  const botIpPrefixes = [
    // Google (Web Rendering Service, crawlers)
    "66.102.",
    "66.249.",
    "64.233.",
    "72.14.",
    "209.85.",
    "216.239.",
    // Vercel (edge functions, monitoring)
    "76.76.21.",
    // Common cloud monitoring/health checks
    "52.53.", // AWS (often monitoring)
    "54.215.",
    "54.176.",
    "54.193.",
    // DigitalOcean monitoring
    "143.198.",
    "161.35.",
    "146.190.",
    "164.92.",
  ];

  return botIpPrefixes.some((prefix) => ip.startsWith(prefix));
}
