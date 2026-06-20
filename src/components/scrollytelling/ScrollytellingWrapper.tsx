"use client";

import { useEffect, useRef, useState } from "react";
import { useMascotStore } from "@/store/useMascotStore";
import Preloader from "./Preloader";

export default function ScrollytellingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const setScrollProgress = useMascotStore((s) => s.setScrollProgress);

  /* ── Global scroll progress tracker (all devices) ── */
  useEffect(() => {
    if (!isPreloaderDone) return;
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isPreloaderDone, setScrollProgress]);

  return (
    <>
      <Preloader onComplete={() => setIsPreloaderDone(true)} />
      <div
        style={{
          opacity: isPreloaderDone ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        {children}
      </div>
    </>
  );
}
