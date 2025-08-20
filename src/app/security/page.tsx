'use client';

import React from "react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
} from "@/components/ui/context-menu";
import Link from 'next/link';

const Section: React.FC<{ id?: string; className?: string; children: React.ReactNode }> = ({ id, className = "", children }) => (
  <section id={id} className={`relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</section>
);

const Navbar: React.FC = () => (
  <div className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0b0b12]/70 backdrop-blur">
    <Section className="flex h-16 items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold tracking-wide text-white/90">Obvix AI.</span>
      </div>
      <nav className="hidden md:flex items-center gap-7 text-sm">
        <Link href="/#features" className="text-white/70 hover:text-white">Features</Link>
        <Link href="/#how" className="text-white/70 hover:text-white">How it works</Link>
        <Link href="/#usecases" className="text-white/70 hover:text-white">Who we serve</Link>
        <Link href="/#public" className="text-white/70 hover:text-white">Building in public</Link>
        <Link href="mailto:hello@Karanprasad.com" className="text-white/70 hover:text-white">Contact</Link>
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

const Footer: React.FC = () => (
  <footer className="border-t border-white/10 py-10">
    <Section className="flex flex-col items-center justify-between gap-6 md:flex-row">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-500" />
        <span className="text-sm text-white/70">© {new Date().getFullYear()} Obvix AI</span>
      </div>
      <div className="flex items-center gap-6 text-sm text-white/60">
        <Link href="/privacy" className="hover:text-white">Privacy</Link>
        <Link href="/security" className="hover:text-white">Security</Link>
      </div>
    </Section>
  </footer>
);

export default function SecurityPage() {
  const go = (hash?: string) => {
    if (hash) window.location.href = `/#${hash}`;
    else window.location.href = "/";
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="min-h-screen w-full bg-[#0b0b12] text-white">
          <Navbar />
          <GridBackdrop />
          <main className="relative z-10 py-14">
            <Section>
              <div className="max-w-3xl">
                <h1 className="text-3xl font-bold md:text-4xl">Security</h1>
                <p className="mt-3 text-white/70">
                  Deploying AI safely means securing every layer — from your prompts to your infrastructure. Obvix AI is built with security‑first engineering so SMEs and startups can run AI without fear of leaks, tampering, or misuse.
                </p>

                <div className="mt-10 space-y-8 text-white/80">
                  <section>
                    <h2 className="text-xl font-semibold text-white">1. Deployment security</h2>
                    <ul className="mt-2 list-disc pl-5">
                      <li>Containerized isolation — Each model runs in its own Docker container to prevent cross‑contamination of data.</li>
                      <li>Network segmentation — Managed deployments run inside isolated VPC subnets.</li>
                      <li>Air‑gapped ready — Works fully offline for high‑security environments.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white">2. Data security</h2>
                    <ul className="mt-2 list-disc pl-5">
                      <li>Encryption in transit — TLS 1.3 with Perfect Forward Secrecy (PFS) for all API traffic.</li>
                      <li>Encryption at rest — AES‑256‑GCM encryption for logs, configs, and stored data.</li>
                      <li>Key management — Keys stored in secure enclaves locally or in AWS KMS / GCP KMS for managed deployments.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white">3. Access control</h2>
                    <ul className="mt-2 list-disc pl-5">
                      <li>Token‑based authentication — Unique API keys with per‑key permissions (read, write, admin).</li>
                      <li>Rate limiting — Stops brute‑force and abuse.</li>
                      <li>Role‑based access control (RBAC) — Limit dashboard privileges to the right people.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white">4. Threat detection & prevention</h2>
                    <ul className="mt-2 list-disc pl-5">
                      <li>Automated red teaming — Stress‑tests every model for vulnerabilities before going live.</li>
                      <li>Prompt injection & jailbreak detection — Blocks known and emerging attack vectors.</li>
                      <li>Anomaly detection — Flags unusual patterns that could indicate compromise.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white">5. Operational security</h2>
                    <ul className="mt-2 list-disc pl-5">
                      <li>Rapid patching — Security updates applied as soon as vulnerabilities are identified.</li>
                      <li>Security audits — Internal reviews plus optional third‑party penetration testing.</li>
                      <li>Incident response — Documented procedures for detection, containment, and recovery.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white">6. Compliance & standards</h2>
                    <p className="mt-2">Our security practices align with:</p>
                    <ul className="mt-2 list-disc pl-5">
                      <li>OWASP ASVS — Secure API and web application design.</li>
                      <li>NIST AI RMF — AI‑specific risk management.</li>
                      <li>ISO 27001 principles — Information security best practices.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white">7. Shared responsibility</h2>
                    <ul className="mt-2 list-disc pl-5">
                      <li>Rotate API keys regularly.</li>
                      <li>Run air‑gapped for highly sensitive workloads.</li>
                      <li>Review safety reports before production deployment.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white">Responsible disclosure</h2>
                    <p className="mt-2">
                      If you believe you’ve found a vulnerability, contact us at{" "}
                      <a className="text-purple-300 hover:underline" href="mailto:hello@Karanprasad.com">hello@Karanprasad.com</a>.
                      Please include steps to reproduce and impact. We appreciate coordinated disclosure.
                    </p>
                  </section>
                </div>

                {/* Back to Home button */}
                <div className="mt-14">
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="group relative inline-flex items-center gap-2 rounded-2xl border border-purple-500/30 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-purple-950/40 transition hover:bg-white/5"
                  >
                    <span className="relative">← Back to Home</span>
                    <span className="absolute inset-0 rounded-2xl bg-[radial-gradient(400px_circle_at_var(--x,50%)_var(--y,50%),rgba(167,139,250,0.18),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </button>
                </div>
              </div>
            </Section>
          </main>
          <Footer />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuLabel>Obvix AI</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => go("features")}>Explore Features</ContextMenuItem>
        <ContextMenuItem onClick={() => go("how")}>How it works</ContextMenuItem>
        <ContextMenuItem onClick={() => go("usecases")}>Who we serve</ContextMenuItem>
        <ContextMenuItem onClick={() => go("public")}>Building in public</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => (window.location.href = "mailto:hello@Karanprasad.com")}>Contact</ContextMenuItem>
        <ContextMenuItem onClick={() => (window.location.href = "/")}>Go to Home</ContextMenuItem>
        <ContextMenuItem onClick={() => window.location.reload()}>Reload</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

