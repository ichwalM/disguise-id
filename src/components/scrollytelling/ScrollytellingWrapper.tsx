"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import Preloader from "./Preloader";
import { useMascotStore } from "@/store/useMascotStore";

export default function ScrollytellingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const setScrollProgress = useMascotStore((s) => s.setScrollProgress);

  /* ── Detect mobile ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── GSAP Scrollytelling (desktop only) ── */
  useEffect(() => {
    if (!isPreloaderDone || isMobile) return;
    if (!wrapperRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Master scrollytelling timeline — 12000px total scrub
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=12000",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        },
      });

      /*
       * ── Background ambient tween: subtle camera drift ──
       * We animate the inner container slightly for a parallax feel
       */
      masterTl
        // 0→10%: Hero — subtle zoom in
        .fromTo(
          containerRef.current,
          { scale: 1.04 },
          { scale: 1, duration: 0.1, ease: "power1.out" },
          0
        )
        // 10→20%: Problem — red tint overlay via CSS var
        .to(containerRef.current, { "--overlay-opacity": 0.15, duration: 0.1 }, 0.1)
        .to(containerRef.current, { "--overlay-opacity": 0, duration: 0.1 }, 0.2)
        // 50→60%: Match Found — pulse effect via camera shake
        .to(containerRef.current, {
          x: 3,
          duration: 0.02,
          yoyo: true,
          repeat: 3,
          ease: "none",
        }, 0.55)
        .to(containerRef.current, { x: 0, duration: 0.02 }, 0.58)
        // 90→100%: Finale — gentle zoom back
        .to(containerRef.current, { scale: 1.02, duration: 0.1, ease: "power1.inOut" }, 0.92);

    }, containerRef);

    return () => ctx.revert();
  }, [isPreloaderDone, isMobile, setScrollProgress]);

  /* ── Mobile scroll progress tracker ── */
  useEffect(() => {
    if (!isPreloaderDone || !isMobile) return;
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? window.scrollY / docH : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isPreloaderDone, isMobile, setScrollProgress]);

  /* ─── MOBILE LAYOUT ─── */
  if (isMobile) {
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

  /* ─── DESKTOP SCROLLYTELLING ─── */
  return (
    <>
      <Preloader onComplete={() => setIsPreloaderDone(true)} />

      <div
        ref={wrapperRef}
        className="relative h-screen w-full overflow-hidden bg-[#080810] text-white"
        style={{
          opacity: isPreloaderDone ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        <div ref={containerRef} className="absolute inset-0">
          {children}
        </div>
      </div>
    </>
  );
}
