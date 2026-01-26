"use client";

import PageLayout from "@/components/templates/PageLayout";
import ExperienceCard from "@/components/organisms/ExperienceCard";
import { experiences } from "@/data/experience";

export default function ExperiencePage() {
  return (
    <PageLayout>
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Experience
            </h1>
            <p className="text-xl text-gray-400">
              My professional journey and career highlights
            </p>
          </div>

          {/* Timeline */}
          <div className="max-w-3xl mx-auto">
            {experiences.map((exp, index) => (
              <ExperienceCard
                key={exp.company}
                company={exp.company}
                role={exp.role}
                period={exp.period}
                description={exp.description}
                technologies={exp.technologies}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
