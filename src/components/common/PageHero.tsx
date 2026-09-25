import Image from 'next/image';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  bgImage?: string;
  coordinates?: string;
}

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  bgImage = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2000&q=85",
  coordinates = "17.4319° N / 78.4073° E",
}: PageHeroProps) {
  return (
    <div className="relative pt-44 pb-24 md:pt-52 md:pb-32 px-6 md:px-12 bg-[#141413] text-[#FAF8F5] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.4] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-[#141413]/50 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 text-[10px] font-mono uppercase tracking-[0.35em] text-[#B89F7D] mb-4">
          <span>{eyebrow}</span>
          <span>·</span>
          <span>{coordinates}</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight uppercase leading-[1.02] max-w-4xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-6 text-stone-300 text-sm md:text-lg font-light leading-relaxed max-w-2xl border-l border-white/20 pl-5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
