"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./logo";
import Container from "./ui/Container";

type MenuPage = {
    id?: number;
    title?: string;
    slug?: string;
    url?: string;
};

type MenuItem = {
    id: number;
    title: string;
    subtitle?: string | null;
    url?: string | null;
    pageId?: number | null;
    parentId?: number | null;
    sortOrder?: number;
    status?: string;
    megaMenu?: boolean;
    page?: MenuPage | null;
    children?: MenuItem[];
};

type Menu = {
    id: number;
    name: string;
    location?: string | null;
    items: MenuItem[];
};

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileDropdown, setMobileDropdown] = useState<number | null>(null);

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function loadMenus() {
            try {
                const response = await fetch("/api/menus", {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch menus");
                }

                const menus: Menu[] = await response.json();

                /*
                 * Prefer the menu whose location is "header".
                 * If no header menu exists, use the first menu.
                 */
                const headerMenu =
                    menus.find(
                        (menu) =>
                            menu.location?.toLowerCase() === "header"
                    ) || menus[0];

                if (mounted) {
                    setMenuItems(headerMenu?.items || []);
                }
            } catch (error) {
                console.error("NAVBAR MENU ERROR:", error);

                if (mounted) {
                    setMenuItems([]);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadMenus();

        return () => {
            mounted = false;
        };
    }, []);

    const closeMobileMenu = () => {
        setMobileOpen(false);
        setMobileDropdown(null);
    };

    const toggleMobileDropdown = (id: number) => {
        setMobileDropdown((current) =>
            current === id ? null : id
        );
    };

    /*
     * Only top-level menu items.
     */
    const mainItems = menuItems
        .filter(
            (item) =>
                item.parentId === null ||
                item.parentId === undefined
        )
        .sort(
            (a, b) =>
                (a.sortOrder || 0) -
                (b.sortOrder || 0)
        );

    /*
     * Find children.
     *
     * We support both:
     * 1. children returned by API
     * 2. parentId based children
     */
    const getChildren = (parent: MenuItem) => {
        const nestedChildren = parent.children || [];

        const parentIdChildren = menuItems.filter(
            (item) => item.parentId === parent.id
        );

        const combined = [
            ...nestedChildren,
            ...parentIdChildren,
        ];

        const unique = Array.from(
            new Map(
                combined.map((item) => [
                    item.id,
                    item,
                ])
            ).values()
        );

        return unique.sort(
            (a, b) =>
                (a.sortOrder || 0) -
                (b.sortOrder || 0)
        );
    };

    const getHref = (item: MenuItem) => {
        if (item.url?.trim()) {
            return item.url.trim();
        }

        if (item.page?.url?.trim()) {
            return item.page.url.trim();
        }

        if (item.page?.slug?.trim()) {
            const slug = item.page.slug.trim();

            return slug.startsWith("/")
                ? slug
                : `/${slug}`;
        }

        return "#";
    };

    /*
     * Existing navbar has special mega-menu designs
     * for these three menu names.
     *
     * Any other menu will use the generic mega menu.
     */
    const getMenuType = (
        title: string
    ):
        | "integrations"
        | "services"
        | "company"
        | "default" => {
        const value = title
            .trim()
            .toLowerCase();

        if (value === "integrations") {
            return "integrations";
        }

        if (value === "services") {
            return "services";
        }

        if (value === "company") {
            return "company";
        }

        return "default";
    };

    return (
        <header className="relative z-50 bg-white">
            <Container>

                <nav className="flex min-h-[85px] items-center">

                    {/* =====================================================
                        LOGO
                    ===================================================== */}

                    <Logo />

                    {/* =====================================================
                        DESKTOP NAV
                        1021px+
                    ===================================================== */}

                    <div className="ml-auto hidden min-w-0 items-center justify-end gap-4 min-[1021px]:flex lg:gap-5 xl:gap-6 lg:pl-10 xl:pl-14">

                        {/* =================================================
                            DYNAMIC MENU
                        ================================================= */}

                        {!loading &&
                            mainItems.map((item) => {
                                const children =
                                    getChildren(item);

                                /*
                                 * No children = normal link
                                 */
                                if (children.length === 0) {
                                    return (
                                        <Link
                                            key={item.id}
                                            href={getHref(item)}
                                            className="group relative flex shrink-0 items-center py-4 text-[14px] font-semibold text-gray-600 transition-colors duration-200 hover:text-primary"
                                        >
                                            {item.title}

                                            <span className="absolute bottom-0 left-1/2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 group-hover:w-8" />
                                        </Link>
                                    );
                                }

                                /*
                                 * Has children = dropdown / mega menu
                                 */
                                return (
                                    <MegaMenu
                                        key={item.id}
                                        item={item}
                                        items={children}
                                        type={getMenuType(
                                            item.title
                                        )}
                                        getHref={getHref}
                                    />
                                );
                            })}

                        {/* =================================================
                            PRICING
                        ================================================= */}

                        <Link
                            href="#pricing"
                            className="group flex h-[40px] shrink-0 items-center gap-2.5 rounded-full border border-[#a9c0f5] bg-white px-4 text-[14px] font-bold text-primary shadow-sm transition-all duration-200 hover:border-primary hover:bg-[#f5f8ff] lg:px-3"
                        >
                            <span className="group/dot relative flex h-4 w-4 shrink-0 items-center justify-center transition-transform duration-200 group-hover/dot:scale-110">
                                <span className="animate-signal-wave absolute h-3 w-3 rounded-full border border-[#0530ad]" />

                                <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-primary" />
                            </span>

                            <span>
                                PRICING
                            </span>

                            <span className="flex items-center gap-1">
                                <span className="rounded-lg bg-primary px-2 py-1 text-[9px] font-bold leading-none text-white transition-transform duration-200 group-hover:scale-105">
                                    HOT
                                </span>

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-primary"
                                >
                                    <path d="M12 2v20" />
                                    <path d="m17 5-5-3-5 3" />
                                    <path d="m17 19-5 3-5-3" />
                                </svg>
                            </span>
                        </Link>

                        {/* =================================================
                            LIVE DEMO
                        ================================================= */}

                        <Link
                            href="/demo"
                            className="group flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-full border border-[#c4d8ff] bg-[#f0f5ff] px-4 text-[14px] font-bold text-primary shadow-sm transition-all duration-300 hover:border-primary hover:bg-[#e7efff] hover:shadow-md lg:gap-3 lg:px-5"
                        >
                            <span className="group/dot relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d9e6ff] transition-transform duration-200 group-hover/dot:scale-105">
                                <span className="animate-signal-wave absolute h-4 w-4 rounded-full border border-[#0530ad]" />

                                <span className="relative z-10 h-3.5 w-3.5 rounded-full bg-primary shadow-[0_0_12px_rgba(5,48,173,0.35)]" />
                            </span>

                            <span className="whitespace-nowrap">
                                Visit Your Live Travel Agency Demo
                            </span>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                            >
                                <path d="M5 12h14" />
                                <path d="m13 6 6 6-6 6" />
                            </svg>
                        </Link>
                    </div>

                    {/* =====================================================
                        MOBILE / TABLET
                    ===================================================== */}

                    <div className="ml-auto flex items-center gap-3 min-[1021px]:hidden">

                        <Link
                            href="/demo"
                            className="hidden min-[641px]:flex h-[52px] items-center justify-center gap-2 rounded-full border border-[#c4d8ff] bg-[#f0f5ff] px-4 text-[13px] font-bold text-primary shadow-sm transition-all duration-300 hover:border-primary hover:bg-[#e7efff] hover:shadow-md sm:px-5"
                        >
                            <span className="whitespace-nowrap">
                                Visit Your Live Travel Agency Demo
                            </span>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14" />
                                <path d="m13 6 6 6-6 6" />
                            </svg>
                        </Link>

                        <button
                            type="button"
                            aria-label={
                                mobileOpen
                                    ? "Close navigation menu"
                                    : "Open navigation menu"
                            }
                            aria-expanded={mobileOpen}
                            onClick={() => {
                                setMobileOpen(
                                    (value) => !value
                                );

                                if (mobileOpen) {
                                    setMobileDropdown(null);
                                }
                            }}
                            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-[#e1e6ef] bg-white text-[#374151] shadow-sm transition-all duration-200 hover:border-[#b9cdfc] hover:text-[#0530ad]"
                        >
                            {mobileOpen ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            ) : (
                                <span className="flex flex-col gap-[5px]">
                                    <span className="h-[2px] w-5 rounded-full bg-current" />
                                    <span className="h-[2px] w-5 rounded-full bg-current" />
                                    <span className="h-[2px] w-5 rounded-full bg-current" />
                                </span>
                            )}
                        </button>
                    </div>
                </nav>
            </Container>

            {/* =========================================================
                MOBILE MENU
            ========================================================= */}

            <div
                className={`absolute left-0 right-0 top-full z-[60] min-[641px]:top-[calc(100%+48px)] min-[1021px]:hidden ${
                    mobileOpen
                        ? "visible opacity-100"
                        : "invisible opacity-0 pointer-events-none"
                }`}
            >
                <Container>

                    <div className="w-full overflow-hidden rounded-b-[24px] border border-t-0 border-[#edf0f5] bg-white shadow-[0_20px_45px_rgba(15,35,80,0.15)]">

                        <div className="py-4 px-lg-5">

                            {/* HOME */}

                            <Link
                                href="/"
                                onClick={
                                    closeMobileMenu
                                }
                                className="flex h-[52px] items-center border-b border-[#edf0f5] text-[16px] font-bold text-[#202634] transition-colors hover:text-[#0530ad]"
                            >
                                Home
                            </Link>

                            {/* DYNAMIC MENU */}

                            {!loading &&
                                mainItems.map(
                                    (item) => {
                                        const children =
                                            getChildren(
                                                item
                                            );

                                        /*
                                         * Normal link
                                         */
                                        if (
                                            children.length ===
                                            0
                                        ) {
                                            return (
                                                <Link
                                                    key={
                                                        item.id
                                                    }
                                                    href={getHref(
                                                        item
                                                    )}
                                                    onClick={
                                                        closeMobileMenu
                                                    }
                                                    className="flex h-[54px] w-full items-center border-b border-[#edf0f5] text-[16px] font-bold text-[#202634] transition-colors hover:text-[#0530ad]"
                                                >
                                                    {
                                                        item.title
                                                    }
                                                </Link>
                                            );
                                        }

                                        /*
                                         * Dropdown
                                         */
                                        return (
                                            <div
                                                key={
                                                    item.id
                                                }
                                            >
                                                <MobileMenuItem
                                                    label={
                                                        item.title
                                                    }
                                                    open={
                                                        mobileDropdown ===
                                                        item.id
                                                    }
                                                    onClick={() =>
                                                        toggleMobileDropdown(
                                                            item.id
                                                        )
                                                    }
                                                />

                                                {mobileDropdown ===
                                                    item.id && (
                                                    <MobileSubMenu
                                                        items={
                                                            children
                                                        }
                                                        getHref={
                                                            getHref
                                                        }
                                                    />
                                                )}
                                            </div>
                                        );
                                    }
                                )}

                            {/* PRICING */}

                            <Link
                                href="/pricing"
                                onClick={
                                    closeMobileMenu
                                }
                                className="mt-4 flex h-[40px] items-center justify-between rounded-full border border-[#a9c0f5] bg-white px-4 text-[14px] font-bold text-primary shadow-sm transition-all duration-200 hover:border-primary hover:bg-[#f5f8ff]"
                            >
                                <span className="flex items-center gap-2.5">
                                    <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                                        <span className="animate-signal-wave absolute h-3 w-3 rounded-full border border-[#0530ad]" />

                                        <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-primary" />
                                    </span>

                                    PRICING
                                </span>

                                <span className="flex items-center gap-1">
                                    <span className="rounded-lg bg-primary px-2 py-1 text-[9px] font-bold leading-none text-white">
                                        HOT
                                    </span>

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="13"
                                        height="13"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-primary"
                                    >
                                        <path d="M12 2v20" />
                                        <path d="m17 5-5-3-5 3" />
                                        <path d="m17 19-5 3-5-3" />
                                    </svg>
                                </span>
                            </Link>

                            {/* LIVE DEMO */}

                            <Link
                                href="/demo"
                                onClick={
                                    closeMobileMenu
                                }
                                className="group mt-3 flex h-[52px] items-center justify-center gap-3 rounded-full bg-[#0530ad] px-5 text-[14px] font-bold text-white shadow-[0_8px_20px_rgba(5,48,173,0.20)] transition-all duration-300 hover:bg-[#073dcc]"
                            >
                                <span>
                                    Live Demo
                                </span>

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                >
                                    <path d="M5 12h14" />
                                    <path d="m13 6 6 6-6 6" />
                                </svg>
                            </Link>

                        </div>
                    </div>

                </Container>
            </div>

            {/* SIGNAL ANIMATION */}

            <style jsx global>{`
                @keyframes signalWave {
                    0% {
                        transform: scale(0.6);
                        opacity: 0.95;
                    }

                    70% {
                        transform: scale(1.9);
                        opacity: 0;
                    }

                    100% {
                        transform: scale(1.9);
                        opacity: 0;
                    }
                }

                .animate-signal-wave {
                    animation: signalWave 0.65s linear infinite;
                }
            `}</style>
        </header>
    );
}


/* =========================================================
   MEGA MENU
========================================================= */

function MegaMenu({
    item,
    items,
    type,
    getHref,
}: {
    item: MenuItem;
    items: MenuItem[];
    type:
        | "integrations"
        | "services"
        | "company"
        | "default";
    getHref: (item: MenuItem) => string;
}) {
    return (
        <div className="group relative shrink-0">

            {/* BUTTON */}

            <Link
                href={
                    getHref(item) === "#"
                        ? "#"
                        : getHref(item)
                }
                onClick={(event) => {
                    /*
                     * If the parent only acts as a dropdown,
                     * don't navigate.
                     */
                    if (getHref(item) === "#") {
                        event.preventDefault();
                    }
                }}
                className={`relative flex items-center gap-1.5 py-4 text-[14px] font-semibold text-gray-600 transition-all duration-200 group-hover:text-primary ${
                    type === "services" ||
                    type === "company"
                        ? "group-hover:scale-[1.05]"
                        : ""
                }`}
            >
                {item.title}

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:rotate-180"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>

                <span className="absolute bottom-0 left-1/2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 group-hover:w-8" />
            </Link>

            {/* =====================================================
                INTEGRATIONS
            ===================================================== */}

            {type === "integrations" && (
                <div className="invisible absolute left-[250px] top-[calc(100%+10px)] z-50 w-[1080px] max-w-[calc(100vw-32px)] -translate-x-1/2 translate-y-2 overflow-hidden rounded-[28px] border border-[#e9edf5] bg-white opacity-0 shadow-[0_24px_60px_rgba(15,35,80,0.20)] transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">

                    <div className="grid grid-cols-[1.7fr_0.9fr] gap-3 bg-white ps-3">

                        <div className="px-6 py-5">

                            <div className="grid grid-cols-3 auto-rows-[72px] gap-3">

                                {items.map(
                                    (child) => (
                                        <DropdownCard
                                            key={
                                                child.id
                                            }
                                            item={
                                                child
                                            }
                                            type="integrations"
                                            getHref={
                                                getHref
                                            }
                                        />
                                    )
                                )}

                            </div>
                        </div>

                        <MegaPromo type="integrations" />
                    </div>
                </div>
            )}

            {/* =====================================================
                SERVICES
            ===================================================== */}

            {type === "services" && (
                <div className="invisible absolute left-[180px] top-[calc(100%+10px)] z-50 w-[930px] max-w-[calc(100vw-32px)] -translate-x-1/2 translate-y-2 overflow-hidden rounded-[28px] border border-[#e9edf5] bg-white opacity-0 shadow-[0_24px_60px_rgba(15,35,80,0.20)] transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">

                    <div className="grid grid-cols-[1.45fr_0.85fr] gap-3 bg-white ps-3">

                        <div className="px-6 py-6">

                            <div className="grid grid-cols-2 gap-x-10 gap-y-1">

                                {items.map(
                                    (child) => (
                                        <DropdownCard
                                            key={
                                                child.id
                                            }
                                            item={
                                                child
                                            }
                                            type="services"
                                            getHref={
                                                getHref
                                            }
                                        />
                                    )
                                )}

                            </div>
                        </div>

                        <MegaPromo type="services" />
                    </div>
                </div>
            )}

            {/* =====================================================
                COMPANY
            ===================================================== */}

            {type === "company" && (
                <div className="invisible absolute left-1/2 top-[calc(100%+10px)] z-50 w-[700px] max-w-[calc(100vw-32px)] -translate-x-1/2 translate-y-2 overflow-hidden rounded-[28px] border border-[#e9edf5] bg-white opacity-0 shadow-[0_24px_60px_rgba(15,35,80,0.20)] transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">

                    <div className="grid grid-cols-2 gap-0 bg-white ps-3">

                        <div className="px-6 py-6">

                            <div className="grid grid-cols-1 gap-y-0.5">

                                {items.map(
                                    (child) => (
                                        <DropdownCard
                                            key={
                                                child.id
                                            }
                                            item={
                                                child
                                            }
                                            type="company"
                                            getHref={
                                                getHref
                                            }
                                        />
                                    )
                                )}

                            </div>
                        </div>

                        <MegaPromo type="company" />
                    </div>
                </div>
            )}

            {/* =====================================================
                DEFAULT DYNAMIC MENU
            ===================================================== */}

            {type === "default" && (
                <div className="invisible absolute left-1/2 top-[calc(100%+10px)] z-50 w-[700px] max-w-[calc(100vw-32px)] -translate-x-1/2 translate-y-2 overflow-hidden rounded-[28px] border border-[#e9edf5] bg-white opacity-0 shadow-[0_24px_60px_rgba(15,35,80,0.20)] transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">

                    <div className="grid grid-cols-2 gap-0 bg-white">

                        {items.map(
                            (child) => (
                                <DropdownCard
                                    key={child.id}
                                    item={child}
                                    type="company"
                                    getHref={
                                        getHref
                                    }
                                />
                            )
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}


/* =========================================================
   DROPDOWN CARD
========================================================= */

function DropdownCard({
    item,
    type,
    getHref,
}: {
    item: MenuItem;
    type:
        | "integrations"
        | "services"
        | "company";
    getHref: (item: MenuItem) => string;
}) {
    const href = getHref(item);

    if (
        type === "services" ||
        type === "company"
    ) {
        return (
            <Link
                href={href}
                className="group/card flex h-[50px] items-center justify-between px-3 text-[13px] font-bold text-[#202634] transition-all duration-200 hover:text-primary"
            >
                <span>
                    {item.title}
                </span>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-[#9aa3b2] transition-all duration-200 group-hover/card:translate-x-1 group-hover/card:text-primary"
                >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                </svg>
            </Link>
        );
    }

    return (
        <Link
            href={href}
            className="group/card flex min-h-[72px] items-center gap-4 rounded-2xl border border-[#edf0f5] bg-white px-4 transition-all duration-200 hover:border-[#dce6ff] hover:bg-[#fbfcff] hover:shadow-sm"
        >
            <span className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl bg-[#eef5ff] text-primary transition-all duration-200 group-hover/card:scale-105 group-hover/card:bg-primary group-hover/card:text-white">

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                </svg>

            </span>

            <span className="min-w-0">
                <span className="block text-[17px] font-bold leading-5 text-[#202634] transition-colors duration-200 group-hover/card:text-primary">
                    {item.title}
                </span>

                {item.subtitle && (
                    <span className="mt-1 block text-[11px] font-medium text-gray-400">
                        {item.subtitle}
                    </span>
                )}
            </span>
        </Link>
    );
}


/* =========================================================
   RIGHT BLUE PROMO
========================================================= */

function MegaPromo({
    type,
}: {
    type:
        | "integrations"
        | "services"
        | "company";
}) {
    const content = {
        integrations: {
            label: "API INTEGRATIONS",
            title: (
                <>
                    Connect Your Own
                    <br />
                    Travel Suppliers
                </>
            ),
            description:
                "Already have supplier credentials? We can connect them with your Travels OTA platform.",
        },

        services: {
            label: "FROM CONCEPT TO CODE",
            title: (
                <>
                    We Build What
                    <br />
                    You Imagine.
                </>
            ),
            description:
                "Turning complex technical ideas into reliable, scalable digital software and platforms.",
        },

        company: {
            label: "TRAVELS OTA",
            title: (
                <>
                    Let&apos;s Build
                    <br />
                    Something Great
                </>
            ),
            description:
                "Learn more about Travels OTA and how we help travel businesses grow.",
        },
    };

    const current = content[type];

    return (
        <div className="relative min-h-[365px] overflow-hidden rounded-tr-[28px] rounded-br-[28px] bg-[#0d42c7] px-9 py-8 text-white shadow-[0_10px_30px_rgba(5,48,173,0.20)]">

            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full border-[34px] border-white/[0.06]" />

            <div className="absolute -right-8 top-6 h-40 w-40 rounded-full border-[26px] border-white/[0.05]" />

            <div className="relative z-10 flex h-full flex-col">

                <div className="mb-5 flex h-[55px] w-[55px] rotate-[8deg] items-center justify-center rounded-2xl bg-white/10">

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="31"
                        height="31"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="-rotate-[6deg]"
                    >
                        <path d="m8 12 3-3 5 5-3 3" />
                        <path d="m13 7 1.5-1.5a3.5 3.5 0 0 1 5 5L18 12" />
                        <path d="m11 17-1.5 1.5a3.5 3.5 0 0 1-5-5L6 12" />
                    </svg>

                </div>

                <span className="mb-3 inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-blue-100">
                    {current.label}
                </span>

                <h3 className="text-[30px] font-extrabold leading-[1.3] tracking-[-0.035em]">
                    {current.title}
                </h3>

                <p className="mt-5 max-w-[430px] text-[12px] font-medium leading-[1] text-blue-100">
                    {current.description}
                </p>

                <Link
                    href="/contact"
                    className="group/cta mt-5 flex min-h-[50px] items-center justify-between rounded-2xl bg-white px-6 py-3 text-[15px] font-bold text-[#0d3da8] shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(0,0,0,0.16)]"
                >
                    <span>
                        Get Free Consultation
                    </span>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform duration-300 group-hover/cta:translate-x-1"
                    >
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}


/* =========================================================
   MOBILE MENU ITEM
========================================================= */

function MobileMenuItem({
    label,
    open,
    onClick,
}: {
    label: string;
    open: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-[54px] w-full items-center justify-between border-b border-[#edf0f5] text-left text-[16px] font-bold text-[#202634] transition-colors hover:text-[#0530ad]"
        >
            <span>
                {label}
            </span>

            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${
                    open
                        ? "rotate-180 text-[#0530ad]"
                        : ""
                }`}
            >
                <path d="m6 9 6 6 6-6" />
            </svg>
        </button>
    );
}


/* =========================================================
   MOBILE SUB MENU
========================================================= */

function MobileSubMenu({
    items,
    getHref,
}: {
    items: MenuItem[];
    getHref: (item: MenuItem) => string;
}) {
    return (
        <div className="border-b border-[#edf0f5] bg-[#fafcff] px-3 py-1">

            {items.map((item) => (
                <Link
                    key={item.id}
                    href={getHref(item)}
                    className="flex min-h-[48px] items-center justify-between border-b border-[#edf0f5] last:border-b-0"
                >
                    <span className="text-[14px] font-bold text-[#202634]">
                        {item.title}
                    </span>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0 text-[#9aa3b2]"
                    >
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                    </svg>
                </Link>
            ))}

        </div>
    );
}