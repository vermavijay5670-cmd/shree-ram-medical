import { LoadingScreen } from "@/components/marketing/LoadingScreen";
import { Hero } from "@/components/marketing/Hero";
import { StatsCounter } from "@/components/marketing/StatsCounter";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function HomePage() {
  return (
    <>
      <LoadingScreen />
      <Navbar position="fixed" />
      <Hero />
      <StatsCounter />
      <Footer />
    </>
  );
}
