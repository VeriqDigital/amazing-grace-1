import About from "@/components/sections/About";
import Events from "@/components/sections/Events";
import Hero from "@/components/sections/Hero";
import SellAntiques from "@/components/sections/SellAntiques";
import ShopGallery from "@/components/sections/ShopGallery";
import Visit from "@/components/sections/Visit";

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <ShopGallery />
      <Events />
      <SellAntiques />
      <Visit />
    </>
  );
}
