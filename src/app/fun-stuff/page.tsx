"use client";

import PageLayout from "@/components/templates/PageLayout";
import FunProjectCard from "@/components/organisms/FunProjectCard";
import VisitorCounterCard from "@/components/molecules/VisitorCounterCard";
import { funProjects } from "@/data/funProjects";

export default function FunStuffPage() {
  return (
    <PageLayout>
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Fun Stuff
            </h1>
            <p className="text-xl text-gray-400">
              Experimental projects and API integrations I&apos;m building for
              fun
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Live Visitor Counter - Featured first! */}
            <VisitorCounterCard />

            {funProjects.map((project, index) => (
              <FunProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                icon={project.icon}
                technologies={project.technologies}
                status={project.status}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
