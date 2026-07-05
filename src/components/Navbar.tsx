"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Cara Kerja", href: "/#technology" },
  { label: "AI Engine", href: "/#ai-engine" },
  { label: "Statistik", href: "/#statistics" },
  { label: "Team", href: "/#team" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      
      // Scroll Spy Logic
      const sections = navLinks.map(link => link.href.split('#')[1]).filter(Boolean);
      let current = "";
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Detect if section is in viewport
          if (rect.top <= 120 && rect.bottom >= 120) {
            current = section;
          }
        }
      }
      
      // Special case for top of page
      if (window.scrollY < 100) {
        current = "home";
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial check
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") && typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      const targetId = href.substring(2);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "all 0.4s ease",
          backgroundColor: scrolled ? "rgba(8,8,16,0.90)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,86,179,0.3)" : "none",
        }}
      >
        {/* Animated border run on scroll */}
        {scrolled && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "1px",
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "40%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(0,86,179,0.8), transparent)",
              }}
            />
          </div>
        )}

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
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Image
                src="/images/logo.png"
                alt="DISGUISE-ID Logo"
                width={36}
                height={36}
                style={{ objectFit: "contain" }}
              />
            </motion.div>
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
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: activeSection === link.href.split('#')[1] || (link.href === "/dashboard" && typeof window !== "undefined" && window.location.pathname === "/dashboard") ? "#fff" : "rgba(255,255,255,0.55)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    position: "relative",
                    paddingBottom: "8px", // Space for the active indicator line
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    const isActive = activeSection === link.href.split('#')[1];
                    if (!isActive && link.href !== "/dashboard") {
                      (e.target as HTMLElement).style.color = "rgba(255,255,255,0.55)";
                    } else if (link.href === "/dashboard" && typeof window !== "undefined" && window.location.pathname !== "/dashboard") {
                      (e.target as HTMLElement).style.color = "rgba(255,255,255,0.55)";
                    }
                  }}
                >
                  {link.label}
                  {/* Active Indicator Line */}
                  {((activeSection === link.href.split('#')[1]) || (link.href === "/dashboard" && typeof window !== "undefined" && window.location.pathname === "/dashboard")) && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background: "#0056B3",
                        boxShadow: "0 0 10px rgba(0,86,179,0.8)",
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right side: CTA + Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
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
                  transition: "all 0.2s",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "#ff2d35";
                  el.style.boxShadow = "0 0 20px rgba(230,33,41,0.5)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "#E62129";
                  el.style.boxShadow = "none";
                }}
              >
                <Terminal size={13} />
                COMMAND CENTER
              </Link>
            </motion.div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: "none",
                background: "none",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                cursor: "pointer",
                padding: "8px",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="mobile-menu-btn"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: "rgba(8,8,16,0.98)",
                backdropFilter: "blur(24px)",
                borderTop: "1px solid rgba(0,86,179,0.25)",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "16px 32px 24px" }}>
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      style={{
                        display: "block",
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.7)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        padding: "12px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <span style={{ color: "rgba(0,86,179,0.7)", marginRight: "8px" }}>//</span>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
