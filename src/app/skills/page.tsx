"use client";

import PageLayout from "@/components/templates/PageLayout";
import SkillsGrid from "@/components/organisms/SkillsGrid";
import { skillCategories } from "@/data/skills";

export default function SkillsPage() {
  return (
    <PageLayout>
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Skills & Technologies
            </h1>
            <p className="text-xl text-gray-400">
              The tools and technologies I work with
            </p>
          </div>

          {/* Skills Grid */}
          <SkillsGrid categories={skillCategories} />
        </div>
      </section>
    </PageLayout>
  );
}
