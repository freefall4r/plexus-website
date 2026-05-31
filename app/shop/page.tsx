import type { Metadata } from "next";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop — The Collection",
  description:
    "One hundred handmade wooden pieces from PLEXUS AMMAN — sculptural objects and furniture, each made to order in solid wood.",
};

export default function ShopPage() {
  return (
    <div className="pb-28">
      <ShopHeader />
      <div className="mt-12 px-5 md:px-10">
        <ShopClient />
      </div>
    </div>
  );
}
