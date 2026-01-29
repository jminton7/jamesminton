import HeroSection from "@/components/organisms/HeroSection";
import SectionLayout from "@/components/templates/SectionLayout";
import ExperienceCard from "@/components/organisms/ExperienceCard";
import FunProjectCard from "@/components/organisms/FunProjectCard";
import SkillsGrid from "@/components/organisms/SkillsGrid";
import AboutSection from "@/components/organisms/AboutSection";
import ContactSection from "@/components/organisms/ContactSection";
import Footer from "@/components/organisms/Footer";
import BusinessCard from "@/components/organisms/BusinessCard";
import VisitorCounterCard from "@/components/molecules/VisitorCounterCard";
import { profile, about } from "@/data/profile";
import { experiences } from "@/data/experience";
import { funProjects } from "@/data/funProjects";
import { skillCategories } from "@/data/skills";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Business Card */}
      <BusinessCard
        name={profile.name}
        title={profile.title}
        email={profile.email}
        location={profile.location}
      />

      {/* Hero Section */}
      <HeroSection
        name={profile.name}
        title={profile.title}
        tagline={profile.tagline}
      />

      {/* About Section */}
      <AboutSection bio={about.bio} highlights={about.highlights} />

      {/* Experience Section */}
      <SectionLayout
        title="Experience"
        subtitle="My professional journey and the companies I've worked with"
      >
        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, index) => (
            <ExperienceCard
              key={exp.id}
              company={exp.company}
              role={exp.role}
              period={exp.period}
              description={exp.description}
              technologies={exp.technologies}
              index={index}
            />
          ))}
        </div>
      </SectionLayout>

      {/* Fun Projects Section */}
      <SectionLayout
        title="Fun Stuff"
        subtitle="Experimental projects and API integrations I'm building for fun"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <VisitorCounterCard />

          {funProjects.slice(0, 5).map((project, index) => (
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
      </SectionLayout>

      {/* Skills Section */}
      <SectionLayout
        title="Skills & Technologies"
        subtitle="The tools and technologies I work with"
      >
        <SkillsGrid categories={skillCategories} />
      </SectionLayout>

      {/* Contact Section */}
      <ContactSection email={profile.email} />

      <Footer />
    </main>
  );
}
