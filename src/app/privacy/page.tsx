'use client'

import React from "react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
} from "@/components/ui/context-menu";

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
        <a href="/#features" className="text-white/70 hover:text-white">Features</a>
        <a href="/#how" className="text-white/70 hover:text-white">How it works</a>
        <a href="/#usecases" className="text-white/70 hover:text-white">Who we serve</a>
        <a href="/#public" className="text-white/70 hover:text-white">Building in public</a>
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

const Footer: React.FC = () => (
  <footer className="border-t border-white/10 py-10">
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

export default function PrivacyPage() {
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
                <h1 className="text-3xl font-bold md:text-4xl">Privacy Policy</h1>
                <p className="mt-3 text-white/70">
                  At Obvix AI, privacy isn’t an afterthought — it’s built into every feature we offer. Whether you’re an SME handling sensitive client information or a startup testing new ideas, you should know exactly how your data is handled and have full control over it.
                </p>

                <div className="mt-10 space-y-8 text-white/80">
                  <section>
                    <h2 className="text-xl font-semibold text-white">What we collect</h2>
                    <p className="mt-2">We collect only the data necessary to deliver our services, and nothing more.</p>

                    <div className="mt-4 space-y-4">
                      <div>
                        <h3 className="font-medium text-white">Model inputs & outputs</h3>
                        <ul className="mt-2 list-disc pl-5">
                          <li>Used solely for delivering AI responses, applying safety filters, and generating reports.</li>
                          <li>Not stored unless you explicitly enable logging.</li>
                          <li>In local‑only mode, they never leave your infrastructure.</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-medium text-white">Usage logs</h3>
                        <ul className="mt-2 list-disc pl-5">
                          <li>Optional, and stored locally by default.</li>
                          <li>Can include request timestamps, model used, safety filter results, and error logs.</li>
                          <li>Easily exportable or deletable at any time.</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-medium text-white">Contact information</h3>
                        <ul className="mt-2 list-disc pl-5">
                          <li>Collected only when you reach out for support, partnerships, or newsletters.</li>
                          <li>Never shared with third parties without your consent.</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white">Your controls</h2>
                    <ul className="mt-2 list-disc pl-5">
                      <li>Local‑Only Mode — Run Obvix AI entirely within your own environment.</li>
                      <li>Custom Retention — Set how long logs and reports are kept.</li>
                      <li>Export & Delete — Download or permanently remove all stored data instantly.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white">Compliance alignment</h2>
                    <ul className="mt-2 list-disc pl-5">
                      <li>GDPR — Right to access, rectify, and erase personal data.</li>
                      <li>CCPA — Data portability and opt‑out rights.</li>
                      <li>EU AI Act — Principles of data minimization and transparency for AI systems.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white">No silent storage</h2>
                    <p className="mt-2">
                      We never keep hidden copies of your data. If you don’t enable logging, no data is stored — period.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-white">Contact</h2>
                    <p className="mt-2">
                      Questions or requests:{" "}
                      <a className="text-purple-300 hover:underline" href="mailto:hello@Karanprasad.com">hello@Karanprasad.com</a>
                    </p>
                  </section>
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
