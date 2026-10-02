"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DashboardStats = {
  pages: number;
  posts: number;
  menus: number;
  components: number;
};

/* =========================================================
   ICONS
========================================================= */

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name:
  | "page"
  | "post"
  | "menu"
  | "component"
  | "plus"
  | "arrow"
  | "globe"
  | "chart"
  | "spark"
  | "eye"
  | "edit"
  | "check"
  | "external";
  className?: string;
}) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "page":
      return (
        <svg {...common}>
          <path d="M6 3.5h8l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
          <path d="M14 3.5V8h4" />
          <path d="M8 12h8M8 16h5" />
        </svg>
      );

    case "post":
      return (
        <svg {...common}>
          <rect x="4" y="3.5" width="16" height="17" rx="2" />
          <path d="M8 7.5h8M8 11.5h8M8 15.5h5" />
        </svg>
      );

    case "menu":
      return (
        <svg {...common}>
          <path d="M4 6h16M4 12h16M4 18h16" />
          <circle
            cx="8"
            cy="6"
            r="1"
            fill="currentColor"
            stroke="none"
          />
          <circle
            cx="15"
            cy="12"
            r="1"
            fill="currentColor"
            stroke="none"
          />
          <circle
            cx="10"
            cy="18"
            r="1"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );

    case "component":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );

    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.3 2.6 3.5 5.6 3.5 9s-1.2 6.4-3.5 9c-2.3-2.6-3.5-5.6-3.5-9S9.7 5.6 12 3Z" />
        </svg>
      );

    case "chart":
      return (
        <svg {...common}>
          <path d="M4 19V5M4 19h16" />
          <path d="m7 15 3-4 3 2 5-7" />
        </svg>
      );

    case "spark":
      return (
        <svg {...common}>
          <path d="m12 3 1.7 6 5.5 1.7-5.5 1.7-1.7 6-1.7-6-5.5-1.7 5.5-1.7L12 3Z" />
          <path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />
        </svg>
      );

    case "eye":
      return (
        <svg {...common}>
          <path d="M2.5 12s3.2-5 9.5-5 9.5 5 9.5 5-3.2 5-9.5 5-9.5-5-9.5-5Z" />
          <circle cx="12" cy="12" r="2.3" />
        </svg>
      );

    case "edit":
      return (
        <svg {...common}>
          <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17l-1 3Z" />
          <path d="m14.5 7.5 2 2" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "external":
      return (
        <svg {...common}>
          <path d="M14 5h5v5M19 5l-8 8" />
          <path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
        </svg>
      );

    default:
      return null;
  }
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
  delay,
  loading,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  iconClass: string;
  delay: string;
  loading: boolean;
}) {
  return (
    <div
      className="rounded-xl border border-slate-200 bg-white px-4 py-4 transition-colors duration-200 hover:border-slate-300"
      style={{
        animation: "dashboardFadeUp .45s ease both",
        animationDelay: delay,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {title}
          </p>

          <div className="mt-2">
            {loading ? (
              <div className="h-8 w-14 animate-pulse rounded-md bg-slate-100" />
            ) : (
              <p className="text-[28px] font-bold leading-none tracking-tight text-slate-900">
                {value}
              </p>
            )}
          </div>

          <p className="mt-2 text-[11px] text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ACTIVITY ITEM
========================================================= */

function ActivityItem({
  icon,
  title,
  description,
  iconClass,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconClass: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-slate-50">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[10px] text-slate-400">
          {description}
        </p>
      </div>

      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    pages: 0,
    posts: 0,
    menus: 0,
    components: 0,
  });

  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            "Failed to fetch dashboard statistics"
          );
        }

        const data = await response.json();

        setStats(data);
      } catch (error) {
        console.error(
          "DASHBOARD STATS ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

   useEffect(() => {
    document.title = "Dashboard";

    return () => {
      document.title = "Admin";
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes dashboardFadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dashboardFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes dashboardPulse {
          0%,
          100% {
            opacity: 0.4;
          }

          50% {
            opacity: 1;
          }
        }
      `}</style>

      <main className="min-h-screen bg-[#f5f7fb]">
        <div className="mx-auto max-w-[1500px] space-y-5">

          {/* =================================================
              HERO
          ================================================= */}

          <section
            className="relative overflow-hidden rounded-xl bg-[#0c1424]"
            style={{
              animation:
                "dashboardFadeUp .45s ease both",
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-blue-600/15 blur-[80px]" />

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/10 blur-[80px]" />

            <div className="relative flex flex-col justify-between gap-6 px-6 py-6 lg:flex-row lg:items-center lg:px-8">

              {/* LEFT */}

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>

                  <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-300">
                    Dashboard Online
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-[28px]">
                  Good to see you again.
                  <span className="ml-1.5">👋</span>
                </h1>

                <p className="mt-2 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
                  Manage your website content, navigation and
                  components from one clean workspace.
                </p>

                <div className="mt-4 flex flex-wrap gap-2.5">

                  <Link
                    href="/admin/pages/new"
                    className="group inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-slate-900 transition-colors hover:bg-blue-50"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-600 text-white">
                      <Icon
                        name="plus"
                        className="h-3 w-3"
                      />
                    </span>

                    Create New Page

                    <Icon
                      name="arrow"
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    href="/"
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <Icon
                      name="globe"
                      className="h-3.5 w-3.5"
                    />

                    View Website

                    <Icon
                      name="external"
                      className="h-3 w-3"
                    />
                  </Link>

                </div>
              </div>

              {/* RIGHT VISUAL */}

              <div
                className="hidden shrink-0 lg:block"
                style={{
                  animation:
                    "dashboardFloat 4s ease-in-out infinite",
                }}
              >
                <div className="w-[270px] rounded-xl border border-white/10 bg-white/[0.045] p-4">

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-500">
                        Workspace
                      </p>

                      <p className="mt-0.5 text-xs font-bold text-white">
                        Content Control
                      </p>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                      <Icon
                        name="spark"
                        className="h-4 w-4"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex h-14 items-end gap-1">
                    {[30, 45, 35, 58, 42, 68, 52, 76, 60, 82].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-sm bg-blue-500/50"
                          style={{
                            height: `${height}%`,
                            animation:
                              "dashboardFadeUp .6s ease both",
                            animationDelay: `${index * 50}ms`,
                          }}
                        />
                      )
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[9px] text-slate-500">
                      Activity overview
                    </span>

                    <span className="text-[9px] font-semibold text-emerald-400">
                      ● Active
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </section>

          {/* =================================================
              STATS
          ================================================= */}

          <section>
            <div className="mb-3 flex items-center justify-between">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                  Overview
                </p>

                <h2 className="mt-0.5 text-lg font-bold text-slate-900">
                  Your workspace
                </h2>
              </div>

              <div className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live data
              </div>

            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard
                title="Pages"
                value={stats.pages}
                subtitle="Website content"
                icon={
                  <Icon
                    name="page"
                    className="h-4 w-4"
                  />
                }
                iconClass="bg-blue-50 text-blue-600"
                delay="80ms"
                loading={loading}
              />

              <StatCard
                title="Posts"
                value={stats.posts}
                subtitle="Published content"
                icon={
                  <Icon
                    name="post"
                    className="h-4 w-4"
                  />
                }
                iconClass="bg-violet-50 text-violet-600"
                delay="140ms"
                loading={loading}
              />

              <StatCard
                title="Menus"
                value={stats.menus}
                subtitle="Site navigation"
                icon={
                  <Icon
                    name="menu"
                    className="h-4 w-4"
                  />
                }
                iconClass="bg-emerald-50 text-emerald-600"
                delay="200ms"
                loading={loading}
              />

              <StatCard
                title="Components"
                value={stats.components}
                subtitle="Reusable blocks"
                icon={
                  <Icon
                    name="component"
                    className="h-4 w-4"
                  />
                }
                iconClass="bg-orange-50 text-orange-600"
                delay="260ms"
                loading={loading}
              />

            </div>
          </section>

          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.7fr_1fr]">

            {/* RECENT ACTIVITY */}

            <section
              className="rounded-xl border border-slate-200 bg-white"
              style={{
                animation:
                  "dashboardFadeUp .45s ease both",
                animationDelay: "320ms",
              }}
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Content Analytics
                  </p>

                  <h3 className="mt-0.5 text-base font-bold text-slate-900">
                    Recent Activity
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
                    LIVE
                  </span>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                    <Icon
                      name="chart"
                      className="h-4 w-4"
                    />
                  </div>
                </div>

              </div>

              <div className="p-4 sm:p-5">

                <div className="space-y-1">

                  <ActivityItem
                    icon={
                      <Icon
                        name="page"
                        className="h-4 w-4"
                      />
                    }
                    title="Pages are being managed"
                    description={`${stats.pages} pages available`}
                    iconClass="bg-blue-50 text-blue-600"
                  />

                  <ActivityItem
                    icon={
                      <Icon
                        name="post"
                        className="h-4 w-4"
                      />
                    }
                    title="Content management"
                    description={`${stats.posts} posts in system`}
                    iconClass="bg-violet-50 text-violet-600"
                  />

                  <ActivityItem
                    icon={
                      <Icon
                        name="menu"
                        className="h-4 w-4"
                      />
                    }
                    title="Navigation system"
                    description={`${stats.menus} menus configured`}
                    iconClass="bg-emerald-50 text-emerald-600"
                  />

                  <ActivityItem
                    icon={
                      <Icon
                        name="component"
                        className="h-4 w-4"
                      />
                    }
                    title="Components ready"
                    description={`${stats.components} components available`}
                    iconClass="bg-orange-50 text-orange-600"
                  />

                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                    <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                  </span>

                  <span className="text-[10px] font-medium text-slate-500">
                    CMS is operating normally
                  </span>
                </div>

              </div>
            </section>

            {/* QUICK ACTIONS */}

            <section
              className="rounded-xl border border-slate-200 bg-white p-5"
              style={{
                animation:
                  "dashboardFadeUp .45s ease both",
                animationDelay: "380ms",
              }}
            >
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Shortcuts
                </p>

                <h3 className="mt-0.5 text-base font-bold text-slate-900">
                  Quick Actions
                </h3>
              </div>

              <div className="space-y-2">

                {/* CREATE PAGE */}

                <Link
                  href="/admin/pages/new"
                  className="group flex items-center gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:border-blue-100 hover:bg-blue-50/40"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Icon
                      name="plus"
                      className="h-4 w-4"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800">
                      Create New Page
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Build a new website page
                    </p>
                  </div>

                  <Icon
                    name="arrow"
                    className="h-4 w-4 text-slate-300 transition-colors group-hover:text-blue-500"
                  />
                </Link>

                {/* MANAGE PAGES */}

                <Link
                  href="/admin/pages"
                  className="group flex items-center gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:border-violet-100 hover:bg-violet-50/40"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <Icon
                      name="edit"
                      className="h-4 w-4"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800">
                      Manage Pages
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Edit and organize content
                    </p>
                  </div>

                  <Icon
                    name="arrow"
                    className="h-4 w-4 text-slate-300 transition-colors group-hover:text-violet-500"
                  />
                </Link>

                {/* MANAGE MENUS */}

                <Link
                  href="/admin/menus"
                  className="group flex items-center gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:border-emerald-100 hover:bg-emerald-50/40"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Icon
                      name="menu"
                      className="h-4 w-4"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800">
                      Manage Menus
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Configure website navigation
                    </p>
                  </div>

                  <Icon
                    name="arrow"
                    className="h-4 w-4 text-slate-300 transition-colors group-hover:text-emerald-500"
                  />
                </Link>

              </div>

              {/* STATUS */}

              <div className="mt-4 rounded-lg bg-[#0c1424] p-4">
                <div className="flex items-center gap-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Icon
                      name="check"
                      className="h-4 w-4"
                    />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-white">
                      Everything looks good
                    </p>

                    <p className="mt-0.5 text-[9px] text-slate-500">
                      Your CMS is ready to use.
                    </p>
                  </div>

                </div>
              </div>

            </section>
          </div>

          {/* =================================================
              BOTTOM STATUS
          ================================================= */}

          <div
            className="grid grid-cols-1 gap-3 md:grid-cols-3"
            style={{
              animation:
                "dashboardFadeUp .45s ease both",
              animationDelay: "440ms",
            }}
          >

            {/* WEBSITE */}

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon
                    name="globe"
                    className="h-4 w-4"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Website
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-slate-800">
                    Online
                  </p>
                </div>

                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
            </div>

            {/* CMS HEALTH */}

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Icon
                    name="check"
                    className="h-4 w-4"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    CMS Health
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-slate-800">
                    All systems normal
                  </p>
                </div>

                <span className="text-[9px] font-bold text-emerald-500">
                  100%
                </span>

              </div>
            </div>

            {/* PRO TIP */}

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Icon
                    name="spark"
                    className="h-4 w-4"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Pro Tip
                  </p>

                  <p className="mt-0.5 truncate text-xs font-semibold text-slate-700">
                    Keep your navigation simple.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>
    </>
  );
}