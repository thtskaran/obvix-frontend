'use client'

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
} from "@/components/ui/context-menu";

/**
 * Obvix AI – 3D Dark/Purple Landing (React + TS)
 * -------------------------------------------------
 * Updates:
 *  - Added 'use client' to ensure client-only rendering (fixes source-read crash in Next.js)
 *  - Stronger hover animations with cursor tracking (buttons, cards)
 *  - 3D everywhere: enhanced hero with multiple objects + camera rig parallax
 *  - Tilted 3D cards with reflective gradient that tracks cursor
 *  - Kept tests and added a couple more (commented) for presence of Canvas and tilt wrappers
 */

// -------------------- Helpers -------------------- //
const isBrowser = typeof window !== "undefined";
const scrollToId = (id: string) => {
  if (!isBrowser) return;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const useIsClient = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};

// -------------------- 3D Scene -------------------- //
function OrbitingCubes() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!group.current) return;
    group.current.rotation.y = t * 0.3;
    group.current.rotation.x = Math.sin(t * 0.2) * 0.1;
  });
  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    const r = 3.2;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      arr.push([Math.cos(a) * r, Math.sin(a * 1.2) * 0.6, Math.sin(a) * r]);
    }
    return arr;
  }, []);
  return (
    <group ref={group}>
      {positions.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          <meshStandardMaterial color="#a78bfa" metalness={0.6} roughness={0.25} emissive="#6d28d9" emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function NeonRings() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!group.current) return;
    group.current.rotation.z = t * 0.15;
  });
  return (
    <group ref={group}>
      {[1.8, 2.3, 2.8].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.03, 16, 256]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={0.9 - i * 0.2} metalness={0.6} roughness={0.15} />
        </mesh>
      ))}
    </group>
  );
}

function HoloGrid() {
  return (
    <group position={[0, -1.6, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        {/* Make the ground significantly larger to avoid abrupt end */}
        <planeGeometry args={[500, 500, 128, 128]} />
        <meshStandardMaterial color="#201933" metalness={0.2} roughness={0.95} />
      </mesh>
      {/* Extended grid helper placed outside the mesh for proper rendering */}
      {/* @ts-ignore */}
      <gridHelper args={[400, 800, "#6d28d9", "#3b1c64"]} position={[0, 0.01, 0]} />
    </group>
  );
}

function CameraRig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    // Parallax towards mouse
    const targetX = mouse.x * 0.8;
    const targetY = mouse.y * 0.5;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// -------------------- Interactive UI Blocks -------------------- //
function useMouseTrack() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const setFromEvent = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };
  return { x, y, setFromEvent };
}

// Replace Tilt3D to remove 3D tilt and Z-translation while keeping shine.
const Tilt3D: React.FC<{ children: React.ReactNode; intensity?: number; className?: string }> = ({ children, className }) => {
  const { x, y, setFromEvent } = useMouseTrack();
  return (
    <motion.div
      data-testid="tilt"
      onMouseMove={setFromEvent}
      // Keep last cursor-driven gradient position after hover by not resetting onMouseLeave
      style={{ transform: "none", transformStyle: "flat" as any }}
      className={className}
      whileHover={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      {/* Shine layer following cursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{
          background: useTransform(x, (vx) => `radial-gradient(600px circle at ${vx}px 50%, rgba(167,139,250,0.18), transparent 40%)`),
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
};

// Remove magnetic drift so the button stays straight.
const MagneticButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = "", onClick, ...props }) => {
  return (
    <motion.button
      data-testid="btn-shiny"
      // No magnetic translation
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl border border-purple-500/30 px-5 py-3 font-medium text-white shadow-lg shadow-purple-950/40 ${className}`}
      onClick={(e) => { onClick?.(e); }}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      <span className="absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--x,50%)_var(--y,50%),rgba(167,139,250,0.25),transparent_40%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="relative">{children}</span>
      <svg className="relative h-4 w-4 opacity-80 transition group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path d="M12.293 3.293a1 1 0 011.414 0l4.999 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L15.586 10l-3.293-3.293a1 1 0 010-1.414z" />
        <path d="M2 10a1 1 0 011-1h13a1 1 0 110 2H3a1 1 0 01-1-1z" />
      </svg>
    </motion.button>
  );
};

// -------------------- Layout -------------------- //
const Section: React.FC<{ id?: string; className?: string; children: React.ReactNode }>=({ id, className = "", children })=> (
  <section id={id} className={`relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</section>
);

const Tag: React.FC<{ children: React.ReactNode }>=({ children })=> (
  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
    {children}
  </span>
);

const GradientText: React.FC<{ children: React.ReactNode }>=({ children })=> (
  <span className="bg-gradient-to-r from-purple-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
    {children}
  </span>
);

const Navbar: React.FC = () => (
  <div className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0b0b12]/70 backdrop-blur" data-testid="navbar">
    <Section className="flex h-16 items-center justify-between">
      <div className="flex items-center gap-3">
       
        <span className="text-sm font-semibold tracking-wide text-white/90">Obvix AI.</span>
      </div>
      <nav className="hidden md:flex items-center gap-7 text-sm">
        <a href="#features" className="text-white/70 hover:text-white">Features</a>
        <a href="#how" className="text-white/70 hover:text-white">How it works</a>
        <a href="#usecases" className="text-white/70 hover:text-white">Who we serve</a>
        <a href="#public" className="text-white/70 hover:text-white">Building in public</a>
        <a href="mailto:hello@Karanprasad.com" className="text-white/70 hover:text-white">Contact</a>
      </nav>
    </Section>
  </div>
);

// Add: fixed grid backdrop (30% opacity), starts below header and doesn't scroll
const GridBackdrop: React.FC = () => (
  <div
    aria-hidden
    className="pointer-events-none fixed left-0 right-0 bottom-0"
    style={{
      top: "4rem", // h-16 header height
      backgroundImage:
        "linear-gradient(rgba(167,139,250,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.35) 1px, transparent 1px)",
      backgroundSize: "40px 40px",
      backgroundPosition: "top left",
      opacity: 0.3,
      zIndex: 0,
    }}
  />
);

const Hero3D: React.FC = () => {
  const mounted = useIsClient();
  return (
    <div className="relative h-[78vh] w-full overflow-hidden" data-testid="hero">
      {/* Aurora gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/2 top-0 h-[60rem] w-[60rem] rounded-full bg-purple-700/20 blur-3xl" />
        <div className="absolute right-[-30%] top-[-10%] h-[40rem] w-[40rem] rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="absolute bottom-[-20%] left-1/3 h-[50rem] w-[50rem] rounded-full bg-purple-900/30 blur-3xl" />
      </div>

      {/* Client-only Canvas */}
      {mounted ? (
        <Canvas shadows camera={{ position: [0, 0, 6], fov: 50 }} data-testid="r3f-canvas">
          <ambientLight intensity={0.6} />
          <directionalLight position={[8, 10, 5]} intensity={1.2} castShadow color="#a78bfa" />
          <Stars radius={70} depth={40} count={2200} factor={4} saturation={0} fade speed={0.8} />
          <OrbitingCubes />
          <NeonRings />
          <HoloGrid />
          <CameraRig />
          <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 3.5} maxPolarAngle={Math.PI / 1.7} />
        </Canvas>
      ) : (
        <div className="absolute inset-0" aria-hidden />)
      }

      {/* Hero copy overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center">
        <Section>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="mb-4 flex flex-wrap gap-2">
              <Tag>Security system + black box recorder</Tag>
              <Tag>Open-source model ready</Tag>
              <Tag>On-prem & air‑gapped</Tag>
            </div>
            <h1
              className="text-4xl font-bold leading-tight text-white md:text-6xl"
              style={{ textShadow: "0 8px 24px rgba(0,0,0,0.55), 0 2px 8px rgba(124,58,237,0.35)" }}
            >
              Deploy <GradientText>safe, reliable</GradientText> AI — as easy as running an API.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/70 md:text-lg">
              Obvix AI is a safety & control dashboard for your own models. Host locally, filter harmful outputs, red team pre‑launch, and trace bad answers back to their source.
            </p>
            <div className="pointer-events-auto mt-8 flex flex-col gap-3 sm:flex-row">
              <MagneticButton onClick={() => scrollToId("features")}>Explore Features</MagneticButton>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => scrollToId("contact")}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white/80 backdrop-blur transition hover:bg-white/10"
              >
                Get a Safety Report
              </motion.button>
            </div>
          </motion.div>
        </Section>
      </div>

      {/* Gentle fade into the rest of the page */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-[#0b0b12]/70 to-[#0b0b12]" />
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; desc: string; bullets: string[]; icon?: React.ReactNode }>=({ title, desc, bullets, icon })=> (
  <Tilt3D className="relative">
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 shadow-xl shadow-purple-950/20">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl transition group-hover:bg-purple-500/30" />
      <div className="relative">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 text-purple-300">
            {icon ?? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                <path d="M12 2l3 7h7l-5.5 4 2.5 7-7-5-7 5 2.5-7L2 9h7z" />
              </svg>
            )}
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="mb-4 text-sm text-white/70">{desc}</p>
        <ul className="space-y-2 text-sm text-white/80">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-purple-400" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Tilt3D>
);

const Features: React.FC = () => (
  <Section id="features" className="py-20" data-testid="features">
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <h2 className="text-3xl font-bold text-white md:text-4xl">
        Everything you need to ship <GradientText>safe AI</GradientText>
      </h2>
      <p className="mt-3 text-white/70">
        Bring your own model. We add the safety layer: filtering, monitoring, red teaming, and traceability — all in one dashboard.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <FeatureCard
        title="Host & Proxy"
        desc="Run models locally or on your servers with an OpenAI‑style API."
        bullets={["Docker + Ollama/llama.cpp", "Token & rate limits", "Observability hooks"]}
      />
      <FeatureCard
        title="Filter & Monitor"
        desc="Block harmful, biased, or unsafe content before it leaves the system."
        bullets={["Safety filters & guardrails", "Persona vector drift monitoring", "PII & jailbreak detection"]}
      />
      <FeatureCard
        title="Red Team Testing"
        desc="Attack your model pre‑launch with thousands of adversarial prompts."
        bullets={["Automated test suites", "Coverage by threat category", "PDF safety report"]}
      />
      <FeatureCard
        title="Trace & Debug"
        desc="See exactly where a bad answer came from — RAG doc or fine‑tuning data."
        bullets={["Evidence trails", "Per‑chunk/source scoring", "One‑click suppression/removal"]}
      />
    </div>
  </Section>
);

const HowItWorks: React.FC = () => (
  <Section id="how" className="py-20" data-testid="how">
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
      <Tilt3D className="relative">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <h3 className="mb-2 text-xl font-semibold text-white">Pipeline</h3>
          <ol className="space-y-3 text-sm text-white/80">
            <li><strong className="text-white">1. Ingress:</strong> OpenAI‑style REST endpoint proxies to your local/open‑source model.</li>
            <li><strong className="text-white">2. Safety:</strong> Static policies + dynamic classifiers gate responses in real‑time.</li>
            <li><strong className="text-white">3. Monitoring:</strong> Persona vectors watch drift & risky behavior patterns.</li>
            <li><strong className="text-white">4. Forensics:</strong> Trace answers to RAG chunks or fine‑tune examples.</li>
            <li><strong className="text-white">5. Reporting:</strong> Exportable red‑team PDFs & dashboards for audits.</li>
          </ol>
        </div>
      </Tilt3D>
      <Tilt3D className="relative">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl" />
          <h3 className="mb-2 text-xl font-semibold text-white">Why it’s different</h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li>Designed for <span className="text-white">on‑prem & air‑gapped</span> deployments.</li>
            <li>Works with <span className="text-white">any OSS model</span> (HF, local weights), no vendor lock‑in.</li>
            <li>Gives <span className="text-white">provable safety</span> via automated red teaming and traceability.</li>
            <li><span className="text-white">OpenAI‑style API</span> so your app code barely changes.</li>
          </ul>
        </div>
      </Tilt3D>
    </div>
  </Section>
);

const UseCases: React.FC = () => (
  <Section id="usecases" className="py-20" data-testid="usecases">
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <h2 className="text-3xl font-bold text-white md:text-4xl">Who we cater to</h2>
      <p className="mt-3 text-white/70">Built for SMEs, startups, and security‑conscious teams that need production‑grade safety without a large ML team.</p>
    </div>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {[{
        title: "SMEs",
        desc: "Ship AI features faster with safety, monitoring, and compliance baked‑in.",
      }, {
        title: "Developers & Startups",
        desc: "Build on open‑source models while keeping enterprise‑grade guardrails.",
      }, {
        title: "Security Teams",
        desc: "Demand proof of safety before launch with red team PDFs & dashboards.",
      }].map((c) => (
        <Tilt3D key={c.title} className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl" />
            <h3 className="mb-2 text-lg font-semibold text-white">{c.title}</h3>
            <p className="text-sm text-white/75">{c.desc}</p>
          </div>
        </Tilt3D>
      ))}
    </div>
  </Section>
);

// New section: Building in public
const BuildingInPublic: React.FC = () => (
  <Section id="public" className="py-20" data-testid="public">
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-3xl font-bold text-white md:text-4xl">Building in public</h2>
      <p className="mt-3 text-white/70">
        We’re building Obvix in public and are eager for all feedback, critiques, and ideas.
        Dive into longer articles at{" "}
        <a href="https://karanprasad.com" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-purple-200 underline">
          karanprasad.com
        </a>{" "}
        or reach out on Twitter/X{" "}
        <a href="https://twitter.com/thtskaran" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-purple-200 underline">
          @thtskaran
        </a>.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="https://karanprasad.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white/80 backdrop-blur transition hover:bg-white/10"
        >
          Read articles
          <svg className="ml-2 h-4 w-4 opacity-80" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path d="M12.293 3.293a1 1 0 011.414 0l4.999 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L15.586 10l-3.293-3.293a1 1 0 010-1.414z" />
            <path d="M2 10a1 1 0 011-1h13a1 1 0 110 2H3a1 1 0 01-1-1z" />
          </svg>
        </a>
        <a
          href="https://twitter.com/thtskaran"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-2xl border border-purple-500/30 px-5 py-3 text-white shadow-lg shadow-purple-950/40 transition hover:bg-white/5"
        >
          Follow @thtskaran
          <svg className="ml-2 h-4 w-4 opacity-80" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path d="M12.293 3.293a1 1 0 011.414 0l4.999 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L15.586 10l-3.293-3.293a1 1 0 010-1.414z" />
            <path d="M2 10a1 1 0 011-1h13a1 1 0 110 2H3a1 1 0 01-1-1z" />
          </svg>
        </a>
      </div>
    </div>
  </Section>
);

const Footer: React.FC = () => (
  <footer className="border-t border-white/10 py-10" data-testid="footer">
    <Section className="flex flex-col items-center justify-between gap-6 md:flex-row">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-500" />
        <span className="text-sm text-white/70">© {new Date().getFullYear()} Obvix AI</span>
      </div>
      <div className="flex items-center gap-6 text-sm text-white/60">
        <a href="#" className="hover:text-white">Privacy</a>
        <a href="#" className="hover:text-white">Security</a>
        <a href="#" className="hover:text-white">Status</a>
      </div>
    </Section>
  </footer>
);

// -------------------- Root -------------------- //
export default function ObvixLanding() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="min-h-screen w-full bg-[#0b0b12] text-white" data-testid="root">
          <Navbar />
          {/* Add: non-scrolling grid overlay for depth, excluded from header area */}
          <GridBackdrop />
          <Hero3D />
          <Features />
          <HowItWorks />
          <UseCases />
          <BuildingInPublic />
          <Footer />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent align="start" className="w-64">
        <ContextMenuLabel>Obvix AI</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => scrollToId("features")}>Explore Features</ContextMenuItem>
        <ContextMenuItem onClick={() => scrollToId("how")}>How it works</ContextMenuItem>
        <ContextMenuItem onClick={() => scrollToId("usecases")}>Who we serve</ContextMenuItem>
        <ContextMenuItem onClick={() => scrollToId("public")}>Building in public</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => (window.location.href = "mailto:hello@Karanprasad.com")}>Contact</ContextMenuItem>
        <ContextMenuItem onClick={() => window.location.reload()}>Reload</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

