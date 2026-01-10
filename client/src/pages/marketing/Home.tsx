import AwardsSection from "../../components/ui/home/AwardsSection";
import BrandsSection from "../../components/ui/home/BrandsSection";
import GetStartedSection from "../../components/ui/home/GetStartedSection";
import HeroSection from "../../components/ui/home/HeroSection";
import PageSectionOne from "../../components/ui/home/PageSectionOne";

export default function Home() {
  return (
    <section className="space-y-3">
      <HeroSection />
      <BrandsSection />
      <PageSectionOne />
      <GetStartedSection />
      <AwardsSection />
    </section>
  );
}
