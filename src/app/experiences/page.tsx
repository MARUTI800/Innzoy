import Image from 'next/image';
import Link from 'next/link';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import { EXPERIENCES, BRAND } from '@/data/innzoyData';

export const metadata = {
  title: 'Experiences & Immersions — INNZOY Hotels & Resorts',
  description: 'Curated dining, restorative wellness rituals, master craftsmanship walks, and dawn nature trails.',
};

export default function ExperiencesPage() {
  return (
    <div className="bg-[#FAF8F5] text-[#141413]">
      <PageHero
        eyebrow="CURATED IMMERSIONS"
        title="THE STAY IS MORE THAN THE ROOM"
        subtitle="Thoughtful culinary journeys, biological stillness, and intimate encounters with regional craft."
        bgImage="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=80"
        coordinates="17.4319° N / 78.4073° E"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 space-y-32">
        {/* Section 01: Experiences Detailed Grid */}
        <div className="space-y-24">
          {EXPERIENCES.map((exp, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={exp.id}
                id={exp.id}
                className="scroll-mt-32 border-b border-[#141413]/10 pb-20"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${
                    isEven ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className={`lg:col-span-7 ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}>
                    <div className="relative aspect-[16/10] w-full overflow-hidden shadow-xl bg-stone-100">
                      <Image
                        src={exp.image}
                        alt={exp.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-[#141413]/80 backdrop-blur-md px-3 py-1 font-mono text-[9px] text-white tracking-widest uppercase">
                        {exp.category}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`lg:col-span-5 space-y-6 ${
                      isEven ? 'order-2' : 'order-2 lg:order-1'
                    }`}
                  >
                    <div className="flex items-center space-x-3 text-[10px] font-mono uppercase tracking-[0.3em] text-[#B89F7D]">
                      <span>0{idx + 1}</span>
                      <span>—</span>
                      <span>{exp.category}</span>
                    </div>

                    <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight uppercase">
                      {exp.title}
                    </h2>

                    <p className="font-serif italic text-stone-600 text-sm">
                      &quot;{exp.subtitle}&quot;
                    </p>

                    <p className="text-sm text-[#726E67] font-light leading-relaxed">
                      {exp.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#141413]/8 text-xs font-mono">
                      <div>
                        <span className="text-stone-400 block text-[9px]">LOCATION</span>
                        <span className="text-stone-900">{exp.location}</span>
                      </div>
                      {exp.duration && (
                        <div>
                          <span className="text-stone-400 block text-[9px]">DURATION</span>
                          <span className="text-stone-900">{exp.duration}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <a
                        href={`https://wa.me/918520963096?text=Hello%20INNZOY%2C%20I%20would%20like%20to%20reserve%20the%20${encodeURIComponent(
                          exp.title
                        )}%20experience.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-6 py-3.5 bg-[#141413] text-[#FAF8F5] font-mono text-xs uppercase tracking-[0.2em] hover:bg-[#2C2A29] transition-colors"
                      >
                        <span>INQUIRE WITH CONCIERGE</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Philosophy Callout */}
        <div className="bg-[#F4EFEA] p-10 md:p-16 border border-[#141413]/8 text-center max-w-4xl mx-auto">
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-3">
            TAILORED PRIVATE IMMERSIONS
          </span>
          <h3 className="font-serif text-3xl md:text-4xl font-light text-[#141413]">
            Custom Private Itineraries
          </h3>
          <p className="mt-4 text-sm text-[#726E67] font-light max-w-xl mx-auto leading-relaxed">
            Our silent concierge curates bespoke private arrangements—from intimate rooftop acoustic
            evenings in Kondapur to guided geological rock explorations in Khajaguda.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="px-8 py-4 border border-[#141413] font-mono text-xs uppercase tracking-[0.22em] text-[#141413] hover:bg-[#141413] hover:text-[#FAF8F5] transition-colors inline-block"
            >
              SPEAK WITH A PRIVATE HOST
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
