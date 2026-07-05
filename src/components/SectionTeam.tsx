"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";

const teamMembers = [
  {
    name: "LILIS NUR HAYATI",
    role: "DOSEN PEMBIMBING",
    fakultas: "FAKULTAS ILMU KOMPUTER",
    motto: "Membimbing inovasi menuju realitas",
    image: "/images/aset/Lilis Nur Hayati, S.Kom., M.Eng., MTA.png",
  },
  {
    name: "ICHWAL",
    role: "TEAM LEADER",
    fakultas: "FAKULTAS ILMU KOMPUTER",
    motto: "Memimpin dengan visi, mengeksekusi dengan presisi",
    image: "/images/aset/ICHWAL.png",
  },
  {
    name: "AAN",
    role: "ANGGOTA",
    fakultas: "FAKULTAS ILMU KOMPUTER",
    motto: "Merancang pengalaman digital tanpa batas",
    image: "/images/aset/AAN.png",
  },
  {
    name: "RIZKI",
    role: "ANGGOTA",
    fakultas: "FAKULTAS ILMU KOMPUTER",
    motto: "Membangun pondasi sistem yang kokoh dan aman",
    image: "/images/aset/RIZKI.png",
  },
  {
    name: "MARSYA",
    role: "ANGGOTA",
    fakultas: "FAKULTAS HUKUM",
    motto: "melangkah dengan keadilan",
    image: "/images/aset/MARSYA.png",
  },
  {
    name: "ZASKIA",
    role: "ANGGOTA",
    fakultas: "FAKULTAS HUKUM",
    motto: "Keadilan adalah tujuan ",
    image: "/images/aset/ZASKIA.png",
  },
];

export default function SectionTeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      id="team"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#1c124c] flex flex-col items-center justify-between py-20 overflow-hidden"
      style={{
        background: "radial-gradient(circle at 50% 50%, #291b6b 0%, #150d38 100%)",
      }}
    >
      {/* 3D Grid Background Effect */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: "linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          transform: "perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#150d38]/80 via-transparent to-[#150d38] pointer-events-none" />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center mb-16 space-y-2"
      >
        <h3 className="text-cyan-400 text-sm md:text-base font-bold tracking-[0.2em] uppercase" style={{ textShadow: "0 0 10px rgba(6,182,212,0.5)" }}>
          The Members Of
        </h3>
        <h2
          className="text-5xl md:text-7xl font-extrabold text-white tracking-wider uppercase"
          style={{
            textShadow: "0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(6, 182, 212, 0.4)",
          }}
        >
          Disguise-ID
        </h2>
        <p className="text-cyan-400 text-sm md:text-lg tracking-widest mt-4">
          Universitas Muslim Indonesia
        </p>
      </motion.div>

      {/* Accordion / Expandable Team Gallery */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col md:flex-row w-full max-w-[1400px] h-[70vh] md:h-[500px] px-4 md:px-10 gap-2 md:gap-0"
      >
        {teamMembers.map((member, index) => {
          const isHovered = hoveredIndex === index;
          const isAnyHovered = hoveredIndex !== null;

          return (
            <motion.div
              key={member.name}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              animate={{
                flex: isHovered ? 3 : isAnyHovered ? 1 : 1,
                filter: isHovered ? "grayscale(0%) brightness(1.1)" : "grayscale(100%) brightness(0.6)",
              }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              className={`relative overflow-hidden rounded-xl md:rounded-none cursor-pointer flex-1 h-full border-r border-l border-cyan-500/20 group ${
                index === 0 ? "md:rounded-l-2xl md:border-l-0" : ""
              } ${index === teamMembers.length - 1 ? "md:rounded-r-2xl md:border-r-0" : ""}`}
            >
              {/* Image Background */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#150d38] via-[#150d38]/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-70" />
                
                {/* Cyberpunk Glow effect on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  className="absolute inset-0 shadow-[inset_0_0_50px_rgba(6,182,212,0.4)] pointer-events-none"
                />
              </div>

              <AnimatePresence mode="wait">
                {!isHovered ? (
                  /* Default Text Content (Shown when NOT hovered) */
                  <motion.div
                    key="default-text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex flex-col justify-end h-full pointer-events-none z-10"
                  >
                    <div className="flex flex-col items-center text-center md:items-start md:text-left">
                      <p className="text-cyan-400 text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase mb-1 whitespace-nowrap" style={{ textShadow: "0 0 10px rgba(6,182,212,0.8)" }}>
                        {member.role}
                      </p>
                      <h4 className="text-white text-lg md:text-2xl font-bold uppercase whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {member.name}
                      </h4>
                    </div>
                  </motion.div>
                ) : (
                  /* Hover State: Mascot & Cyber Speech Bubble Report */
                  <motion.div
                    key="hover-mascot"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-20 flex flex-col md:flex-row items-end justify-between p-4 md:p-6 bg-gradient-to-t from-[#150d38]/95 via-[#150d38]/70 to-transparent pointer-events-none"
                  >
                    {/* Left Side: Name and Role in big styling */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="flex flex-col justify-end h-full pb-2 text-left"
                    >
                      <span className="text-cyan-400 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: "0 0 10px rgba(6,182,212,0.8)" }}>
                        {member.role}
                      </span>
                      <h4 className="text-white text-2xl md:text-4xl font-extrabold tracking-wide uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        {member.name}
                      </h4>
                    </motion.div>

                    {/* Right Side: Mascot and Cyber Speech Bubble */}
                    <div className="flex flex-col items-center justify-end h-full mt-4 md:mt-0 select-none">
                      {/* Speech Bubble */}
                      <motion.div
                        initial={{ scale: 0.8, y: 15, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 120, delay: 0.15 }}
                        className="mb-3 bg-[#080810]/95 border border-cyan-500/80 rounded-xl p-3 shadow-[0_0_20px_rgba(6,182,212,0.3)] max-w-[220px] md:max-w-[260px] text-left relative"
                      >
                        {/* Triangle tail pointing to mascot */}
                        <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#080810] border-r border-b border-cyan-500/80 transform rotate-45" />
                        
                        <div className="text-[8px] font-mono text-cyan-400 font-bold tracking-[0.1em] border-b border-cyan-500/30 pb-1 mb-1.5 uppercase flex items-center justify-between">
                          <span>COMPANION ANALYSIS</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        
                        <div className="space-y-1">
                          <div>
                            <span className="text-[8px] font-mono text-cyan-400/60 block uppercase">Fakultas</span>
                            <span className="text-white text-[10px] font-bold font-mono tracking-wider">{member.fakultas}</span>
                          </div>
                          <div>
                            <span className="text-[8px] font-mono text-cyan-400/60 block uppercase">Motto</span>
                            <p className="text-gray-200 text-[10px] italic font-medium leading-relaxed">
                              "{member.motto}"
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Mascot Image */}
                      <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.1 }}
                        className="w-[75px] h-[75px] md:w-[90px] md:h-[90px] relative"
                      >
                        <motion.div
                          animate={{ y: [0, -6, 0] }}
                          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                          className="w-full h-full relative"
                        >
                          <Image
                            src="/images/MASKOT.png"
                            alt="Disguise Mascot"
                            fill
                            className="object-contain"
                            style={{ mixBlendMode: "screen", filter: "saturate(1.2) brightness(1.1)" }}
                          />
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Footer Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center mt-16"
      >
        <p className="text-white text-lg md:text-2xl font-semibold italic tracking-wide" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
          Program Kreatifitas Mahasiswa
        </p>
        <p className="text-cyan-400 text-xs md:text-sm tracking-[0.5em] mt-3 uppercase font-bold" style={{ textShadow: "0 0 10px rgba(6,182,212,0.5)" }}>
          Karsa Cipta 2026
        </p>
      </motion.div>
    </section>
  );
}
