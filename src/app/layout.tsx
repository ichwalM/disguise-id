import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DISGUISE-ID | AI Face Reconstruction & Identifikasi DPO Real-Time",
  description:
    "Sistem identifikasi wajah berbasis AI yang mampu merekonstruksi wajah tersembunyi di balik masker/penyamaran secara real-time dari kamera CCTV. Didukung U-Net VAE Nusantara & database PUSIKNAS POLRI.",
  icons: {
    icon: "/images/logo.ico",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* ─── Inject critical CSS FIRST before any stylesheet ─── */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              *,*::before,*::after{box-sizing:border-box}
              :root{color-scheme:dark}
              html,body{
                background:#080810!important;
                background-color:#080810!important;
                color:#ffffff;
                margin:0;
                padding:0;
                min-height:100%;
              }
            `,
          }}
        />
      </head>
      <body style={{ backgroundColor: "#080810", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
