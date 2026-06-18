import type { Metadata } from "next";
import { CustomPage } from "@/components/custom/CustomPage";

export const metadata: Metadata = {
  title: "Custom 3D Studio — Made-to-Order Wood, Amman",
  description:
    "Upload a photo and watch it become a textured 3D model — then have it handmade in solid wood by Plexus Workshop in Amman, Jordan. تفصيل أثاث خشب حسب الطلب في عمّان مع معاينة ثلاثية الأبعاد.",
};

export default function Page() {
  return <CustomPage />;
}
