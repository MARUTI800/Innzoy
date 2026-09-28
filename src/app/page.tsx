import HeroSection from '@/components/home/HeroSection';
import PropertiesSection from '@/components/home/PropertiesSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <div className="w-full bg-[#F4F1EA]">
      <HeroSection />
      <PropertiesSection />
      <ReviewsSection />
      <ContactSection />
    </div>
  );
}
