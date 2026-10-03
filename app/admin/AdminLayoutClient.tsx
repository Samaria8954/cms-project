"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type MenuKey = "pages" | "posts" | "menus" | null;

const SIDEBAR_STORAGE_KEY = "cms-admin-sidebar-collapsed";

/* =========================================================
   ICONS
========================================================= */

function Icon({
  name,
  size = 18,
}: {
  name:
    | "dashboard"
    | "pages"
    | "posts"
    | "media"
    | "menus"
    | "components"
    | "settings"
    | "plus"
    | "list"
    | "category"
    | "tag"
    | "chevron";
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );

    case "pages":
      return (
        <svg {...common}>
          <path d="M6 3.5h8l4 4V20.5H6z" />
          <path d="M14 3.5v4h4" />
          <path d="M9 12h6" />
          <path d="M9 16h6" />
        </svg>
      );

    case "posts":
      return (
        <svg {...common}>
          <path d="M5 4h14v16H5z" />
          <path d="M8 8h8" />
          <path d="M8 12h8" />
          <path d="M8 16h5" />
        </svg>
      );

    case "media":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9" r="1.5" />
          <path d="m5 17 4.5-4.5 3 3 2.5-2.5L19 17" />
        </svg>
      );

    case "menus":
      return (
        <svg {...common}>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      );

    case "components":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-2.4v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L8 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6.7v-2.4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L8 8.6l1.7-1.7.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2h2.4v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V14h-.2a1.7 1.7 0 0 0-1.5 1Z" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );

    case "list":
      return (
        <svg {...common}>
          <path d="M8 6h12" />
          <path d="M8 12h12" />
          <path d="M8 18h12" />
          <path d="M4 6h.01" />
          <path d="M4 12h.01" />
          <path d="M4 18h.01" />
        </svg>
      );

    case "category":
      return (
        <svg {...common}>
          <path d="M4 5h7l2 2h7v12H4z" />
        </svg>
      );

    case "tag":
      return (
        <svg {...common}>
          <path d="M4 5v6l9 9 7-7-9-9z" />
          <circle cx="8.5" cy="8.5" r="1" />
        </svg>
      );

    case "chevron":
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );

    default:
      return null;
  }
}

/* =========================================================
   MAIN NAV ITEM
========================================================= */

function NavItem({
  href,
  icon,
  label,
  active = false,
  hasSubmenu = false,
  submenuOpen = false,
  collapsed = false,
  onArrowClick,
  onMainClick,
}: {
  href: string;
  icon:
    | "dashboard"
    | "pages"
    | "posts"
    | "media"
    | "menus"
    | "components"
    | "settings";
  label: string;
  active?: boolean;
  hasSubmenu?: boolean;
  submenuOpen?: boolean;
  collapsed?: boolean;
  onArrowClick?: () => void;
  onMainClick?: () => void;
}) {
  return (
    <div
      className={`group relative flex h-10 items-center rounded-lg transition-all duration-200 ${
        active
          ? "bg-blue-600 text-white shadow-sm shadow-blue-600/10"
          : "text-slate-300 hover:bg-slate-900 hover:text-blue-400"
      }`}
    >
      <Link
        href={href}
        onClick={onMainClick}
        title={collapsed ? label : undefined}
        className={`flex min-w-0 flex-1 items-center ${
          collapsed ? "justify-center px-0" : "gap-3 px-3"
        }`}
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          <Icon name={icon} size={17} />
        </span>

        {!collapsed && (
          <span className="truncate text-[13px] font-medium">
            {label}
          </span>
        )}
      </Link>

      {/* ONLY ARROW CONTROLS DROPDOWN */}
      {hasSubmenu && !collapsed && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onArrowClick?.();
          }}
          aria-label={`${submenuOpen ? "Close" : "Open"} ${label} submenu`}
          aria-expanded={submenuOpen}
          className={`mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-all duration-200 ${
            active
              ? "text-white hover:bg-blue-700"
              : "text-slate-500 hover:bg-slate-800 hover:text-blue-400"
          }`}
        >
          <span
            className={`transition-transform duration-200 ${
              submenuOpen ? "rotate-90" : ""
            }`}
          >
            <Icon name="chevron" size={14} />
          </span>
        </button>
      )}

      {/* COLLAPSED TOOLTIP */}
      {collapsed && (
        <div className="pointer-events-none absolute left-[58px] top-1/2 z-50 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-xl transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100">
          {label}

          <span className="absolute left-[-4px] top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-l border-b border-slate-700 bg-slate-800" />
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SUB MENU ITEM
========================================================= */

function SubMenuItem({
  href,
  icon,
  label,
  active = false,
  onNavigate,
}: {
  href: string;
  icon: "plus" | "list" | "category" | "tag";
  label: string;
  active?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`group flex h-9 items-center rounded-md px-2 transition-all duration-200 ${
        active
          ? "bg-blue-500/15 font-medium text-blue-400"
          : "text-slate-400 hover:bg-slate-900/80 hover:text-blue-400"
      }`}
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-all duration-200 ${
          active
            ? "bg-blue-500/15 text-blue-400"
            : "text-slate-500 group-hover:bg-slate-800 group-hover:text-blue-400"
        }`}
      >
        <Icon name={icon} size={14} />
      </span>

      <span className="ml-2.5 truncate text-[12px]">
        {label}
      </span>

      {active && (
        <span className="ml-auto mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-400" />
      )}
    </Link>
  );
}

/* =========================================================
   ADMIN LAYOUT
========================================================= */

export default function AdminLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  /* =======================================================
     EDIT PAGE DETECTION
  ======================================================== */

  const isEditPage =
    /^\/admin\/pages\/[^/]+\/edit\/?$/.test(
      pathname
    );

  /* =======================================================
     ACTIVE SECTIONS
  ======================================================== */

  const isPagesSection =
    pathname === "/admin/pages" ||
    pathname.startsWith("/admin/pages/");

  const isPostsSection =
    pathname === "/admin/posts" ||
    pathname.startsWith("/admin/posts/");

  const isMenusSection =
    pathname === "/admin/menus" ||
    pathname.startsWith("/admin/menus/");

  const isDashboard =
    pathname === "/admin" ||
    pathname === "/admin/";

  /* =======================================================
     INITIAL OPEN MENU
  ======================================================== */

  const getInitialMenu = (
    path: string
  ): MenuKey => {
    if (
      path === "/admin/pages" ||
      path.startsWith("/admin/pages/")
    ) {
      return "pages";
    }

    if (
      path === "/admin/posts" ||
      path.startsWith("/admin/posts/")
    ) {
      return "posts";
    }

    if (
      path === "/admin/menus" ||
      path.startsWith("/admin/menus/")
    ) {
      return "menus";
    }

    return null;
  };

  const [openMenu, setOpenMenu] =
    useState<MenuKey>(() =>
      getInitialMenu(pathname)
    );

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  /* =======================================================
     LOAD SIDEBAR STATE
  ======================================================== */

  useEffect(() => {
    const saved =
      window.localStorage.getItem(
        SIDEBAR_STORAGE_KEY
      );

    if (saved === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSidebarCollapsed(true);
    }
  }, []);

  /* =======================================================
     SIDEBAR TOGGLE
  ======================================================== */

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((current) => {
      const next = !current;

      window.localStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        String(next)
      );

      return next;
    });

    setOpenMenu(null);
  }, []);

  /* =======================================================
     DROPDOWN TOGGLE

     ONLY ARROW CALLS THIS.
  ======================================================== */

  const toggleMenu = useCallback(
    (menu: Exclude<MenuKey, null>) => {
      if (sidebarCollapsed) return;

      setOpenMenu((current) =>
        current === menu
          ? null
          : menu
      );
    },
    [sidebarCollapsed]
  );

  /* =======================================================
     MAIN NAVIGATION

     Clicking main item navigates to its page.
     It does NOT open dropdown.
  ======================================================== */

  const closeDropdownOnMainClick =
    useCallback(() => {
      setOpenMenu(null);
    }, []);

  /* =======================================================
     SUBMENU NAVIGATION

     Clicking submenu keeps its parent dropdown open.
  ======================================================== */

  const keepMenuOpen = useCallback(
    (menu: Exclude<MenuKey, null>) => {
      if (!sidebarCollapsed) {
        setOpenMenu(menu);
      }
    },
    [sidebarCollapsed]
  );

  /* =======================================================
     OPEN STATES
  ======================================================== */

  const pagesOpen =
    openMenu === "pages";

  const postsOpen =
    openMenu === "posts";

  const menusOpen =
    openMenu === "menus";

  /* =======================================================
     EDIT PAGE = NO ADMIN SHELL
  ======================================================== */

  if (isEditPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="flex min-h-screen">

        {/* =================================================
            SIDEBAR
        ================================================== */}

        <aside
          className={`sidebar-scroll sticky top-0 flex h-screen shrink-0 flex-col overflow-y-auto bg-slate-950 text-white transition-all duration-300 ${
            sidebarCollapsed
              ? "w-[68px]"
              : "w-[220px]"
          }`}
        >

          {/* =================================================
              LOGO / COLLAPSE
          ================================================== */}

          <div className="flex h-[64px] shrink-0 items-center border-b border-slate-800 px-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className={`group relative flex w-full items-center rounded-lg transition-all duration-300 hover:bg-slate-900 ${
                sidebarCollapsed
                  ? "justify-center px-0"
                  : "gap-2.5 px-1"
              }`}
              aria-label={
                sidebarCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
              title={
                sidebarCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-600/20">
                <span className="text-sm font-bold">
                  C
                </span>
              </div>

              {!sidebarCollapsed && (
                <>
                  <div className="min-w-0 text-left leading-tight">
                    <div className="text-[14px] font-bold tracking-tight">
                      CMS Admin
                    </div>

                    <div className="text-[9px] font-medium uppercase tracking-[0.14em] text-slate-500">
                      Control Panel
                    </div>
                  </div>

                  <div className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors group-hover:bg-slate-800 group-hover:text-blue-400">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </div>
                </>
              )}

              {sidebarCollapsed && (
                <div className="pointer-events-none absolute left-[58px] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-xl transition-all duration-150 group-hover:opacity-100">
                  Expand Sidebar

                  <span className="absolute left-[-4px] top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-slate-800" />
                </div>
              )}
            </button>
          </div>

          {/* =================================================
              NAVIGATION
          ================================================== */}

          <nav className="flex-1 px-3 py-4">

            {/* DASHBOARD */}

            <div className="mb-1">
              <NavItem
                href="/admin"
                icon="dashboard"
                label="Dashboard"
                onMainClick={
                  closeDropdownOnMainClick
                }
                collapsed={
                  sidebarCollapsed
                }
                active={isDashboard}
              />
            </div>

            {/* =================================================
                PAGES
            ================================================== */}

            <div className="mb-1">
              <NavItem
                href="/admin/pages"
                icon="pages"
                label="Pages"
                onMainClick={
                  closeDropdownOnMainClick
                }
                collapsed={
                  sidebarCollapsed
                }
                active={
                  isPagesSection
                }
                hasSubmenu
                submenuOpen={
                  pagesOpen
                }
                onArrowClick={() =>
                  toggleMenu("pages")
                }
              />

              {pagesOpen &&
                !sidebarCollapsed && (
                  <div className="submenu-panel ml-2 mt-1 space-y-1 px-1">

                    <SubMenuItem
                      href="/admin/pages"
                      icon="list"
                      label="All Pages"
                      active={
                        pathname ===
                        "/admin/pages"
                      }
                      onNavigate={() =>
                        keepMenuOpen(
                          "pages"
                        )
                      }
                    />

                    <SubMenuItem
                      href="/admin/pages/new"
                      icon="plus"
                      label="Add New"
                      active={
                        pathname ===
                        "/admin/pages/new"
                      }
                      onNavigate={() =>
                        keepMenuOpen(
                          "pages"
                        )
                      }
                    />

                  </div>
                )}
            </div>

            {/* =================================================
                POSTS
            ================================================== */}

            <div className="mb-1">
              <NavItem
                href="/admin/posts"
                icon="posts"
                label="Posts"
                onMainClick={
                  closeDropdownOnMainClick
                }
                collapsed={
                  sidebarCollapsed
                }
                active={
                  isPostsSection
                }
                hasSubmenu
                submenuOpen={
                  postsOpen
                }
                onArrowClick={() =>
                  toggleMenu("posts")
                }
              />

              {postsOpen &&
                !sidebarCollapsed && (
                  <div className="submenu-panel ml-2 mt-1 space-y-1 px-1">

                    <SubMenuItem
                      href="/admin/posts"
                      icon="list"
                      label="All Posts"
                      active={
                        pathname ===
                        "/admin/posts"
                      }
                      onNavigate={() =>
                        keepMenuOpen(
                          "posts"
                        )
                      }
                    />

                    <SubMenuItem
                      href="/admin/posts/new"
                      icon="plus"
                      label="Add New"
                      active={
                        pathname ===
                        "/admin/posts/new"
                      }
                      onNavigate={() =>
                        keepMenuOpen(
                          "posts"
                        )
                      }
                    />

                    <SubMenuItem
                      href="/admin/posts/categories"
                      icon="category"
                      label="Categories"
                      active={pathname.startsWith(
                        "/admin/posts/categories"
                      )}
                      onNavigate={() =>
                        keepMenuOpen(
                          "posts"
                        )
                      }
                    />

                    <SubMenuItem
                      href="/admin/posts/tags"
                      icon="tag"
                      label="Tags"
                      active={pathname.startsWith(
                        "/admin/posts/tags"
                      )}
                      onNavigate={() =>
                        keepMenuOpen(
                          "posts"
                        )
                      }
                    />

                  </div>
                )}
            </div>

            {/* MEDIA */}

            <div className="mb-1">
              <NavItem
                href="/admin/media"
                icon="media"
                label="Media"
                onMainClick={
                  closeDropdownOnMainClick
                }
                collapsed={
                  sidebarCollapsed
                }
                active={
                  pathname ===
                    "/admin/media" ||
                  pathname.startsWith(
                    "/admin/media/"
                  )
                }
              />
            </div>

            {/* =================================================
                MENUS
            ================================================== */}

            <div className="mb-1">
              <NavItem
                href="/admin/menus"
                icon="menus"
                label="Menus"
                onMainClick={
                  closeDropdownOnMainClick
                }
                collapsed={
                  sidebarCollapsed
                }
                active={
                  isMenusSection
                }
                hasSubmenu
                submenuOpen={
                  menusOpen
                }
                onArrowClick={() =>
                  toggleMenu("menus")
                }
              />

              {menusOpen &&
                !sidebarCollapsed && (
                  <div className="submenu-panel ml-2 mt-1 space-y-1 px-1">

                    <SubMenuItem
                      href="/admin/menus"
                      icon="list"
                      label="All Menus"
                      active={
                        pathname ===
                        "/admin/menus"
                      }
                      onNavigate={() =>
                        keepMenuOpen(
                          "menus"
                        )
                      }
                    />

                    <SubMenuItem
                      href="/admin/menus/new"
                      icon="plus"
                      label="Add New"
                      active={
                        pathname ===
                        "/admin/menus/new"
                      }
                      onNavigate={() =>
                        keepMenuOpen(
                          "menus"
                        )
                      }
                    />

                  </div>
                )}
            </div>

            {/* COMPONENTS */}

            <div className="mb-1">
              <NavItem
                href="/admin/components"
                icon="components"
                label="Components"
                onMainClick={
                  closeDropdownOnMainClick
                }
                collapsed={
                  sidebarCollapsed
                }
                active={
                  pathname ===
                    "/admin/components" ||
                  pathname.startsWith(
                    "/admin/components/"
                  )
                }
              />
            </div>

            {/* SETTINGS */}

            <div className="mb-1">
              <NavItem
                href="/admin/settings"
                icon="settings"
                label="Settings"
                onMainClick={
                  closeDropdownOnMainClick
                }
                collapsed={
                  sidebarCollapsed
                }
                active={
                  pathname ===
                    "/admin/settings" ||
                  pathname.startsWith(
                    "/admin/settings/"
                  )
                }
              />
            </div>

          </nav>

          {/* =================================================
              SIDEBAR FOOTER
          ================================================== */}

          <div className="shrink-0 border-t border-slate-800 px-3 py-3">
            {!sidebarCollapsed ? (
              <div className="rounded-lg bg-slate-900 px-3 py-2">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  CMS
                </div>

                <div className="mt-0.5 text-[11px] text-slate-400">
                  Admin Panel
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-[10px] font-bold text-slate-500">
                  CMS
                </div>
              </div>
            )}
          </div>

        </aside>

        {/* =================================================
            MAIN CONTENT
        ================================================== */}

        <div className="flex min-w-0 flex-1 flex-col">

          {/* TOP HEADER */}

          <header className="sticky top-0 z-30 flex h-[64px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-7">

            <div>
              <h2 className="text-[15px] font-semibold text-slate-800">
                Admin Panel
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-400">
                Manage your website
              </p>
            </div>

            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">
                <div className="text-[12px] font-semibold text-slate-700">
                  Admin
                </div>

                <div className="text-[10px] text-slate-400">
                  Administrator
                </div>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                A
              </div>

            </div>

          </header>

          {/* PAGE CONTENT */}

          <main className="min-w-0 flex-1 p-5 lg:p-7">
            {children}
          </main>

        </div>

      </div>

      {/* =====================================================
          GLOBAL SIDEBAR STYLES
      ====================================================== */}

      <style jsx global>{`
        .sidebar-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .sidebar-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .submenu-panel {
          animation: submenuOpen 180ms ease-out both;
          transform-origin: top center;
        }

        @keyframes submenuOpen {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
}
