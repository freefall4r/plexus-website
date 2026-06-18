import type { Metadata } from "next";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopClient } from "@/components/shop/ShopClient";
import { getCatalogue } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Shop — Custom Wood Furniture in Amman",
  description:
    "Handmade pieces from Plexus Workshop in Amman, Jordan — sculptural objects and custom furniture in solid wood, stone & metal, each made to order. أثاث وتفصيل خشب طبيعي في عمّان.",
};

// Re-check Sanity periodically so new products appear without a redeploy.
export const revalidate = 30;

export default async function ShopPage() {
  const items = await getCatalogue();
  return (
    <div className="pb-28">
      <ShopHeader />
      <div className="mt-12 px-5 md:px-10">
        <ShopClient items={items} />
      </div>
    </div>
  );
}
