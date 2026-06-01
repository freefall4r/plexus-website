import { HomeBackground } from "@/components/home/HomeBackground";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Process } from "@/components/home/Process";
import { Gallery } from "@/components/home/Gallery";
import { CustomTeaser } from "@/components/home/CustomTeaser";

export default function Home() {
  return (
    <div className="relative bg-bone">
      {/* limewash wall — fixed underlay, painted once (no scroll repaint) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 limewash" />
      {/* one persistent 3D background behind the whole page (click-through) */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <HomeBackground />
      </div>

      <div className="relative z-10">
        <Hero />
        <Manifesto />
        <Gallery />
        <CustomTeaser />
        <Process />
      </div>
    </div>
  );
}
