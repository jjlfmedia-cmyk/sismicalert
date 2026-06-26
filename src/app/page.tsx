import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhatIsSection from "@/components/WhatIsSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CountriesSection from "@/components/CountriesSection";
import LiveEarthquakes from "@/components/LiveEarthquakes";
import APISourcesSection from "@/components/APISourcesSection";
import RescueSection from "@/components/RescueSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <WhatIsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <LiveEarthquakes />
        <CountriesSection />
        <APISourcesSection />
        <RescueSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
