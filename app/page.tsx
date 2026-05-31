import { HomeBackground } from "@/components/home/HomeBackground";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Process } from "@/components/home/Process";
import { Featured } from "@/components/home/Featured";
import { CustomTeaser } from "@/components/home/CustomTeaser";
import { WoodMarquee } from "@/components/home/WoodMarquee";

export default function Home() {
  return (
    <div className="relative bg-[#160e07]">
      {/* one persistent 3D background behind the whole page (click-through) */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <HomeBackground />
      </div>

      <div className="relative z-10">
        <Hero />
        <Manifesto />
        <WoodMarquee />
        <Featured />
        <CustomTeaser />
        <Process />
      </div>
    </div>
  );
}
