"use client";

import Link from "next/link";
import Logo from "./logo";
import { useEffect, useRef, useState } from "react";

export default function Footer() {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const watermarkRef = useRef<HTMLDivElement>(null);
    const watermarkWrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const wrap = watermarkWrapRef.current;
        const watermark = watermarkRef.current;

        if (!wrap || !watermark) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = wrap.getBoundingClientRect();

            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            const rotateY = x * 14;
            const rotateX = -y * 14;

            watermark.style.transform =
                `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;

            watermark.style.filter =
                "drop-shadow(0 8px 16px rgba(0,0,0,0.25))";
        };

        const handleMouseLeave = () => {
            watermark.style.transform =
                "rotateX(0deg) rotateY(0deg) scale(1)";

            watermark.style.filter = "none";
        };

        wrap.addEventListener("mousemove", handleMouseMove);
        wrap.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            wrap.removeEventListener("mousemove", handleMouseMove);
            wrap.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer className="relative overflow-hidden bg-gradient-to-b from-[#1e3fd9] to-[#1531ad] text-white">

            <div className="mx-auto max-w-[1400px] px-6 pb-10 pt-16 sm:px-10">

                {/* ================= MAIN GRID ================= */}

                <div className="grid grid-cols-1 gap-[50px] min-[640px]:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.3fr] lg:items-start">

                    {/* ================= BRAND ================= */}

                    <div>

                        <Logo variant="light" />

                        <p className="mt-4 max-w-xs text-sm text-blue-100">
                            Powerful travel technology solutions built for
                            modern travel businesses, agencies, suppliers,
                            and partners.
                        </p>

                        {/* ================= SOCIAL ================= */}

                        <div className="mt-5 flex gap-3">

                            {/* LinkedIn */}

                            <a
                                href="#"
                                aria-label="LinkedIn"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#0A66C2]"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4 fill-current"
                                >
                                    <path d="M6.94 8.5H3.56V19h3.38V8.5ZM5.25 3A1.96 1.96 0 1 0 5.25 6.92 1.96 1.96 0 0 0 5.25 3ZM8.89 8.5H12.1v1.43h.05c.45-.85 1.54-1.74 3.17-1.74 3.39 0 4.01 2.23 4.01 5.13V19h-3.38v-5.03c0-1.2-.02-2.74-1.67-2.74-1.67 0-1.92 1.3-1.92 2.65V19H8.89V8.5Z" />
                                </svg>
                            </a>

                            {/* X */}

                            <a
                                href="#"
                                aria-label="X"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-black"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4 fill-current"
                                >
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.964 6.817H1.683l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                                </svg>
                            </a>

                            {/* Facebook */}

                            <a
                                href="#"
                                aria-label="Facebook"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#1877F2]"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4 fill-current"
                                >
                                    <path d="M13.5 21v-8h2.75l.41-3h-3.16V8.08c0-.87.24-1.46 1.49-1.46h1.59V3.94c-.28-.04-1.24-.12-2.36-.12-2.34 0-3.94 1.43-3.94 4.06V10H7.63v3h2.65v8h3.22Z" />
                                </svg>
                            </a>

                            {/* Instagram */}

                            <a
                                href="#"
                                aria-label="Instagram"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-tr hover:from-[#f58529] hover:via-[#dd2a7b] hover:to-[#8134af]"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4 fill-none stroke-current"
                                    strokeWidth="1.8"
                                >
                                    <rect
                                        x="3"
                                        y="3"
                                        width="18"
                                        height="18"
                                        rx="5"
                                    />
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="4"
                                    />
                                    <circle
                                        cx="17.5"
                                        cy="6.5"
                                        r="1"
                                        fill="currentColor"
                                        stroke="none"
                                    />
                                </svg>
                            </a>

                        </div>
                    </div>


                    {/* ================= COMPANY ================= */}

                    <div>

                        <h3 className="mb-5 text-lg font-extrabold tracking-wider">
                            Company
                        </h3>

                        <ul className="space-y-3 text-sm text-blue-100 uppercase">

                            <li>
                                <Link
                                    href="#"
                                    className="group relative inline-block text-sm transition-all duration-300 hover:translate-x-1 hover:text-white"
                                >
                                    About Us

                                    <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="#"
                                    className="group relative inline-block text-sm transition-all duration-300 hover:translate-x-1 hover:text-white"
                                >
                                    Blog

                                    <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="#"
                                    className="group relative inline-block text-sm transition-all duration-300 hover:translate-x-1 hover:text-white"
                                >
                                    Careers

                                    <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="#"
                                    className="group relative inline-block text-sm transition-all duration-300 hover:translate-x-1 hover:text-white"
                                >
                                    Partnerships

                                    <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
                                </Link>
                            </li>

                        </ul>

                    </div>


                    {/* ================= RESOURCES ================= */}

                    <div>

                        <h3 className="mb-5 text-lg font-extrabold tracking-wider">
                            Resources
                        </h3>

                        <ul className="space-y-3 text-sm text-blue-100 uppercase">

                            <li>
                                <Link
                                    href="#"
                                    className="group relative inline-block text-sm transition-all duration-300 hover:translate-x-1 hover:text-white"
                                >
                                    Coustomer support

                                    <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="#"
                                    className="group relative inline-block text-sm transition-all duration-300 hover:translate-x-1 hover:text-white"
                                >
                                    Services

                                    <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="#"
                                    className="group relative inline-block text-sm transition-all duration-300 hover:translate-x-1 hover:text-white"
                                >
                                    Corporate Sales

                                    <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="#"
                                    className="group relative inline-block text-sm transition-all duration-300 hover:translate-x-1 hover:text-white"
                                >
                                    Contact us

                                    <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
                                </Link>
                            </li>

                        </ul>

                    </div>


                    {/* ================= CONTACT ================= */}

                    <div>

                        <h3 className="mb-5 text-lg font-extrabold uppercase tracking-wider">
                            Contact us
                        </h3>

                        <ul className="space-y-4 text-sm">

                            {/* Email */}

                            <li className="group flex items-center gap-3 text-blue-100 transition-all duration-300 hover:translate-x-1">

                                <svg
                                    className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <rect
                                        x="3"
                                        y="5"
                                        width="18"
                                        height="14"
                                        rx="2"
                                    />
                                    <path d="m3 7 9 6 9-6" />
                                </svg>

                                <span className="text-blue-300">
                                    :
                                </span>

                                <a
                                    href="mailto:info@travelsota.com"
                                    className="font-semibold transition-all duration-300 hover:translate-x-0.5 hover:text-white"
                                >
                                    info@travelsota.com
                                </a>

                            </li>


                            {/* Phone */}

                            <li className="group flex items-center gap-3 text-blue-100 transition-all duration-300 hover:translate-x-1">

                                <svg
                                    className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>

                                <span className="text-blue-300">
                                    :
                                </span>

                                <a
                                    href="tel:+923001234567"
                                    className="font-semibold transition-all duration-300 hover:translate-x-0.5 hover:text-white"
                                >
                                    +92 300 1234567
                                </a>

                            </li>


                            {/* WhatsApp */}

                            <li className="group flex items-center gap-3 transition-all duration-300 hover:translate-x-1">

                                <svg
                                    className="h-5 w-5 shrink-0 text-green-400 transition-transform duration-300 group-hover:scale-110"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M20.1 3.9A11.86 11.86 0 0 0 12.05.57C5.5.57.17 5.9.17 12.45c0 2.09.55 4.13 1.6 5.93L.06 23.43l5.19-1.66a11.9 11.9 0 0 0 6.8 2.13h.01c6.55 0 11.88-5.33 11.88-11.89A11.82 11.82 0 0 0 20.1 3.9Z" />
                                </svg>

                                <span className="text-blue-300">
                                    :
                                </span>

                                <a
                                    href="#"
                                    className="font-semibold text-green-400 transition-all duration-300 hover:translate-x-0.5 hover:text-green-300"
                                >
                                    WhatsApp Support
                                </a>

                            </li>


                            {/* Address */}

                            <li className="group flex items-start gap-3 text-blue-100 transition-all duration-300 hover:translate-x-1">

                                <svg
                                    className="mt-0.5 h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                                    <circle
                                        cx="12"
                                        cy="10"
                                        r="3"
                                    />
                                </svg>

                                <span className="mt-0.5 text-blue-300">
                                    :
                                </span>

                                <span className="font-semibold transition-colors duration-300 group-hover:text-white">
                                    Office #316, 3rd Floor, Al-Hafeez
                                    Executive, Gulberg III, Lahore
                                </span>

                            </li>

                        </ul>

                    </div>

                </div>


                {/* ================= DIVIDER ================= */}

                <div className="my-10 h-px w-full bg-white/10" />


                {/* ================= WATERMARK ================= */}

                <div
                    ref={watermarkWrapRef}
                    className="relative select-none text-center"
                    style={{ perspective: "1000px" }}
                >

                    <div
                        ref={watermarkRef}
                        className="relative inline-block leading-none tracking-tight transition-transform duration-200 ease-out"
                        style={{
                            fontFamily: "'Changa One', cursive",
                            fontWeight: 400,
                            fontSize: "clamp(48px, 12vw, 180px)",
                            lineHeight: "clamp(48px, 12vw, 180px)",
                        }}
                    >

                        <span className="text-white">
                            Travels
                        </span>

                        <span className="text-blue-400/70 drop-shadow-[0_0_25px_rgba(96,165,250,0.6)]">
                            OTA
                        </span>

                        <span
                            className="absolute right-[-0.5em] top-[0.5em] inline-block text-[clamp(20px,9vw,60px)] leading-none"
                            style={{
                                animation:
                                    "travelsota-jet-loop 6s ease-in-out infinite",
                            }}
                            aria-hidden="true"
                        >
                            ✈️
                        </span>

                    </div>

                </div>

            </div>


            {/* ================= BOTTOM BAR ================= */}

            <div className="border-t border-white/10 bg-black/20">

                <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-2 px-6 py-4 text-xs text-blue-100 sm:text-sm">

                    <span>
                        © {new Date().getFullYear()}
                    </span>

                    <span className="font-bold text-white">
                        Travels<span className="text-blue-300">OTA</span>
                    </span>

                    <span className="text-blue-300/50">
                        |
                    </span>

                    <span>
                        Built with
                    </span>

                    <span
                        className="inline-block"
                        style={{
                            animation:
                                "travelsota-heartbeat 1.35s ease-in-out infinite",
                        }}
                        aria-hidden="true"
                    >
                        ❤️
                    </span>

                    <span>
                        by
                    </span>

                    <a
                        href="https://ikftech.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-white underline-offset-2 hover:underline"
                    >
                        Team iKFTech
                    </a>

                    <span className="text-blue-300/50">
                        —
                    </span>

                    <span className="font-semibold">
                        Vibing Worldwide
                    </span>

                    <span aria-hidden="true">
                        🌍
                    </span>

                    <span
                        className="inline-block"
                        style={{
                            animation:
                                "travelsota-bolt-rise 1.2s ease-out infinite",
                        }}
                        aria-hidden="true"
                    >
                        ⚡
                    </span>

                </div>

            </div>


            {/* ================= SCROLL TOP ================= */}

            <button
                type="button"
                aria-label="Scroll to top"
                onClick={scrollToTop}
                className={`fixed bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#1e3fd9] bg-white text-[#1e3fd9] shadow-lg transition-all duration-300 ${showScrollTop
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-2 opacity-0"
                    }`}
            >

                <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m18 15-6-6-6 6" />
                </svg>

            </button>


            {/* ================= ANIMATIONS ================= */}

            <style jsx>{`
                @keyframes travelsota-jet-loop {
                    0% {
                        transform: translate(10%, -55%) rotate(10deg);
                    }

                    50% {
                        transform: translate(35%, 5%) rotate(45deg);
                    }

                    100% {
                        transform: translate(10%, -55%) rotate(10deg);
                    }
                }

                @keyframes travelsota-heartbeat {
                    0%,
                    100% {
                        transform: scale(1);
                    }

                    25% {
                        transform: scale(1.25);
                    }

                    40% {
                        transform: scale(0.95);
                    }

                    55% {
                        transform: scale(1.15);
                    }

                    70% {
                        transform: scale(1);
                    }
                }

                @keyframes travelsota-bolt-rise {
                    0% {
                        transform: translateY(0);
                        opacity: 1;
                    }

                    60% {
                        transform: translateY(-6px);
                        opacity: 0.6;
                    }

                    100% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>

        </footer>
    );
}