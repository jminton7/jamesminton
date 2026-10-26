import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";

const routes = ["", "/about", "/experience", "/skills", "/fun-stuff", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${profile.website}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
