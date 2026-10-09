"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-[var(--background)] px-5 py-8 text-[#FFFFFF] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1600px] text-center">
        <p className="font-[var(--font-sans)] text-[9px] font-normal tracking-[0.08em] sm:text-[10px]">
          © {year ?? ""} Fadhil Rahmat
        </p>
      </div>
    </footer>
  );
}
