import { HeroRedesign } from "@/components/redesign/HeroRedesign";
import { Philosophy } from "@/components/redesign/Philosophy";
import { WorkGrid } from "@/components/redesign/WorkGrid";
import { CustomFeature } from "@/components/redesign/CustomFeature";
import { Research } from "@/components/redesign/Research";
import { MakerProcess } from "@/components/redesign/MakerProcess";
import { ContactCommission } from "@/components/redesign/ContactCommission";
import { getHomeContent } from "@/lib/home";

// Re-check Sanity periodically so edits appear without a redeploy.
export const revalidate = 30;

export default async function Home() {
  const home = await getHomeContent();
  return (
    <>
      <HeroRedesign content={home?.hero} />
      <Philosophy content={home?.philosophy} />
      <WorkGrid content={home?.work} />
      <CustomFeature content={home?.studio} />
      <Research content={home?.research} />
      <MakerProcess content={home?.craft} />
      <ContactCommission content={home?.contact} />
    </>
  );
}
