"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { useEffect, useState, type ReactNode } from "react";

type MenuKey = "pages" | "posts" | "menus" | null;

/* =========================================================

   ICONS

\========================================================= */

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

          <path d="m9 6 6 6-6 6" />

        </svg>

      );

    default:

      return null;

  }

}

/* =========================================================

   MAIN NAV ITEM

\========================================================= */

function NavItem({

  href,

  icon,

  label,

  active = false,

  hasDropdown = false,

  open = false,

  collapsed = false,

  onArrowClick,

  onMainClick,

  onHoverEnter,

  onHoverLeave,

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

  hasDropdown?: boolean;

  open?: boolean;

  collapsed?: boolean;

  onArrowClick?: () => void;

  onMainClick?: () => void;

  onHoverEnter?: () => void;

  onHoverLeave?: () => void;

}) {

  return (

    <div

      onMouseEnter={onHoverEnter}

      onMouseLeave={onHoverLeave}

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

          collapsed

            ? "justify-center px-0"

            : "gap-3 px-3"

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



      {hasDropdown && !collapsed && (

        <button

          type="button"

          onClick={(e) => {

            e.preventDefault();

            e.stopPropagation();

            onArrowClick?.();

          }}

          className={`flex h-10 w-9 shrink-0 items-center justify-center rounded-r-lg transition-all duration-200 ${

            active

              ? "text-white hover:bg-blue-700"

              : "text-slate-500 hover:bg-slate-800 hover:text-blue-400"

          }`}

          aria-label={`${label} submenu`}

        >

          <span

            className={`transition-transform duration-200 ${

              open ? "rotate-90 text-blue-300" : ""

            }`}

          >

            <Icon name="chevron" size={14} />

          </span>

        </button>

      )}



      {collapsed && (

        <div

          className="

            pointer-events-none

            absolute

            left-[58px]

            top-1/2

            z-50

            -translate-y-1/2

            translate-x-1

            whitespace-nowrap

            rounded-md

            border

            border-slate-700

            bg-slate-800

            px-3

            py-1.5

            text-[11px]

            font-medium

            text-white

            opacity-0

            shadow-xl

            transition-all

            duration-150

            group-hover:translate-x-0

            group-hover:opacity-100

          "

        >

          {label}

          <span

            className="

              absolute

              left-[-4px]

              top-1/2

              h-2

              w-2

              -translate-y-1/2

              rotate-45

              border-l

              border-b

              border-slate-700

              bg-slate-800

            "

          />

        </div>

      )}

    </div>

  );

}

/* =========================================================

   SUB MENU ITEM

\========================================================= */

function SubMenuItem({

  href,

  icon,

  label,

  active = false,

  onClick,

}: {

  href: string;

  icon: "plus" | "list" | "category" | "tag";

  label: string;

  active?: boolean;

  onClick?: () => void;

}) {

  return (

    <Link

      href={href}

      onClick={onClick}

      className={`submenu-item group relative ml-5 flex h-8 items-center rounded-md transition-all duration-200 ${

        active

          ? "bg-blue-500/10 font-medium text-blue-400"

          : "text-slate-400 hover:bg-slate-900/80 hover:text-blue-400"

      }`}

    >

      {/* Submenu tree indicator */}

      <span

        className={`absolute left-[7px] top-0 h-full w-px transition-colors duration-200 ${

          active

            ? "bg-blue-500/60"

            : "bg-slate-800 group-hover:bg-blue-500/40"

        }`}

      />



      <span

        className={`absolute left-[7px] top-1/2 h-px w-[7px] transition-colors duration-200 ${

          active

            ? "bg-blue-500/60"

            : "bg-slate-800 group-hover:bg-blue-500/40"

        }`}

      />



      {/* Same icon column as main menu */}

      <span className="relative z-10 ml-2 flex h-5 w-5 shrink-0 items-center justify-center">

        <span

          className={`flex h-6 w-6 items-center justify-center rounded-md transition-all duration-200 ${

            active

              ? "bg-blue-500/15 text-blue-400"

              : "text-slate-500 group-hover:bg-slate-800 group-hover:text-blue-400"

          }`}

        >

          <Icon name={icon} size={14} />

        </span>

      </span>



      <span className="ml-3 truncate text-[12px]">

        {label}

      </span>



      {/* Small submenu marker */}

      <span

        className={`ml-auto mr-2 h-1.5 w-1.5 rounded-full transition-all duration-200 ${

          active

            ? "bg-blue-400"

            : "bg-slate-700 opacity-0 group-hover:opacity-100"

        }`}

      />

    </Link>

  );

}

/* =========================================================

   ADMIN LAYOUT

\========================================================= */

export default function AdminLayout({

  children,

}: {

  children: ReactNode;

}) {

  const pathname = usePathname();

// useEffect(() => {

//   if (pathname === "/admin" || pathname === "/admin/") {

//     document.title = "Dashboard";

//   } 

//   else if (pathname === "/admin/pages") {

//     document.title = "Pages";

//   } 

//   else if (pathname === "/admin/pages/new") {

//     document.title = "Add New Page";

//   } 

//   else if (pathname.startsWith("/admin/pages/")) {

//     document.title = "Edit Page";

//   } 

//   else if (pathname === "/admin/posts") {

//     document.title = "Posts";

//   } 

//   else if (pathname.startsWith("/admin/posts/new")) {

//     document.title = "Add New Post";

//   } 

//   else if (pathname.startsWith("/admin/posts/categories")) {

//     document.title = "Categories";

//   } 

//   else if (pathname.startsWith("/admin/posts/tags")) {

//     document.title = "Tags";

//   } 

//   else if (pathname.startsWith("/admin/media")) {

//     document.title = "Media";

//   } 

//   else if (pathname === "/admin/menus") {

//     document.title = "Menus";

//   } 

//   else if (pathname.startsWith("/admin/menus/new")) {

//     document.title = "Add New Menu";

//   } 

//   else if (pathname.startsWith("/admin/components")) {

//     document.title = "Components";

//   } 

//   else if (pathname.startsWith("/admin/settings")) {

//     document.title = "Settings";

//   } 

//   else {

//     document.title = "Admin";

//   }

// }, [pathname]);

  /* =======================================================

     EDIT PAGE DETECTION

  ======================================================== */  const isEditPage =
    /^\/admin\/pages\/[^/]+\/edit\/?$/.test(pathname);

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

     DROPDOWN STATES

     openMenu = manually opened by arrow

     hoverMenu = opened because mouse is hovering

  ======================================================== */

  const [openMenu, setOpenMenu] =

    useState<MenuKey>(null);

  const [hoverMenu, setHoverMenu] =

    useState<MenuKey>(null);

  
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  // Keep sidebar collapse state when navigating between admin pages.
  useEffect(() => {
    const savedSidebarState =
      window.localStorage.getItem("cms-admin-sidebar-collapsed");

    if (savedSidebarState === "true") {
      setSidebarCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((current) => {
      const nextState = !current;

      window.localStorage.setItem(
        "cms-admin-sidebar-collapsed",
        String(nextState)
      );

      return nextState;
    });

    closeAllMenus();
  };
/* =======================================================

     FINAL DROPDOWN STATE

     Dropdown opens if:

     - arrow was clicked

     OR

     - mouse is hovering

     IMPORTANT:

     isPagesSection is NOT used here.

     Therefore clicking Pages itself will NOT open dropdown.

  ======================================================== */

  const pagesOpen =

    openMenu === "pages" ||

    hoverMenu === "pages";

  const postsOpen =

    openMenu === "posts" ||

    hoverMenu === "posts";

  const menusOpen =

    openMenu === "menus" ||

    hoverMenu === "menus";

  /* =======================================================

     ARROW TOGGLE

  ======================================================== */

  const toggleMenu = (

    menu: Exclude<MenuKey, null>

  ) => {

    setOpenMenu((current) =>

      current === menu ? null : menu

    );

  };

  /* =======================================================

     CLOSE ALL MENUS

  ======================================================== */

  const closeAllMenus = () => {

    setOpenMenu(null);

    setHoverMenu(null);

  };

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
            sidebarCollapsed ? "w-[68px]" : "w-[220px]"
          }`}
        >

          {/* =================================================

              LOGO

          ================================================== */}

          <div className="flex h-[64px] shrink-0 items-center border-b border-slate-800 px-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className={`group relative flex w-full items-center rounded-lg transition-all duration-300 hover:bg-slate-900 ${
                sidebarCollapsed ? "justify-center px-0" : "gap-2.5 px-1"
              }`}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-600/20">
                <span className="text-sm font-bold">C</span>
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

            {/* =================================================

                DASHBOARD

            ================================================== */}

            <div className="mb-1">

              <NavItem

                href="/admin"

                icon="dashboard"

                label="Dashboard"

                
                collapsed={sidebarCollapsed}

                active={isDashboard}

                onMainClick={closeAllMenus}

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

                
                collapsed={sidebarCollapsed}

                active={isPagesSection}

                hasDropdown

                open={pagesOpen}

                /*

                 * MAIN CLICK:

                 * Navigate to All Pages

                 * Close dropdown

                 */

                onMainClick={() => {

                  closeAllMenus();

                }}

                /*

                 * ARROW CLICK:

                 * Open / Close dropdown

                 */

                onArrowClick={() => {

                  setHoverMenu(null);

                  setOpenMenu((current) =>

                    current === "pages"

                      ? null

                      : "pages"

                  );

                }}

                /*

                 * HOVER:

                 * Open dropdown

                 */

                onHoverEnter={() => {

                  setHoverMenu("pages");

                }}

                /*

                 * MOUSE OUT:

                 * Hover dropdown closes

                 */

                onHoverLeave={() => {

                  setHoverMenu(null);

                }}

              />

              {/* PAGES DROPDOWN */}

              {pagesOpen && !sidebarCollapsed && (

                <div className="submenu-panel mt-1 space-y-0.5">

                  <SubMenuItem

                    href="/admin/pages"

                    icon="list"

                    label="All Pages"

                    active={

                      pathname === "/admin/pages"

                    }

                    onClick={closeAllMenus}

                  />

                  <SubMenuItem

                    href="/admin/pages/new"

                    icon="plus"

                    label="Add New"

                    active={

                      pathname ===

                      "/admin/pages/new"

                    }

                    onClick={closeAllMenus}

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

                
                collapsed={sidebarCollapsed}

                active={isPostsSection}

                hasDropdown

                open={postsOpen}

                /*

                 * MAIN CLICK

                 */

                onMainClick={() => {

                  closeAllMenus();

                }}

                /*

                 * ARROW CLICK

                 */

                onArrowClick={() => {

                  setHoverMenu(null);

                  setOpenMenu((current) =>

                    current === "posts"

                      ? null

                      : "posts"

                  );

                }}

                /*

                 * HOVER

                 */

                onHoverEnter={() => {

                  setHoverMenu("posts");

                }}

                /*

                 * MOUSE OUT

                 */

                onHoverLeave={() => {

                  setHoverMenu(null);

                }}

              />

              {/* POSTS DROPDOWN */}

              {postsOpen && !sidebarCollapsed && (

                <div className="submenu-panel mt-1 space-y-0.5">

                  <SubMenuItem

                    href="/admin/posts"

                    icon="list"

                    label="All Posts"

                    active={

                      pathname === "/admin/posts"

                    }

                    onClick={closeAllMenus}

                  />

                  <SubMenuItem

                    href="/admin/posts/new"

                    icon="plus"

                    label="Add New"

                    active={

                      pathname ===

                      "/admin/posts/new"

                    }

                    onClick={closeAllMenus}

                  />

                  <SubMenuItem

                    href="/admin/posts/categories"

                    icon="category"

                    label="Categories"

                    active={pathname.startsWith(

                      "/admin/posts/categories"

                    )}

                    onClick={closeAllMenus}

                  />

                  <SubMenuItem

                    href="/admin/posts/tags"

                    icon="tag"

                    label="Tags"

                    active={pathname.startsWith(

                      "/admin/posts/tags"

                    )}

                    onClick={closeAllMenus}

                  />

                </div>

              )}

            </div>

            {/* =================================================

                MEDIA

            ================================================== */}

            <div className="mb-1">

              <NavItem

                href="/admin/media"

                icon="media"

                label="Media"

                
                collapsed={sidebarCollapsed}

                active={

                  pathname === "/admin/media" ||

                  pathname.startsWith(

                    "/admin/media/"

                  )

                }

                onMainClick={closeAllMenus}

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

                
                collapsed={sidebarCollapsed}

                active={isMenusSection}

                hasDropdown

                open={menusOpen}

                /*

                 * MAIN CLICK

                 */

                onMainClick={() => {

                  closeAllMenus();

                }}

                /*

                 * ARROW CLICK

                 */

                onArrowClick={() => {

                  setHoverMenu(null);

                  setOpenMenu((current) =>

                    current === "menus"

                      ? null

                      : "menus"

                  );

                }}

                /*

                 * HOVER

                 */

                onHoverEnter={() => {

                  setHoverMenu("menus");

                }}

                /*

                 * MOUSE OUT

                 */

                onHoverLeave={() => {

                  setHoverMenu(null);

                }}

              />

              {/* MENUS DROPDOWN */}

              {menusOpen && !sidebarCollapsed && (

                <div className="submenu-panel mt-1 space-y-0.5">

                  <SubMenuItem

                    href="/admin/menus"

                    icon="list"

                    label="All Menus"

                    active={

                      pathname === "/admin/menus"

                    }

                    onClick={closeAllMenus}

                  />

                  <SubMenuItem

                    href="/admin/menus/new"

                    icon="plus"

                    label="Add New"

                    active={

                      pathname ===

                      "/admin/menus/new"

                    }

                    onClick={closeAllMenus}

                  />

                </div>

              )}

            </div>

            {/* =================================================

                COMPONENTS

            ================================================== */}

            <div className="mb-1">

              <NavItem

                href="/admin/components"

                icon="components"

                label="Components"

                
                collapsed={sidebarCollapsed}

                active={

                  pathname ===

                    "/admin/components" ||

                  pathname.startsWith(

                    "/admin/components/"

                  )

                }

                onMainClick={closeAllMenus}

              />

            </div>

            {/* =================================================

                SETTINGS

            ================================================== */}

            <div className="mb-1">

              <NavItem

                href="/admin/settings"

                icon="settings"

                label="Settings"

                
                collapsed={sidebarCollapsed}

                active={

                  pathname ===

                    "/admin/settings" ||

                  pathname.startsWith(

                    "/admin/settings/"

                  )

                }

                onMainClick={closeAllMenus}

              />

            </div>

          </nav>

          {/* =================================================

              SIDEBAR FOOTER

          ================================================== */}

          <div className="shrink-0 border-t border-slate-800 px-3 py-3">

            <div className="rounded-lg bg-slate-900 px-3 py-2">

              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">

                CMS

              </div>

              <div className="mt-0.5 text-[11px] text-slate-400">

                Admin Panel

              </div>

            </div>

          </div>

        </aside>

        {/* =================================================

            MAIN CONTENT AREA

        ================================================== */}

        <div className="flex min-w-0 flex-1 flex-col">

          {/* =================================================

              TOP HEADER

          ================================================== */}

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

          {/* =================================================

              PAGE CONTENT

          ================================================== */}

          <main className="min-w-0 flex-1 p-5 lg:p-7">

            {children}

          </main>

        </div>

      </div>

      {/* =====================================================

          HIDE SIDEBAR SCROLLBAR

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