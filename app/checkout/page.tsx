import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="px-5 pb-28 pt-32 md:px-10 md:pt-40">
      <CheckoutForm />
    </div>
  );
}
