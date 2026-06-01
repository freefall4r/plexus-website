import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";

type Piece = {
  src: string;
  name: string;
  material: string;
  /** col-span + offset utilities, applied at md+ for the magazine layout */
  span: string;
  /** aspect ratio of the image frame */
  aspect: string;
  /** image sizes attribute */
  sizes: string;
  /** stagger delay for the Reveal */
  delay: number;
};

const pieces: Piece[] = [
  {
    src: "/brand/hangers.jpg",
    name: "Wave Hangers",
    material: "Carved solid pine & walnut",
    span: "md:col-span-5",
    aspect: "aspect-[4/5]",
    sizes: "(min-width: 768px) 40vw, 50vw",
    delay: 0,
  },
  {
    src: "/brand/bench-sage.jpg",
    name: "Arc Bench",
    material: "Lacquered ash",
    span: "md:col-span-7 md:mt-20",
    aspect: "aspect-[16/11]",
    sizes: "(min-width: 768px) 56vw, 50vw",
    delay: 0.08,
  },
  {
    src: "/brand/table-stone.jpg",
    name: "Live-edge Table",
    material: "Oak & river stone",
    span: "md:col-span-7",
    aspect: "aspect-[3/2]",
    sizes: "(min-width: 768px) 56vw, 50vw",
    delay: 0,
  },
  {
    src: "/brand/relief.jpg",
    name: "Relief Panel",
    material: "Carved walnut & stone",
    span: "md:col-span-5 md:mt-24",
    aspect: "aspect-[4/5]",
    sizes: "(min-width: 768px) 40vw, 50vw",
    delay: 0.08,
  },
  {
    src: "/brand/console.jpg",
    name: "Object Console",
    material: "Solid oak",
    span: "md:col-span-6",
    aspect: "aspect-[5/4]",
    sizes: "(min-width: 768px) 48vw, 50vw",
    delay: 0,
  },
  {
    src: "/brand/side-table.jpg",
    name: "Side Table",
    material: "Solid oak",
    span: "md:col-span-4 md:mt-16",
    aspect: "aspect-[4/5]",
    sizes: "(min-width: 768px) 32vw, 50vw",
    delay: 0.08,
  },
  {
    src: "/brand/branch-rack.jpg",
    name: "Branch Rack",
    material: "Found wood, hand-finished",
    span: "md:col-span-5",
    aspect: "aspect-[3/4]",
    sizes: "(min-width: 768px) 40vw, 50vw",
    delay: 0,
  },
  {
    src: "/brand/bar.jpg",
    name: "Cabinet Bar",
    material: "Oak, brass-lit",
    span: "md:col-span-7 md:mt-20",
    aspect: "aspect-[16/11]",
    sizes: "(min-width: 768px) 56vw, 50vw",
    delay: 0.08,
  },
];

function PieceCard({ piece }: { piece: Piece }) {
  return (
    <Reveal delay={piece.delay} className={piece.span}>
      <figure className="group">
        <div
          className={`relative ${piece.aspect} overflow-hidden rounded-sm bg-sand transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_-24px_rgba(31,27,20,0.45)]`}
        >
          <Image
            src={piece.src}
            alt={piece.name}
            fill
            sizes={piece.sizes}
            className="object-cover transition-[filter,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] group-hover:brightness-[1.04]"
          />
        </div>
        <figcaption className="mt-4">
          <h3 className="font-display text-[clamp(1.25rem,1.1rem+0.5vw,1.6rem)] font-light leading-tight text-ink">
            {piece.name}
          </h3>
          <p className="overline mt-1.5 text-ink-soft">{piece.material}</p>
        </figcaption>
      </figure>
    </Reveal>
  );
}

export function WorkGrid() {
  return (
    <section className="py-24 md:py-32 bg-bone-2">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <Reveal>
          <header className="max-w-[26ch]">
            <span className="overline text-copper">Furniture &amp; objects</span>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,1.8rem+3vw,4.4rem)] font-light leading-[1.02] tracking-[-0.02em] text-ink">
              Made to be lived with.
            </h2>
          </header>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-x-5 gap-y-12 md:mt-24 md:grid-cols-12 md:gap-x-8 md:gap-y-6">
          {pieces.map((piece) => (
            <PieceCard key={piece.name} piece={piece} />
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-20 flex justify-end md:mt-28">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-sm tracking-wide text-ink transition-colors hover:text-copper"
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                See the full collection
              </span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
