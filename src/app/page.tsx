import HeroSection from '@/components/home/HeroSection';
import PropertiesSection from '@/components/home/PropertiesSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import ContactSection from '@/components/home/ContactSection';
import { HospitalityIntroduction, HospitalityStory, HospitalityGallery } from '@/components/home/HospitalityScenes';

export default function HomePage() {
  return (
    <div className="open-house-home">
      <HeroSection />
      <HospitalityIntroduction />
      <PropertiesSection />
      <HospitalityStory />
      <HospitalityGallery />
      <ReviewsSection />
      <ContactSection />
    </div>
  );
}
