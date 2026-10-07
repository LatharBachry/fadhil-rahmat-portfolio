"use client";

import { useState } from "react";

import Preloader from "@/components/sections/Preloader";
import Hero from "@/components/sections/Hero";
import BTS from "@/components/sections/BTS";
import SelectedWorks from "@/components/sections/SelectedWorks";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Preloader
        onComplete={() => {
          setIsLoaded(true);
        }}
      />

      <div
        className={`
          transition-opacity
          duration-700
          ${
            isLoaded
              ? "opacity-100"
              : "pointer-events-none h-screen overflow-hidden opacity-0"
          }
        `}
      >
        <Hero />

        <BTS />

        <SelectedWorks />
      </div>
    </main>
  );
}
