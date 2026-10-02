"use client";

import React from "react";
import { motion } from "framer-motion";
import PricingCards from '@/components/PricingCards';


export default function PricingSection() {
    return (
        <section className="w-full">
            <div
                className="
          mx-auto
          w-full
          max-w-7xl
          px-4
          sm:px-6
          lg:px-10
          pb-20
          sm:pt-8
          md:pt-0
          border-b border-slate-200
        "
            >
                {/* ================================================= */}
                {/* TOP PILL */}
                {/* ================================================= */}

                <div className="relative flex justify-center">
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
                     px-5 py-1.5
                     shadow-[0_10px_40px_rgba(15,23,42,.08)]
                     backdrop-blur
                   "
                    >
                        <div className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.23em] text-[#0b3aa8] sm:text-xs">

                            {/* Blue Icon */}
                            <span className="flex h-5 w-5 items-center justify-center text-[17px] text-[#0b3aa8]">
                                ✦
                            </span>

                            <span className="whitespace-nowrap uppercase  ">
                                flexible Pricing
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* ================= MAIN HEADING ================= */}

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="
    mx-auto
    mt-0
    max-w-[90rem]
    text-center
    font-black
    md-leading-[0.98]
     leading-[1.2]
    tracking-[-0.035em]
    text-[#0b3aa8]
    text-[35px]
    sm:mt-2
    md:text-[65px]
    lg:text-[85px]
    xl:text-[95px]
  "
                >
                    {/* Choose Your Plan — stays normal */}
                    <span
                        className="
      text-[30px]
      md:text-[50px]
      lg:text-[70px]
      xl:text-[80px]
      md:mb-0
      mb-2
    "
                    >
                        Choose Your Plan
                    </span>

                    <br />

                    {/* Hover Gradient */}
                    <span
                        className="
      pricing-gradient-text
    "
                    >
                        Grow Your Travel
                        <br />
                        Business With
                        <br />
                        TravelsOTA
                    </span>
                </motion.h2>

                {/* ================= DESCRIPTION ================= */}

                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15, duration: 0.6 }}
                    className="
  mx-auto
  mt-5
  lg:w-[69%]
   md:w-[90%]
w-[95%]
  max-w-6xl
  text-center
  text-[15px]
  font-semibold
  leading-relaxed
  text-[#0b3aa8]
  sm:mt-7
  sm:text-[14px]
  md:text-[16px]
  lg:text-[18px]
  
"
                >
                    Choose the right OTA software plan for your travel business, with
                    flight and hotel booking technology designed for startups, agencies,
                    and enterprise travel companies.
                </motion.p>

                {/* ================= PRICING CARDS AREA ================= */}

                <div className="mt-12 sm:mt-16 lg:mt-20" id="pricing">
                    <PricingCards />
                </div>
            </div>
        </section>
    );
}