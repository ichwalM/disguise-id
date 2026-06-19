"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Cara Kerja", href: "#technology" },
  { label: "AI Engine", href: "#ai-engine" },
  { label: "Statistik", href: "#statistics" },
  { label: "Team", href: "#team" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.3s ease",
        backgroundColor: scrolled ? "rgba(8,8,16,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,86,179,0.25)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 32px",
          height: "68px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <Image
            src="/images/logo.png"
            alt="DISGUISE-ID Logo"
            width={36}
            height={36}
            style={{ objectFit: "contain" }}
          />
          <span
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 900,
              fontSize: "20px",
              letterSpacing: "-0.03em",
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            DISGUISE<span style={{ color: "#0056B3" }}>-ID</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "36px" }}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "12px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#fff")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#E62129",
            color: "#fff",
            padding: "10px 22px",
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontWeight: 900,
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
        >
          COMMAND CENTER
        </Link>
      </div>
    </header>
  );
}
