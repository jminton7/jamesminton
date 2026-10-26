import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name}, ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#030712",
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(147, 51, 234, 0.45), transparent 55%), radial-gradient(circle at 85% 85%, rgba(37, 99, 235, 0.4), transparent 55%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#c084fc",
            fontFamily: "monospace",
            marginBottom: 24,
          }}
        >
          $ whoami
        </div>
        <div style={{ display: "flex", fontSize: 96, fontWeight: 700 }}>
          {profile.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 44,
            marginTop: 16,
            backgroundImage: "linear-gradient(90deg, #c084fc, #60a5fa)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {profile.title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#9ca3af",
            marginTop: 48,
          }}
        >
          {`${profile.location} · jamesminton.dev`}
        </div>
      </div>
    ),
    size,
  );
}
