import PageLayout from "@/components/templates/PageLayout";
import { about } from "@/data/profile";

export default function AboutPage() {
  return (
    <PageLayout>
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              About Me
            </h1>
            <p className="text-xl text-gray-400">Get to know me better</p>
          </div>

          {/* Bio */}
          <div className="space-y-6 mb-16">
            {about.bio.map((paragraph, index) => (
              <p key={index} className="text-gray-300 text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {about.highlights.map((highlight) => (
              <div
                key={highlight.label}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-center"
              >
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  {highlight.value}
                </p>
                <p className="text-gray-400 text-sm mt-2">{highlight.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
