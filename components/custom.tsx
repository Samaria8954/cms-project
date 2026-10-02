"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaArrowRight } from "react-icons/fa";

export default function CustomSolutions() {
  return (
    <section className="w-full px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="
          relative
          mx-auto
          w-full
          max-w-[1400px]
          overflow-hidden
          rounded-[30px]
          border
          border-blue-100
          bg-gradient-to-r
          from-[#f8fbff]
          via-[#f1f6ff]
          to-[#eaf1ff]
          px-6
          py-6
          shadow-[0_12px_40px_rgba(11,58,168,0.06)]
         
        "
      >
        {/* Soft background glow */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-20
            -top-24
            h-64
            w-64
            rounded-full
            bg-blue-300/10
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-24
            left-1/3
            h-56
            w-56
            rounded-full
            bg-sky-300/10
            blur-3xl
          "
        />

       {/* Main Content */}
<div
  className="
    relative
    z-10
    flex
    flex-col
    gap-8
    md:flex-row
    md:items-center
    md:gap-8
    lg:gap-10
  "
>
  {/* ================= TEXT ================= */}
  <motion.div
    initial={{ opacity: 0, x: -25 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.65, delay: 0.1 }}
    className="
      w-full
      md:w-[58%]
      lg:w-[60%]
    "
  >
    {/* Small heading */}
    <div className="mb-3">
      <span
        className="
          text-[12px]
          font-bold
          uppercase
          tracking-[0.22em]
          text-[#0b3aa8]
          sm:text-[11px]
          md:text-[11px]
        "
      >
        Custom Solutions
      </span>
    </div>

    {/* Main heading */}
    <motion.h2
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="
        max-w-[850px]
        text-[24px]
        font-black
        leading-[1.08]
        tracking-[-0.025em]
        text-[#111827]
        sm:text-[36px]
        md:text-[24px]
        lg:text-[24px]
        xl:text-[24px]
      "
    >
      Need a Custom Travel Technology Solution?
    </motion.h2>

    {/* Description */}
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.25 }}
      className="
        mt-4
        max-w-[850px]
        text-[18px]
        font-medium
        leading-[1.65]
        text-[#334e73]
        sm:text-[18px]
        md:text-[16px]
        
      "
    >
      Tell us about your business model, suppliers, integrations, and
      growth plans. Our engineering team can build a solution designed
      around your specific requirements.
    </motion.p>
  </motion.div>

  {/* ================= BUTTONS ================= */}
  <motion.div
    initial={{ opacity: 0, x: 25 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.65, delay: 0.2 }}
    className="
      flex
      w-full
      flex-col
      gap-4
      sm:flex-row
      md:w-[42%]
      md:flex-col
      lg:w-[40%]
      lg:flex-row
      lg:items-center
    "
  >
    {/* WhatsApp */}
    <motion.a
      href="https://wa.me/923260334422"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{
        y: -4,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="
        group
        flex
        min-h-[58px]
        w-full
        items-center
        justify-center
        gap-3
        rounded-2xl
        bg-[#25D366]
        px-2
        py-2
        text-[13px]
        font-bold
        text-white
        shadow-[0_14px_30px_rgba(37,211,102,0.22)]
        transition-shadow
        duration-300
        hover:shadow-[0_18px_38px_rgba(37,211,102,0.32)]
        sm:w-1/2
        md:w-full
        lg:w-1/2
      "
    >
      <motion.span
        whileHover={{
          rotate: 8,
          scale: 1.12,
        }}
        transition={{ duration: 0.2 }}
        className="text-[22px]"
      >
        <FaWhatsapp />
      </motion.span>

      <span>Talk to Our Team</span>

      <motion.span
        initial={{ x: 0 }}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
        className="text-[17px]"
      >
        <FaArrowRight />
      </motion.span>
    </motion.a>

    {/* Live Demo */}
    <motion.a
      href="#"
      whileHover={{
        y: -4,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="
        group
        flex
        min-h-[58px]
        w-full
        items-center
        justify-center
        gap-3
        rounded-2xl
        bg-[#0b3aa8]
        px-2
        py-2
        text-[13px]
        font-bold
        text-white
        shadow-[0_14px_30px_rgba(11,58,168,0.20)]
        transition-shadow
        duration-300
        hover:shadow-[0_18px_38px_rgba(37,99,235,0.30)]
        sm:w-1/2
        md:w-full
        lg:w-1/2
      "
    >
      <span>Request a Live Demo</span>

      <motion.span
        initial={{ x: 0 }}
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
        className="text-[17px]"
      >
        <FaArrowRight />
      </motion.span>
    </motion.a>
  </motion.div>
</div>
      </motion.div>
    </section>
  );
}