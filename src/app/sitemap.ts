import type { MetadataRoute } from "next";

const routes = [
  "",
  "/dashboard",
  "/study",
  "/mistakes",
  "/revisions",
  "/jee",
  "/tracker",
  "/blocker",
  "/coach",
  "/analytics",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://focusforge.local";

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "monthly" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
