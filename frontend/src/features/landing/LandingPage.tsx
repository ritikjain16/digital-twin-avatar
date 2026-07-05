import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, FileText, Mic2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { DigitalHuman } from "../../components/avatar/DigitalHuman";
import { Button } from "../../components/ui/Button";

const features = [
  { icon: FileText, title: "Learns your work", text: "Resume, portfolio, GitHub, certificates, and documents become searchable memory." },
  { icon: BrainCircuit, title: "Grounded answers", text: "RAG retrieval keeps the twin anchored to the evidence you provide." },
  { icon: Mic2, title: "Voice-native", text: "Speech recognition, TTS, interruption, and avatar emotion hooks are built in." },
  { icon: ShieldCheck, title: "Enterprise posture", text: "Typed API contracts, JWT auth, Docker, CI, and deploy-ready configuration." }
];

export const LandingPage = () => (
  <main className="min-h-screen bg-[#030712] text-white">
    <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_25%_10%,rgba(6,182,212,.2),transparent_28%),radial-gradient(circle_at_80%_8%,rgba(124,58,237,.2),transparent_30%),linear-gradient(145deg,#030712,#0b1020_50%,#050816)]" />
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
      <span className="text-lg font-bold">Digital Twin Avatar</span>
      <Link to="/login"><Button variant="ghost">Launch <ArrowRight size={16} /></Button></Link>
    </nav>
    <section className="mx-auto grid min-h-[calc(100vh-84px)] max-w-7xl items-center gap-10 px-5 pb-12 lg:grid-cols-[1fr_520px]">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-normal md:text-7xl">Digital Twin Avatar</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
          A realistic AI representative that learns your professional story, answers interview questions, explains projects, and speaks through a realtime digital human.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/login"><Button>Start building <ArrowRight size={17} /></Button></Link>
          <a href="#features"><Button variant="ghost">Explore system</Button></a>
        </div>
      </motion.div>
      <DigitalHuman speaking emotion="focused" />
    </section>
    <section id="features" className="mx-auto grid max-w-7xl gap-4 px-5 pb-16 md:grid-cols-4">
      {features.map(({ icon: Icon, title, text }) => (
        <article key={title} className="rounded-lg border border-white/10 bg-white/[.06] p-5 backdrop-blur-xl">
          <Icon className="mb-4 text-cyan-200" />
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">{text}</p>
        </article>
      ))}
    </section>
  </main>
);
