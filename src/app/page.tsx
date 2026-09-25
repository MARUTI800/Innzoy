import HeroSection from '@/components/home/HeroSection';
import ManifestoSection from '@/components/home/ManifestoSection';
import FeaturedPropertySection from '@/components/home/FeaturedPropertySection';
import TheCollection from '@/components/home/TheCollection';
import ArchitectureSection from '@/components/home/ArchitectureSection';
import ExperiencesSection from '@/components/home/ExperiencesSection';
import JournalSection from '@/components/home/JournalSection';
import BookingSection from '@/components/home/BookingSection';
import FinalStatement from '@/components/home/FinalStatement';

export default function HomePage() {
  return (
    <div className="w-full overflow-hidden bg-[#F4F1EA]">
      {/* 01. Arrival / Hero & The First Scroll */}
      <HeroSection />

      {/* 02. Philosophy: "PLACES DESIGNED TO STAY WITH YOU." */}
      <ManifestoSection />

      {/* 03. Featured Place: Large Editorial Composition */}
      <FeaturedPropertySection />

      {/* 04. The Collection: Interactive Property Index */}
      <TheCollection />

      {/* 05. Architecture / Place: Form, Light & Vernacular Mass */}
      <ArchitectureSection />

      {/* 06. Experiences: "THE STAY EXTENDS BEYOND THE ROOM." */}
      <ExperiencesSection />

      {/* 07. Editorial Journal: "STORIES FROM INNZOY" */}
      <JournalSection />

      {/* 08. Booking: "WHERE WILL YOU GO NEXT?" */}
      <BookingSection />

      {/* 09. Final Statement: "STAY A LITTLE LONGER." */}
      <FinalStatement />
    </div>
  );
}
