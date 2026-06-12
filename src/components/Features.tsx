import { Camera, BrainCircuit, ScanFace, Database } from "lucide-react";

const features = [
  {
    title: "Smart CCTV Infrastructure",
    description: "Integrasi jaringan CCTV pintar dengan panel surya untuk pengawasan 24/7 tanpa batas.",
    icon: <Camera size={32} className="text-primary" />,
    delay: "delay-100",
  },
  {
    title: "AI Face Reconstruction",
    description: "Mengembalikan detail wajah dari rekaman buram menggunakan Variational Autoencoder (VAE) khusus.",
    icon: <BrainCircuit size={32} className="text-destructive" />,
    delay: "delay-200",
  },
  {
    title: "DPO Matching",
    description: "Pencocokan wajah real-time dengan database buronan dalam hitungan milidetik.",
    icon: <ScanFace size={32} className="text-secondary" />,
    delay: "delay-300",
  },
  {
    title: "Digital Forensics Database",
    description: "Penyimpanan bukti digital terenkripsi yang mendukung pelaporan investigasi resmi.",
    icon: <Database size={32} className="text-primary" />,
    delay: "delay-400",
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-surface text-foreground relative overflow-hidden border-t-4 border-black">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">
            Advanced <span className="text-destructive">Capabilities</span>
          </h2>
          <p className="text-lg text-muted-foreground font-sans max-w-2xl">
            Sistem kami dirancang untuk mendukung operasional intelijen dan forensik digital dengan teknologi mutakhir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className={`neo-card p-8 flex flex-col items-start gap-4 hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000] transition-all duration-300 ${feature.delay}`}
            >
              <div className="p-4 border-4 border-black bg-background mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold uppercase">{feature.title}</h3>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 border-4 border-black bg-primary text-primary-foreground neo-card">
          <div className="p-12 text-center border-b-4 md:border-b-0 md:border-r-4 border-black">
            <h4 className="text-6xl font-black mb-2">500+</h4>
            <p className="font-mono text-sm tracking-widest uppercase">Kamera Terintegrasi</p>
          </div>
          <div className="p-12 text-center border-b-4 md:border-b-0 md:border-r-4 border-black">
            <h4 className="text-6xl font-black mb-2">20K+</h4>
            <p className="font-mono text-sm tracking-widest uppercase">Data Wajah DPO</p>
          </div>
          <div className="p-12 text-center">
            <h4 className="text-6xl font-black text-secondary mb-2">96.4%</h4>
            <p className="font-mono text-sm tracking-widest uppercase text-black">Akurasi Identifikasi</p>
          </div>
        </div>
      </div>
    </section>
  );
}
