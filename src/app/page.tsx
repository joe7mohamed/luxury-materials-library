import { HeroSection } from "@/components/sections/hero-section";
import { CategorySection } from "@/components/sections/category-section";
import { FeaturedMaterials } from "@/components/sections/featured-materials";
import { BenefitsSection } from "@/components/sections/benefits-section";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <CategorySection />
      <FeaturedMaterials />
      <BenefitsSection />
    </main>
  );
}
