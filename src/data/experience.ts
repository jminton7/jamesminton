/**
 * Work experience data - Professional history displayed on Experience page.
 * Listed in reverse chronological order (most recent first).
 */

export const experiences = [
  {
    id: "bytes-lead",
    company: "Bytes Software Services",
    role: "Full Stack Lead Software Engineer",
    period: "Apr 2022 - Present",
    description:
      "Leading a team of 5 engineers through the transition from a modular monolith to modern microservices. Spearheading large-scale features including white labeling, theming, third-party Microsoft SaaS offers integration, and multi-service syncing managing 200,000+ subscription records. Led the first-ever exposure of internal APIs externally with comprehensive security measures.",
    technologies: [
      "React.js 18",
      "Next.js 15",
      ".NET 9",
      "Azure Functions",
      "Temporal.io",
      "TanStack Query",
      "Tailwind CSS",
    ],
  },
  {
    id: "bytes-engineer",
    company: "Bytes Software Services",
    role: "Full Stack Software Engineer",
    period: "2016 - 2022",
    description:
      "Pioneered the initial Razor Forms frontend and ASP.NET MVC backend for Microsoft CSP integration, now driving approximately £15 million in monthly revenue. Built and maintained over 20 managed SDKs and REST APIs. Engineered the company's first Next.js-based analytics platform with Power BI integration.",
    technologies: [
      "ASP.NET MVC",
      "Razor Forms",
      "JavaScript",
      "jQuery",
      "SQL Server",
      "Power BI",
      "Next.js",
    ],
  },
  {
    id: "cranswick",
    company: "Cranswick Computing",
    role: "Full Stack Junior Software Engineer",
    period: "2014 - 2016",
    description:
      "Designed, implemented, and deployed complete C# WinForms and Crystal Reports systems for warehouse management clients. Delivered fully documented and production-ready software, improving operational workflows.",
    technologies: ["C#", "WinForms", "Crystal Reports", "SQL Server"],
  },
];
