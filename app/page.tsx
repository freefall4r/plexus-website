import { HeroRedesign } from "@/components/redesign/HeroRedesign";
import { Philosophy } from "@/components/redesign/Philosophy";
import { WorkGrid } from "@/components/redesign/WorkGrid";
import { CustomFeature } from "@/components/redesign/CustomFeature";
import { Research } from "@/components/redesign/Research";
import { MakerProcess } from "@/components/redesign/MakerProcess";
import { ContactCommission } from "@/components/redesign/ContactCommission";

export default function Home() {
  return (
    <>
      <HeroRedesign />
      <Philosophy />
      <WorkGrid />
      <CustomFeature />
      <Research />
      <MakerProcess />
      <ContactCommission />
    </>
  );
}
