"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    FaPlane,
    FaRegBuilding,
    FaBus,
    FaBookmark,
    FaRegAddressCard,
    FaChevronDown,
    FaExternalLinkAlt,
    FaWhatsapp,
} from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { MdOutlineMail, MdArrowForward } from "react-icons/md";

type Card = {
    title: string;
    icon: React.ReactNode;
};

const cards: Card[] = [
    { title: "Flights", icon: <FaPlane /> },
    { title: "Stays", icon: <FaRegBuilding /> },
    { title: "Transfers", icon: <FaBus /> },
    { title: "Tours", icon: <FaBookmark /> },
    { title: "Visas", icon: <FaRegAddressCard /> },
    { title: "eSIM", icon: <HiOutlineDocumentText /> },
];

export default function HeroSection() {
    return (
        <div className="herosec relative  w-full bg-white mx-auto w-full px-5 sm:px-4 lg:px-6 2xl:px-8">
        <section className=" ">

            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                    background:
                        "radial-gradient(circle at 20% 10%, rgba(37,99,235,.20), transparent 45%), radial-gradient(circle at 80% 30%, rgba(59,130,246,.18), transparent 40%)",
                }}
            />

            <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-10">

                {/* ================================================= */}
                {/* TOP PILL */}
                {/* ================================================= */}

                <div className="relative flex justify-center pt-8">
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="
              rounded-full
              border
  border-[#0b3aa8]
  animate-gradient-border
  px-5
              bg-white/70
              px-5 py-2.5
              shadow-[0_10px_40px_rgba(15,23,42,.08)]
              backdrop-blur
            "
                    >
                        <div className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.23em] text-[#0b3aa8] sm:text-xs">

                            {/* Blue Icon */}
                            <span className="flex h-5 w-5 items-center justify-center text-[17px] text-[#0b3aa8]">
                                ✦
                            </span>

                            <span className="whitespace-nowrap">
                                THE FUTURE OF TRAVEL TECHNOLOGY
                            </span>
                        </div>
                    </motion.div>
                </div>


                {/* ================================================= */}
                {/* MAIN HERO */}
                {/* ================================================= */}

                <div className="relative pt-5 sm:pt-5">

                    <motion.h1
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                       className="
  mx-auto
  max-w-[90rem]
  text-center
  text-[clamp(35px,7vw,90px)]
  font-black
  leading-[1]
  tracking-[-0.025em]
  capitalize
  text-black
"
                    >
                        {/* PURE BLACK */}
                        <span className="text-black">
                            Powering The Future Of
                        </span>

                        <br />

                        {/* SMOOTH GRADIENT */}
                        <span
                            className="
                inline-block
                bg-clip-text
                pb-4
                pt-2
                text-transparent
                drop-shadow-[0_8px_18px_rgba(37,99,235,.12)]
              "
                            style={{
                                backgroundImage:
                                    "linear-gradient(90deg, #111827 0%, #0b3aa8 25%, #2563eb 50%, #3474c1 72%, #2563eb 86%, #0b3aa8 100%)",
                            }}
                        >
                            Travel Agencies
                        </span>
                    </motion.h1>


                    {/* ================================================= */}
                    {/* DESCRIPTION */}
                    {/* ================================================= */}

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12, duration: 0.6 }}
                        className="mx-auto mt-6 max-w-3xl text-center"
                    >

                        {/* Main Description */}

                        <p className="text-base font-medium leading-relaxed text-[#475569] sm:text-lg">
                            Powering the next generation of online travel agencies — built
                            to help you{" "}
                            <span className="font-extrabold text-black scale-y-[1.15]">
                                sell more, automate faster, and grow smarter.
                            </span>
                        </p>


                        {/* Secondary Description */}

                        <p className="mx-auto mt-2 w-full text-center text-sm leading-relaxed text-[#64748b] sm:w-[80%] sm:text-base">
                            We are building a powerful travel technology platform that brings everything your travel business needs into one connected ecosystem.
                        </p>
                    </motion.div>
                </div>


                {/* ================================================= */}
                {/* CARDS */}
                {/* ================================================= */}

                <div className="mt-8">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                    >

                        <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:grid-cols-6">

                            {cards.map((c, idx) => (
                                <motion.div
                                    key={c.title}
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: idx * 0.05,
                                        duration: 0.45,
                                    }}
                                    whileHover={{
                                        y: -4,
                                        scale: 1.025,
                                    }}
                                    className="
                    group
                    flex
                    flex-col
                    items-center
                    justify-center
                    rounded-3xl
                    border
                    border-slate-200/60
                    bg-white/70
                    px-3
                    py-6
                    text-center
                    shadow-[0_18px_50px_rgba(2,6,23,.06)]
                    backdrop-blur
                    transition-all
                    duration-300
                    ease-out
                    hover:border-[#9db9ee]
                    hover:shadow-[0_20px_45px_rgba(37,99,235,.11)]
                  "
                                >

                                    {/* Icon */}

                                    <div
                                        className="
                      mb-2.5
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-600/5
                      text-[#0b3aa8]
                      transition-all
                      duration-300
                      ease-out
                      group-hover:rotate-3
                      group-hover:bg-blue-600/10
                    "
                                    >
                                        <span className="text-lg">
                                            {c.icon}
                                        </span>
                                    </div>


                                    {/* Title */}

                                    <div className="text-sm font-bold text-[#1e293b]">
                                        {c.title}
                                    </div>


                                    {/* Hover Line */}

                                    <div
                                        className="
                      mt-1.5
                      h-[2px]
                      w-9
                      rounded-full
                      bg-gradient-to-r
                      from-blue-600
                      to-cyan-500
                      opacity-0
                      transition-all
                      duration-300
                      ease-out
                      group-hover:w-11
                      group-hover:opacity-100
                    "
                                    />

                                </motion.div>
                            ))}

                        </div>


                        {/* ================================================= */}
                        {/* BUTTONS */}
                        {/* ================================================= */}

                        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">

                            {/* CONTACT */}

                            <motion.a
                                href="https://wa.me/923260334422"
                                target="_blank"
                                rel="noopener noreferrer"

                                whileHover={{
                                    y: -2,
                                    scale: 1.01,
                                }}
                                transition={{ duration: 0.2 }}
                                className="
                  flex
                  w-[200px]
                  items-center
                  justify-center
                  gap-2.5
                  rounded-2xl
                  bg-[#25D366]
                  px-3
                  py-3
                  font-semibold
                  text-white
                  shadow-[0_22px_60px_rgba(37,211,102,.28)]
                "
                            >
                                <IoChatbubbleEllipsesOutline className="text-xl" />

                                <span className="text-sm sm:text-base">
                                    Contact Us
                                </span>

                                <MdArrowForward className="text-lg" />
                            </motion.a>


                            {/* EMAIL */}

                            <motion.a
                                href="https://mail.google.com/mail/?view=cm&fs=1&to=sales@travelsota.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{
                                    y: -2,
                                    scale: 1.01,
                                }}
                                transition={{ duration: 0.2 }}
                                className="
                  flex
                  md:w-[320px]
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  bg-[#0b3aa8]
                  px-3
                  py-3
                  font-semibold
                  text-white
                  shadow-[0_22px_60px_rgba(11,58,168,.22)]
                  sm:w-[240px]
                "
                            >
                                <MdOutlineMail className="text-lg" />

                                <span className="text-sm sm:text-base">
                                    sales@travelsota.com
                                </span>
                            </motion.a>

                        </div>

                    </motion.div>
                </div>
            </div>


            {/* ========================================================= */}
            {/* LEFT STICKY BUTTONS */}
            {/* ========================================================= */}

            <div className="fixed left-0 top-[33%] z-[60] hidden md:block">

                <div className="flex flex-col gap-2">

                    {/* ================= PRICING ================= */}

                   <div
  onClick={() => {
    document.getElementById("pricing")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }}
  role="button"
  tabIndex={0}
  className="
    group
    relative
    flex
    h-[160px]
    w-[47px]
    cursor-pointer
    flex-col
    items-center
    rounded-r-[15px]
    bg-[#0b3aa8]
    text-white
    shadow-[0_18px_35px_rgba(2,6,23,.20)]
  "
>
  {/* Top Dot */}

  <span
    className="
      absolute
      top-2
      text-[17px]
      leading-none
      transition-all
      duration-300
      animate-pulse
      group-hover:scale-125
      group-hover:rotate-180
      group-hover:text-blue-300
    "
  >
    ●
  </span>

  {/* Pricing */}

  <span
  className="
    absolute
    left-[48%]
    top-[45%]
    -translate-x-1/2
    -translate-y-1/2
    -rotate-90
    whitespace-nowrap
    text-[11px]
    font-extrabold
    tracking-[0.18em]
    transition-transform
    duration-500
    ease-in-out
    group-hover:rotate-90
  "
>
  PRICING
</span>

  {/* HOT */}

  <div className="hero-pricing-tab">
    <span
      className="
        absolute
        bottom-[32px]
        left-[11%]
        rounded-md
        border
        border-white/30
        bg-[#4168cf]
        px-2
        py-1
        text-[8px]
        font-extrabold
        leading-none
        transition-all
        duration-300
        group-hover:bg-[#2563eb]
        group-hover:scale-105
      "
    >
      HOT
    </span>
  </div>

  {/* Down Arrow */}

  <FaChevronDown
    className="
      absolute
      bottom-3
      text-[12px]
      transition-transform
      duration-300
      group-hover:translate-y-1
    "
  />
</div>

                    {/* ================= LIVE DEMO ================= */}

                    <div
                        className="
    relative
    group
    flex
    h-[153px]
    w-[47px]
    flex-col
    items-center
    rounded-r-[18px]
    bg-[#0b3aa8]
    text-white
    shadow-[0_18px_35px_rgba(2,6,23,.20)]
  "
                    >
                        {/* Top Dot */}

                        <span className="absolute top-2 text-[17px] leading-none  transition-all
    duration-300
    animate-pulse
    group-hover:scale-125
    group-hover:rotate-180
    group-hover:text-blue-300">
                            ●
                        </span>

                        {/* Live Demo */}

                       <span
  className="
    absolute
    left-[49%]
    top-[46%]
    -translate-x-1/2
    -translate-y-1/2
    -rotate-90
    whitespace-nowrap
    text-[11px]
    font-extrabold
    tracking-[0.18em]
    transition-transform
    duration-500
    ease-in-out
    group-hover:rotate-90
  "
>
  LIVE DEMO
</span>
                        {/* External Link */}

                        <FaExternalLinkAlt
                            className="
      absolute
      bottom-3
      text-[11px]
    "
                        />

                    </div>
                </div>
            </div>

            {/* ========================================================= */}
            {/* WHATSAPP */}
            {/* ========================================================= */}

            <div className="fixed bottom-5 right-5 z-[70]">

                <motion.a
                    href="https://wa.me/923260334422"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-[#25D366]
            text-white
            shadow-[0_18px_40px_rgba(37,211,102,.28)]
          "
                    aria-label="WhatsApp"
                >
                    <FaWhatsapp className="text-[31px]" />
                </motion.a>

            </div>

        </section>
        </div>
    );
}