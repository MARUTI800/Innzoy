import HeroSection from '@/components/home/HeroSection';
import ManifestoSection from '@/components/home/ManifestoSection';
import FeaturedPropertySection from '@/components/home/FeaturedPropertySection';
import DestinationsSection from '@/components/home/DestinationsSection';
import RoomsPreviewSection from '@/components/home/RoomsPreviewSection';
import ExperiencesSection from '@/components/home/ExperiencesSection';
import DiningSection from '@/components/home/DiningSection';
import WellnessSection from '@/components/home/WellnessSection';
import GallerySection from '@/components/home/GallerySection';
import JournalSection from '@/components/home/JournalSection';
import ReviewsSection from '@/components/home/ReviewsSection';

export default function HomePage() {
  return (
    <div className="w-full overflow-hidden">
      {/* 01. Cinematic Hero with GSAP Preloader & Clip Reveal */}
      <HeroSection />

      {/* 02. Architectural Manifesto: "WE CREATE PLACES TO FEEL SOMETHING" */}
      <ManifestoSection />

      {/* 03. Flagship Property Magazine Spread */}
      <FeaturedPropertySection />

      {/* 04. Editorial Destinations: "PLACES WITH A SENSE OF PLACE" */}
      <DestinationsSection />

      {/* 05. Large Horizontal Suites Showcase */}
      <RoomsPreviewSection />

      {/* 06. Curated Immersions: "THE STAY IS MORE THAN THE ROOM" */}
      <ExperiencesSection />

      {/* 07. Culinary Culture: "DINING AT INNZOY" */}
      <DiningSection />

      {/* 08. Recovery & Stillness: "TIME TO SLOW DOWN" */}
      <WellnessSection />

      {/* 09. Lightbox Photo Archive */}
      <GallerySection />

      {/* 10. Editorial Journal Essays */}
      <JournalSection />

      {/* 11. Verified Guest Testimonials */}
      <ReviewsSection />
    </div>
  );
}
