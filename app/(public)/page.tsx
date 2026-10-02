import Container from "@/components/ui/Container";
import HeroSection from "@/components/herosection"
import PricingSection from "@/components/PricingSection";
import CustomSolutions from "@/components/custom";
import TravelNews from "@/components/TravelNews";
import ScrollToTop from "@/components/ui/ScrollToTop";


export default function Home() {
  return (
    <main>
      <section>
      
        <HeroSection />
        <Container>
        <PricingSection />
         <CustomSolutions />
         <TravelNews />
        </Container>
     
      </section>
      <ScrollToTop />
    </main>
  );
}
