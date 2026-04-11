import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Lock,
  GitBranch,
  Users,
  Check,
  ChevronRight,
  Shield,
} from "lucide-react";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const monoClass =
    "[font-family:'JetBrains_Mono','Fira_Code',Consolas,Menlo,monospace]";
  const containerClass =
    "mx-auto w-full max-w-6xl px-6 max-[900px]:px-5 max-[620px]:px-4 max-[480px]:px-3";

  const problemPoints = [
    "You pushed a broken build because someone's .env file was outdated.",
    "Onboarding a new dev took two hours of Slack pings for missing keys.",
    "Your laptop died and you lost every local environment config.",
    "Three projects, four staging environments, zero single source of truth.",
    "You copy-pasted credentials into a Notion doc. You know that's wrong.",
  ];

  const features = [
    {
      icon: <Lock size={20} />,
      title: "Secure storage",
      desc: "Sensitive data is encrypted before storage and accessible only through your authenticated session.",
    },
    {
      icon: <Users size={20} />,
      title: "Access anywhere",
      desc: "Access your env securely from any device through your dashboard.",
    },
    {
      icon: <GitBranch size={20} />,
      title: "Flexible updates",
      desc: "Edit and update your environment variables anytime.",
    },
  ];

  const security = [
    { title: "Encrypted before storage", desc: "" },
    { title: "No plaintext values in database", desc: "" },
    { title: "Access restricted to your account", desc: "" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0e0e10] text-[#f4f4f5]">
      <header
        className={`fixed left-0 right-0 top-0 z-50 border-b border-transparent bg-transparent transition-all duration-[250ms] ${
          scrolled ? "border-gray-800 bg-[#0e0e10]/93 backdrop-blur-md" : ""
        }`}
      >
        <div
          className={`${containerClass} flex h-14 items-center justify-between`}
        >
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <div
              className="grid h-6 w-6 place-items-center rounded-md bg-amber-400"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path
                  d="M4 7h16M4 12h10M4 17h6"
                  stroke="#0E0E10"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span>Envora</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="bg-transparent px-3 py-1.5 text-sm text-gray-400 transition-all duration-[180ms] hover:text-gray-100 hover:opacity-100 max-[620px]:hidden"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-[#0e0e10] transition-all duration-[180ms] hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="pb-20 pt-32">
          <div
            className={`${containerClass} grid items-center gap-16 overflow-x-hidden lg:grid-cols-2`}
          >
            <div className="translate-y-0 opacity-100">
              <h1 className="mb-5 text-5xl font-bold leading-[1.08] tracking-[-0.02em] lg:text-6xl">
                Your env vars.
                <br />
                <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                  Always there.
                </span>
              </h1>

              <p className="mb-7 max-w-[520px] text-base text-gray-400">
                Envora secures, syncs, and manages your environment variables
                across every device, project, and team - so you never lose a
                config file again.
              </p>

              <div className="flex flex-wrap items-center gap-3 max-[620px]:w-full max-[620px]:flex-col">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-[#0e0e10] transition-all duration-[180ms] hover:opacity-90 max-[620px]:w-full"
                >
                  Start for free <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            <div className="relative translate-y-0 opacity-100">
              <div
                className="pointer-events-none absolute inset-0 scale-[0.88] rounded-[18px] bg-amber-400/5 blur-[72px]"
                aria-hidden="true"
              ></div>
              <div className="relative max-w-full overflow-hidden rounded-[10px] border border-gray-800 bg-gradient-to-br from-[#0f1115] via-[#11141a] to-[#0d1015] max-[620px]:overflow-x-auto">
                <div className="flex items-center gap-2 border-b border-gray-800 px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-red-500 opacity-80"></span>
                  <span className="h-3 w-3 rounded-full bg-yellow-400 opacity-80"></span>
                  <span className="h-3 w-3 rounded-full bg-green-500 opacity-80"></span>
                  <span className={`${monoClass} ml-2 text-xs text-gray-500`}>
                    ~/myproject/.env
                  </span>
                </div>

                <div
                  className={`${monoClass} break-all p-5 text-sm leading-[1.65] text-gray-300 max-[900px]:p-4 max-[900px]:text-xs max-[620px]:overflow-x-auto max-[620px]:p-2 max-[620px]:text-[10px] max-[480px]:p-1.5 max-[480px]:text-[9px]`}
                >
                  <div className="text-gray-600">
                    # synced by envora * 2 secs ago
                  </div>

                  <div className="mt-3">
                    <span className="text-gray-400">DATABASE_URL</span>{" "}
                    <span className="text-gray-600">=</span>
                    <span className="text-amber-400">
                      enc::v1::aGVsbG8gd29ybGQ=
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">STRIPE_SECRET_KEY</span>
                    <span className="text-gray-600">=</span>
                    <span className="text-amber-400">
                      enc::v1::c2VjcmV0a2V5aGVyZQ=
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">NEXT_PUBLIC_API_URL</span>
                    <span className="text-gray-600">=</span>{" "}
                    <span>https://api.myapp.com</span>
                  </div>
                  <div>
                    <span className="text-gray-400">OPENAI_API_KEY</span>
                    <span className="text-gray-600">=</span>
                    <span className="text-amber-400">
                      enc::v1::b3BlbmFpa2V5aGVyZQ=
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">JWT_SECRET</span>{" "}
                    <span className="text-gray-600">=</span>
                    <span className="text-amber-400">
                      enc::v1::and0c2VjcmV0aGVyZQ=
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">REDIS_URL</span>
                    <span className="text-gray-600">=</span>
                    <span className="text-amber-400">
                      enc::v1::cmVkaXN1cmxoZXJl
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Check size={14} className="text-amber-300" />
                    <span className="text-gray-600">
                      6 variables synced across 3 devices
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-x-hidden py-16">
          <div className="h-px w-full bg-gray-800"></div>
          <div className={`${containerClass} max-w-3xl pt-16`}>
            <p
              className={`${monoClass} mb-4 text-xs uppercase tracking-[0.15em] text-amber-400`}
            >
              The problem
            </p>
            <h2 className="mb-3.5 text-[clamp(30px,4vw,42px)] leading-[1.12] tracking-[-0.02em]">
              Config management is broken.
            </h2>
            <p className="text-sm text-gray-400">
              Most teams treat environment variables as an afterthought - until
              something goes wrong.
            </p>

            <div className="mt-7">
              {problemPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 border-b border-gray-800 py-[18px] last:border-b-0 max-[620px]:py-2.5 max-[480px]:py-2"
                >
                  <span
                    className={`${monoClass} w-[22px] shrink-0 text-xs text-gray-600`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-gray-300">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-x-hidden py-16">
          <div className="h-px w-full bg-gray-800"></div>
          <div
            className={`${containerClass} grid grid-cols-1 items-start gap-8 pt-16 lg:grid-cols-2 lg:gap-16 max-[620px]:gap-5`}
          >
            <div>
              <p
                className={`${monoClass} mb-4 text-xs uppercase tracking-[0.15em] text-amber-400`}
              >
                The solution
              </p>
              <h2 className="mb-3.5 text-[clamp(30px,4vw,42px)] leading-[1.12] tracking-[-0.02em]">
                One vault.
                <br />
                Every project.
                <br />
                Every device.
              </h2>
              <p className="max-w-[420px] text-sm text-gray-400">
                Envora gives each project a secure vault for environment
                variables. Pull the right config anywhere - laptop, CI,
                production - from your dashboard.
              </p>

              <div className="mt-[18px] grid gap-3">
                <div className="flex items-center gap-2.5 text-sm text-gray-300">
                  <Check size={16} className="text-amber-300" />
                  End-to-end encryption, always
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-300">
                  <Check size={16} className="text-amber-300" />
                  Hierarchical project structure
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-300">
                  <Check size={16} className="text-amber-300" />
                  Per-environment overrides
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-300">
                  <Check size={16} className="text-amber-300" />
                  Access and manage your environment variables directly from
                  your dashboard
                </div>
              </div>
            </div>

            <div className="relative max-w-full overflow-hidden rounded-[10px] border border-gray-800 bg-[#18181b] max-[620px]:overflow-x-auto">
              <div className="flex items-center gap-2 border-b border-gray-800 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-500 opacity-80"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-400 opacity-80"></span>
                <span className="h-3 w-3 rounded-full bg-green-500 opacity-80"></span>
                <span className={`${monoClass} ml-2 text-xs text-gray-500`}>
                  project structure
                </span>
              </div>

              <div
                className={`${monoClass} break-all p-5 text-[13px] leading-[1.65] text-gray-300 max-[900px]:p-4 max-[900px]:text-xs max-[620px]:overflow-x-auto max-[620px]:p-2 max-[620px]:text-[10px] max-[480px]:p-1.5 max-[480px]:text-[9px]`}
              >
                <div>my-saas</div>
                <div className="text-gray-600">
                  |-- <span className="text-gray-300">frontend</span>
                </div>
                <div className="text-gray-600">
                  | |-- <span className="text-amber-400">.env.development</span>
                </div>
                <div className="text-gray-600">
                  | |-- <span className="text-amber-400">.env.staging</span>
                </div>
                <div className="text-gray-600">
                  | `-- <span className="text-amber-400">.env.production</span>
                </div>
                <div className="text-gray-600">
                  |-- <span className="text-gray-300">backend</span>
                </div>
                <div className="text-gray-600">
                  | |-- <span className="text-amber-400">.env.development</span>
                </div>
                <div className="text-gray-600">
                  | |-- <span className="text-amber-400">.env.staging</span>
                </div>
                <div className="text-gray-600">
                  | `-- <span className="text-amber-400">.env.production</span>
                </div>
                <div className="text-gray-600">
                  `-- <span className="text-gray-300">shared</span>
                </div>
                <div className="text-gray-600">
                  `-- <span className="text-amber-400">.env.base</span>
                </div>

                <div className="mt-4 border-t border-gray-800 pt-4">
                  <div>
                    <span className="text-gray-600">#</span> Dashboard action:{" "}
                    <span className="text-amber-400">
                      Open frontend/production
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Check size={14} className="text-amber-300" />
                    <span className="text-gray-600">
                      12 variables available in this environment
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <div className="mt-[38px] flex items-start gap-3 rounded-[10px] border border-amber-400/20 bg-amber-400/5 p-[18px_22px]">
              <Shield size={20} className="shrink-0 text-amber-300" />
              <div>
                <div className="mb-1.5 text-sm font-semibold text-gray-100">
                  The zero-knowledge rule
                </div>
                <p className="text-sm text-gray-400">
                  Envora never stores plaintext secrets. Every value is
                  encrypted on your device before it leaves. Our servers hold
                  only ciphertext. Your data is encrypted before storage and
                  only accessible through your authenticated session.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-x-hidden py-16">
          <div className="h-px w-full bg-gray-800"></div>
          <div className={`${containerClass} pt-16`}>
            <p
              className={`${monoClass} mb-4 text-xs uppercase tracking-[0.15em] text-amber-400`}
            >
              Features
            </p>
            <h2 className="mb-3.5 text-[clamp(30px,4vw,42px)] leading-[1.12] tracking-[-0.02em]">
              Everything you need.
            </h2>
            <p className="text-sm text-gray-400">Nothing you don't.</p>

            <div className="mt-[34px] grid grid-cols-1 gap-4 overflow-x-hidden md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature, index) => (
                <article
                  key={index}
                  className="rounded-[10px] border border-gray-800 bg-[#18181b] p-4 transition duration-[180ms] hover:border-amber-400/40 max-[620px]:p-3"
                >
                  <div className="mb-3.5 text-base font-bold text-amber-400">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-sm text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-xs leading-[1.6] text-gray-500">
                    {feature.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-x-hidden py-16">
          <div className="h-px w-full bg-gray-800"></div>
          <div className={`${containerClass} max-w-[900px] pt-16`}>
            <p
              className={`${monoClass} mb-4 text-xs uppercase tracking-[0.15em] text-amber-400`}
            >
              Workflow
            </p>
            <h2 className="mb-3.5 text-[clamp(30px,4vw,42px)] leading-[1.12] tracking-[-0.02em]">
              Up in four steps.
            </h2>

            <div className="hidden items-start md:flex">
              {[
                {
                  step: "01",
                  title: "Login with Google",
                  command: "Click 'Get Started' → Google Login",
                },
                {
                  step: "02",
                  title: "Create project",
                  command: "Projects → New Project",
                },
                {
                  step: "03",
                  title: "Add sections",
                  command: "Project → Create Folders/Envs",
                },
                {
                  step: "04",
                  title: "Add variables",
                  command: "Section → Add Environment Variables",
                },
              ].map((item, index) => (
                <div key={index} className="min-w-0 flex-1">
                  <div className="flex w-full items-center">
                    <div
                      className={`${monoClass} grid h-8 w-8 shrink-0 place-items-center rounded-full border border-amber-400 bg-amber-400/5 text-xs text-amber-400`}
                    >
                      {item.step}
                    </div>
                    <div className="h-px flex-1 bg-gray-800"></div>
                  </div>
                  <div className="mt-3.5 pr-3.5">
                    <h4 className="mb-1 text-sm font-medium text-gray-100">
                      {item.title}
                    </h4>
                    <p className={`${monoClass} text-xs text-gray-500`}>
                      {item.command}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-0 md:hidden">
              {[
                {
                  step: "01",
                  title: "Login with Google",
                  command: "Click 'Get Started' → Google Login",
                },
                {
                  step: "02",
                  title: "Create project",
                  command: "Projects → New Project",
                },
                {
                  step: "03",
                  title: "Add sections",
                  command: "Project → Create Folders/Envs",
                },
                {
                  step: "04",
                  title: "Add variables",
                  command: "Section → Add Environment Variables",
                },
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-[32px_1fr] gap-x-3">
                  <div className="grid justify-items-center">
                    <div
                      className={`${monoClass} grid h-8 w-8 shrink-0 place-items-center rounded-full border border-amber-400 bg-amber-400/5 text-xs text-amber-400`}
                    >
                      {item.step}
                    </div>
                    <div className="mt-2 h-full w-px bg-gray-800"></div>
                  </div>
                  <div className="pb-5">
                    <h4 className="text-sm font-medium text-gray-100">
                      {item.title}
                    </h4>
                    <p className={`${monoClass} mt-1 text-xs text-gray-500`}>
                      {item.command}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-x-hidden py-16">
          <div className="h-px w-full bg-gray-800"></div>
          <div
            className={`${containerClass} grid grid-cols-1 items-start gap-8 pt-16 lg:grid-cols-2 lg:gap-16 max-[620px]:gap-5`}
          >
            <div>
              <p
                className={`${monoClass} mb-4 text-xs uppercase tracking-[0.15em] text-amber-400`}
              >
                Security
              </p>
              <h2 className="mb-3.5 text-[clamp(30px,4vw,42px)] leading-[1.12] tracking-[-0.02em]">
                Built for developers who care about their data
              </h2>
              <p className="max-w-[420px] text-sm text-gray-400">
                Security isn't an add-on - it's built into how Envora works.
              </p>
              <p className="mt-3 max-w-[420px] text-sm text-gray-400">
                Sensitive values are encrypted before storage and are only
                accessible through your authenticated session.
              </p>

              <div className="mt-6 grid gap-[14px]">
                {security.map((item, index) => (
                  <div key={index} className="flex items-start gap-2.5">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-amber-400"></span>
                    <div>
                      <h4 className="mb-0.5 text-sm font-medium text-gray-200">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative max-w-full overflow-hidden rounded-[10px] border border-gray-800 bg-[#18181b] max-[620px]:overflow-x-auto">
              <div className="flex items-center gap-2 border-b border-gray-800 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-500 opacity-80"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-400 opacity-80"></span>
                <span className="h-3 w-3 rounded-full bg-green-500 opacity-80"></span>
                <span className={`${monoClass} ml-2 text-xs text-gray-500`}>
                  encrypted vault
                </span>
              </div>

              <div
                className={`${monoClass} break-all p-5 text-xs leading-[1.65] text-gray-300 max-[900px]:p-4 max-[620px]:overflow-x-auto max-[620px]:p-2 max-[620px]:text-[10px] max-[480px]:p-1.5 max-[480px]:text-[9px]`}
              >
                <div className="mb-3 text-gray-600">
                  # frontend / production vault view
                </div>

                <div>
                  <span className="text-gray-400">DATABASE_URL</span>{" "}
                  <span className="text-gray-600">=</span>
                  <span className="text-amber-400">
                    enc::v1::8f3a2b1c9d4e5f6a7b8c9d0e1f2a3b4c
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">STRIPE_SECRET_KEY</span>{" "}
                  <span className="text-gray-600">=</span>
                  <span className="text-amber-400">
                    enc::v1::1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">JWT_SECRET</span>{" "}
                  <span className="text-gray-600">=</span>
                  <span className="text-amber-400">
                    enc::v1::9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">OPENAI_API_KEY</span>{" "}
                  <span className="text-gray-600">=</span>
                  <span className="text-amber-400">
                    enc::v1::2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">REDIS_URL</span>{" "}
                  <span className="text-gray-600">=</span>
                  <span className="text-amber-400">
                    enc::v1::7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">NEXT_PUBLIC_URL</span>{" "}
                  <span className="text-gray-600">=</span>
                  <span className="text-zinc-50/60">https://myapp.com</span>
                </div>

                <div className="mt-3.5 border-t border-gray-800 pt-3.5">
                  <div className="mt-2 flex items-center gap-2">
                    <Check size={14} className="text-amber-300" />
                    <span className="text-gray-600">
                      5 encrypted values · 1 public · no plaintext stored
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-x-hidden py-16 text-center">
          <div className="h-px w-full bg-gray-800"></div>
          <div className={`${containerClass} max-w-[760px] pt-16`}>
            <p
              className={`${monoClass} mb-4 text-xs uppercase tracking-[0.15em] text-amber-400`}
            >
              Get started
            </p>
            <h2 className="mb-3.5 text-[clamp(30px,4vw,42px)] leading-[1.12] tracking-[-0.02em]">
              Stop losing env files.
              <br />
              Start shipping.
            </h2>
            <p className="mx-auto mb-7 max-w-[480px] text-sm text-gray-400">
              Join thousands of developers who trust Envora with their
              environment variables. Free to start, scales with your team.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 max-[620px]:w-full max-[620px]:flex-col">
              <Link
                to="/register"
                className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-[#0e0e10] transition-all duration-[180ms] hover:opacity-90 sm:w-auto"
              >
                Create free account <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
