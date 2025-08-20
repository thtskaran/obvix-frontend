'use client'

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
} from "@/components/ui/context-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


// -------------------- Splash Loader -------------------- //
const SplashLoader: React.FC = () => {
  return (
    <motion.div
      key="splash-loader"
      className="fixed inset-0 z-[9999] bg-[#0b0b12]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Soft aurora background to match the site's feel */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/2 top-0 h-[60rem] w-[60rem] rounded-full bg-purple-700/20 blur-3xl" />
        <div className="absolute right-[-30%] top-[-10%] h-[40rem] w-[40rem] rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="absolute bottom-[-20%] left-1/3 h-[50rem] w-[50rem] rounded-full bg-purple-900/30 blur-3xl" />
      </div>

      <div className="relative flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          {/* Logo mark */}
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 shadow-lg shadow-purple-900/30" />
          <div className="text-lg font-semibold tracking-wide text-white/90">Obvix AI</div>

          {/* Spinner */}
          <div className="mt-2 h-6 w-6 animate-spin rounded-full border-2 border-purple-400/40 border-t-purple-300" aria-hidden />

          {/* Subtle status line */}
          <div className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
          <span className="text-xs text-white/50">Preparing your experience…</span>
        </div>
      </div>
    </motion.div>
  );
}

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
        <planeGeometry args={[500, 500, 128, 128]} />
        <meshStandardMaterial color="#201933" metalness={0.2} roughness={0.95} />
      </mesh>
      {/* @ts-ignore */}
      <gridHelper args={[400, 800, "#6d28d9", "#3b1c64"]} position={[0, 0.01, 0]} />
    </group>
  );
}

function CameraRig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
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

const Tilt3D: React.FC<{ children: React.ReactNode; intensity?: number; className?: string }> = ({ children, className }) => {
  const { x, y, setFromEvent } = useMouseTrack();
  return (
    <motion.div
      data-testid="tilt"
      onMouseMove={setFromEvent}
      style={{ transform: "none", transformStyle: "flat" as any }}
      className={className}
      whileHover={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
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

const MagneticButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = "", onClick, ...props }) => {
  return (
    <motion.button
      data-testid="btn-shiny"
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
const Section: React.FC<{ id?: string; className?: string; children: React.ReactNode }> = ({ id, className = "", children }) => (
  <section id={id} className={`relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</section>
);

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
    {children}
  </span>
);

const GradientText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
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
        <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToId('faq'); }} className="text-white/70 hover:text-white transition-colors">FAQ</a>
        <a href="#public" className="text-white/70 hover:text-white">Building in public</a>
        <a href="mailto:hello@Karanprasad.com" className="text-white/70 hover:text-white">Contact</a>
      </nav>
    </Section>
  </div>
);

const GridBackdrop: React.FC = () => (
  <div
    aria-hidden
    className="pointer-events-none fixed left-0 right-0 bottom-0"
    style={{
      top: "4rem",
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
              <Tag>For Startups & SMEs</Tag>
              <Tag>On-Premise & Cloud Ready</Tag>
              <Tag>Compliance & Governance Built-in</Tag>
            </div>
            <h1
              className="text-4xl font-bold leading-tight text-white md:text-6xl"
              style={{ textShadow: "0 8px 24px rgba(0,0,0,0.55), 0 2px 8px rgba(124,58,237,0.35)" }}
            >
              Ship AI with Confidence. The <GradientText>Safety & Governance Layer</GradientText> for LLMs.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/70 md:text-lg">
              Obvix is a plug-and-play AI firewall. Intercept and block harmful content, prevent misuse, and meet compliance requirements in real-time—all without hiring a dedicated ML safety team.
            </p>
            <div className="pointer-events-auto mt-8 flex flex-col gap-3 sm:flex-row">
              <MagneticButton onClick={() => scrollToId("waitlist")}>Join the Waitlist</MagneticButton>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => scrollToId("features")}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white/80 backdrop-blur transition hover:bg-white/10"
              >
                Explore Features
              </motion.button>
            </div>
          </motion.div>
        </Section>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-[#0b0b12]/70 to-[#0b0b12]" />
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; desc: string; bullets: string[]; icon?: React.ReactNode }> = ({ title, desc, bullets, icon }) => (
  <Tilt3D className="relative">
    <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 shadow-xl shadow-purple-950/20">
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
              <span dangerouslySetInnerHTML={{ __html: b }} />
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
        The Complete Toolkit for <GradientText>Trustworthy AI</GradientText>
      </h2>
      <p className="mt-3 text-white/70">
        Obvix adds the missing safety layer to your existing stack, so you can launch AI features with confidence, demonstrate accountability, and keep full control over your infrastructure.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <FeatureCard
        title="Deploy Your Way"
        desc="Use any OpenAI-compatible API. Keep full data ownership and avoid vendor lock-in with on-premise and cloud deployment options."
        bullets={["Docker & Ollama compatible", "Built-in rate limiting & cost controls", "Observability hooks for your stack"]}
      />
      <FeatureCard
        title="Real-Time AI Firewall"
        desc="Our lightweight proxy stops harmful, biased, or non-compliant outputs before they reach users, with minimal performance impact."
        bullets={["Adds as little as <b class='text-purple-300'>133ms of latency</b>", "PII & jailbreak detection", "Customizable safety policies"]}
      />
      <FeatureCard
        title="Automated Red-Teaming"
        desc="Proactively discover vulnerabilities before deployment. Simulate attacks and get clear, actionable safety reports."
        bullets={["Adversarial testing suite", "OWASP/NIST risk mapping", "Exportable PDF reports for investors"]}
      />
      <FeatureCard
        title="Trace & Audit"
        desc="Instantly trace responses back to their source data. Fix problems fast, build trust, and maintain a clear audit trail for compliance."
        bullets={["Evidence-linked answers (RAG)", "Per-document source tracing", "One-click suppression & follow-up tests"]}
      />
    </div>
  </Section>
);

const HowItWorks: React.FC = () => (
  <Section id="how" className="py-20" data-testid="how">
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <h2 className="text-3xl font-bold text-white md:text-4xl">Simple Integration, Powerful Protection</h2>
      <p className="mt-3 text-white/70">Get started in minutes. Obvix works like a firewall for your LLM, requiring just a one-line code change.</p>
    </div>
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
      <Tilt3D className="relative">
        <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <h3 className="mb-3 text-xl font-semibold text-white">How Obvix Fits Your Stack</h3>
          <ol className="space-y-4 text-sm text-white/80">
            <li className="flex items-start gap-3"><strong className="text-purple-300 text-lg font-bold">1.</strong> <span><strong className="text-white">Point to Obvix:</strong> Simply change the base URL in your existing code to our proxy endpoint. That's it.</span></li>
            <li className="flex items-start gap-3"><strong className="text-purple-300 text-lg font-bold">2.</strong> <span><strong className="text-white">Intercept & Filter:</strong> We analyze every incoming prompt and outgoing response in real-time for 13+ risk categories.</span></li>
            <li className="flex items-start gap-3"><strong className="text-purple-300 text-lg font-bold">3.</strong> <span><strong className="text-white">Block or Allow:</strong> Based on your policies, unsafe content is blocked, and safe content is passed through seamlessly to your users.</span></li>
          </ol>
        </div>
      </Tilt3D>
      <Tilt3D className="relative">
        <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl" />
          <h3 className="mb-3 text-xl font-semibold text-white">Why Teams Choose Obvix</h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li><strong className="text-purple-300 text-lg font-bold">1.</strong> <span className="text-white">Purpose-built for SMEs & startups</span> — minimal setup, quick value, and no need for a dedicated ML safety team.</li>
            <li><strong className="text-purple-300 text-lg font-bold">2.</strong> Flexible deployment <span className="text-white">on‑prem, air‑gapped, or cloud</span> to match your security and cost needs without vendor lock‑in.</li>
            <li><strong className="text-purple-300 text-lg font-bold">3.</strong>  Turns safety into a <span className="text-white">competitive edge</span> with clear safety reports and proof you can show customers and investors.</li>
            <li><strong className="text-purple-300 text-lg font-bold">4.</strong>  <span className="text-white">Familiar OpenAI‑style API</span> means your app code barely changes, ensuring smooth integration.</li>
            
          </ul>
        </div>
      </Tilt3D>
    </div>
  </Section>
);

const UseCases: React.FC = () => (
  <Section id="usecases" className="py-20" data-testid="usecases">
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <h2 className="text-3xl font-bold text-white md:text-4xl">Who We Serve</h2>
      <p className="mt-3 text-white/70">Built for lean, security-conscious teams that want production-grade safety without the enterprise price tag or complexity.</p>
    </div>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {[
        {
          title: "SMEs & B2B Tech",
          desc: "Add AI to your product with confidence. Obvix reduces risk, shortens sales cycles, and gives customers the compliance assurance they demand.",
        },
        {
          title: "AI-Powered Startups",
          desc: "Ship faster with investor-ready safety proofs. Keep your burn rate low by securely running local or open-source models with our guardrails.",
        },
        {
          title: "Engineering & Security Teams",
          desc: "Meet compliance requirements (like ISO 42001 & the EU AI Act) and reassure leadership with continuous testing, monitoring, and clear audit trails.",
        },
      ].map((c) => (
        <Tilt3D key={c.title} className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 h-full">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl" />
            <h3 className="mb-2 text-lg font-semibold text-white">{c.title}</h3>
            <p className="text-sm text-white/75">{c.desc}</p>
          </div>
        </Tilt3D>
      ))}
    </div>
  </Section>
);

const Faq: React.FC = () => {
  const faqs = [
    {
      q: "What is Obvix AI?",
      a: "Obvix is an AI governance and safety toolkit, designed as a plug-and-play firewall for Large Language Models (LLMs). It helps businesses, especially SMEs and startups, filter harmful content, prevent model misuse, and meet compliance requirements without needing a dedicated in-house AI safety team."
    },
    {
      q: "How does the LLM Proxy work?",
      a: "The proxy is a lightweight middleware that sits between your application and your LLM API. You simply change the model's base URL in your code to point to the Obvix proxy endpoint. It then intercepts and analyzes all prompts and responses in real-time, blocking any content that violates your safety policies."
    },
    {
      q: "What models and APIs do you support?",
      a: "Our proxy is compatible with any LLM that uses an OpenAI-style API. This includes OpenAI's models, as well as a wide range of open-source and local models served through tools like Ollama, llama.cpp, or vLLM."
    },
    {
      q: "How much latency does Obvix add?",
      a: "Performance is critical. Our proxy is optimized for speed and adds minimal overhead. On consumer-grade hardware, we've tested our filtering to add as little as 133ms of latency to your API calls."
    },
    {
      q: "Do you store or log our data?",
      a: "No. We prioritize your privacy and security. Obvix does not store or log sensitive customer data. For maximum control, we also offer on-premise deployment options (e.g., a Docker container) so your data never leaves your environment."
    },
    {
      q: "What is 'Red-Teaming'?",
      a: "Red-Teaming is a form of adversarial testing where we proactively 'attack' your AI model with specialized prompts to discover weaknesses before you deploy. Our service automates this process and provides a detailed report on vulnerabilities, helping you harden your model's defenses."
    }
  ];

  return (
    <Section id="faq" className="py-20" data-testid="faq">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">Frequently Asked Questions</h2>
      </div>
      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-lg font-semibold text-white/90 hover:text-white">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-white/70">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
};

const BuildingInPublic: React.FC = () => (
  <Section id="public" className="py-20" data-testid="public">
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-3xl font-bold text-white md:text-4xl">Building in Public</h2>
      <p className="mt-3 text-white/70">
        Trust is earned through transparency. We're building Obvix in public, sharing our progress, challenges, and roadmap. Follow along for technical write-ups, benchmarks, and product updates.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="https://karanprasad.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white/80 backdrop-blur transition hover:bg-white/10"
        >
          Read the Blog
        </a>
        <a
          href="https://x.com/thtskaran"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-2xl border border-purple-500/30 px-5 py-3 text-white shadow-lg shadow-purple-950/40 transition hover:bg-white/5"
        >
          Follow on X (Twitter)
        </a>
      </div>
    </div>
  </Section>
);

const Waitlist: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            console.log("Waitlist submission:", email);
            setSubmitted(true);
        }
    };

    return (
        <Section id="waitlist" className="py-14" data-testid="waitlist">
            <div
              className="
                relative mx-auto max-w-3xl overflow-hidden rounded-3xl
                border border-white/10 p-8 text-center
                backdrop-blur-sm bg-transparent
                transition-colors duration-300
                hover:border-purple-400/30
              "
            >
                <h2 className="text-3xl font-bold text-white md:text-4xl">Get Early Access</h2>
                <p className="mt-2 text-white/60">Join the waitlist to be among the first to secure your AI applications with Obvix.</p>
                <AnimatePresence mode="wait">
                    {submitted ? (
                        <motion.div
                            key="thank-you"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="mt-6 text-base font-medium text-purple-300"
                        >
                            Thanks for joining! We'll be in touch.
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="mx-auto mt-6 flex max-w-2xl items-center gap-3"
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                required
                                className="flex-1 rounded-2xl border border-white/10 bg-white/5/50 backdrop-blur px-4 py-3 text-white placeholder-white/35 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/40 transition"
                            />
                            <MagneticButton type="submit" className="shrink-0">
                                Join Waitlist
                            </MagneticButton>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </Section>
    );
};


const Footer: React.FC = () => (
  <footer className="border-t border-white/10 py-10" data-testid="footer">
    <Section className="flex flex-col items-center justify-between gap-6 md:flex-row">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-500" />
        <span className="text-sm text-white/70">© {new Date().getFullYear()} Obvix AI</span>
      </div>
      <div className="flex items-center gap-6 text-sm text-white/60">
        <a href="/privacy" className="hover:text-white">Privacy</a>
        <a href="/security" className="hover:text-white">Security</a>
      </div>
    </Section>
  </footer>
);

// -------------------- Root -------------------- //
export default function ObvixLanding() {
  // Show a splash loader on initial load, then fade it out once the page has loaded.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const finish = () => setLoading(false);

    if (document.readyState === "complete") {
      // Give a tiny delay to avoid a flash and let the canvas settle
      const t = setTimeout(finish, 350);
      return () => clearTimeout(t);
    }

    window.addEventListener("load", finish);
    return () => window.removeEventListener("load", finish);
  }, []);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="min-h-screen w-full bg-[#0b0b12] text-white" data-testid="root" aria-busy={loading}>
          {/* Splash Loader */}
          <AnimatePresence>{loading && <SplashLoader />}</AnimatePresence>

          <Navbar />
          <GridBackdrop />
          <Hero3D />
          <Features />
          <HowItWorks />
          <UseCases />
          <BuildingInPublic />
          <Faq />
          <Waitlist />
          <Footer />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuLabel>Obvix AI Navigation</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => scrollToId("features")}>Features</ContextMenuItem>
        <ContextMenuItem onClick={() => scrollToId("how")}>How it Works</ContextMenuItem>
        <ContextMenuItem onClick={() => scrollToId("faq")}>FAQ</ContextMenuItem>
        <ContextMenuItem onClick={() => scrollToId("public")}>Public Log</ContextMenuItem>
        <ContextMenuItem onClick={() => scrollToId("waitlist")}>Join Waitlist</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => (window.location.href = "mailto:hello@Karanprasad.com")}>Contact</ContextMenuItem>
        <ContextMenuItem onClick={() => window.location.reload()}>Reload Page</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

