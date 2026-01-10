import AIFeaturesSection from "../../components/ui/home/AIFeaturesSection";
import AwardsSection from "../../components/ui/home/AwardsSection";
import BrandsSection from "../../components/ui/home/BrandsSection";
import FeedbackCarousel from "../../components/ui/home/FeedbackCarousel";
import GetStartedSection from "../../components/ui/home/GetStartedSection";
import HeroSection from "../../components/ui/home/HeroSection";
import PageSectionOne from "../../components/ui/home/PageSectionOne";
import ScheduleForm from "../../components/ui/home/ScheduleForm";
import SpecialOffersSection from "../../components/ui/home/SpecialOffersSection";

export default function Home() {
  return (
    <section className="space-y-3">
      <HeroSection />
      <BrandsSection />
      <PageSectionOne />
      <GetStartedSection />
      <AwardsSection />
      <AIFeaturesSection />
      <SpecialOffersSection />
      <FeedbackCarousel />
      <ScheduleForm />
    </section>
  );
}
