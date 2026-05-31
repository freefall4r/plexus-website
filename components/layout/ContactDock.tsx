"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { brand, contact, waLink, mailLink, igLink } from "@/lib/config";

const items = [
  {
    label: "WhatsApp",
    href: waLink(`Hi ${brand.name}, I have a question.`),
    color: "#25D366",
    icon: (
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.4-3.9-4.6-4.1-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2 .2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.3 0 .5l-.4.5-.3.3c-.1.1-.2.3-.1.5.2.3.7 1.2 1.5 1.9 1 .9 1.8 1.1 2.1 1.3.2.1.4.1.5-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.2.1.6 0 1Z" />
    ),
  },
  {
    label: "Call",
    href: `tel:${contact.phoneTel}`,
    color: "#c8772e",
    icon: (
      <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .5 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.5-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1l-2.3 2.3Z" />
    ),
  },
  {
    label: "Email",
    href: mailLink(`${brand.name} enquiry`, "Hi, "),
    color: "#4a3a28",
    icon: (
      <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7L4.2 6.8h15.6L12 12Zm0 2.2 8-5.4V18H4V8.8l8 5.4Z" />
    ),
  },
  {
    label: "Instagram",
    href: igLink(),
    color: "#a85c34",
    icon: (
      <path d="M12 2c2.7 0 3 0 4.1.1 1 0 1.7.2 2.3.5.6.2 1.1.5 1.6 1 .5.5.8 1 1 1.6.2.6.4 1.3.5 2.3 0 1.1.1 1.4.1 4.1s0 3-.1 4.1c0 1-.2 1.7-.5 2.3-.2.6-.5 1.1-1 1.6-.5.5-1 .8-1.6 1-.6.2-1.3.4-2.3.5-1.1 0-1.4.1-4.1.1s-3 0-4.1-.1c-1 0-1.7-.2-2.3-.5a4.3 4.3 0 0 1-1.6-1 4.3 4.3 0 0 1-1-1.6c-.2-.6-.4-1.3-.5-2.3C2 15 2 14.7 2 12s0-3 .1-4.1c0-1 .2-1.7.5-2.3.2-.6.5-1.1 1-1.6.5-.5 1-.8 1.6-1 .6-.2 1.3-.4 2.3-.5C9 2 9.3 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.3-8.4a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />
    ),
  },
];

export function ContactDock() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[55] flex flex-col items-end gap-3 md:bottom-7 md:right-7">
      <AnimatePresence>
        {open &&
          items.map((it, i) => (
            <motion.a
              key={it.label}
              href={it.href}
              target={it.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 14, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.8 }}
              transition={{ delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="group flex items-center gap-3"
              data-cursor="hover"
            >
              <span className="rounded-full bg-walnut-deep/90 px-3 py-1 text-xs text-bone opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                {it.label}
              </span>
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-bone shadow-lg shadow-walnut-deep/30 transition-transform group-hover:scale-110"
                style={{ background: it.color }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  {it.icon}
                </svg>
              </span>
            </motion.a>
          ))}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        data-cursor="hover"
        aria-label="Contact us"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-bone shadow-xl shadow-walnut-deep/40 transition-transform hover:scale-105"
      >
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          className="h-6 w-6"
          animate={{ rotate: open ? 45 : 0 }}
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M21 11.5a8.4 8.4 0 0 1-12 7.6L3 21l1.9-6A8.5 8.5 0 1 1 21 11.5Z" />
          )}
        </motion.svg>
      </button>
    </div>
  );
}
