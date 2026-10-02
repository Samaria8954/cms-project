"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";

interface NewsPost {
  image: string;
  category: string;
  title: string;
  author: string;
  date: string;
  profile: string;
}

const newsPosts: NewsPost[] = [
  {
    image: "/travel1.png",
    category: "TRAVEL TECHNOLOGY",
    title:
      "Travel API Integration: Complete Guide for OTAs, Agencies & Travel Businesses",
    author: "Maria Zargar",
    date: "September 16, 2026",
    profile: "/profile1.jpg",
  },
  {
    image: "/travel2.png",
    category: "TRAVEL TECHNOLOGY",
    title: "GDS vs NDC: Which Is Better for Travel Agencies?",
    author: "Faisal",
    date: "August 31, 2026",
    profile: "/profile2.png",
  },
  {
    image: "/travel3.avif",
    category: "TRAVEL TECHNOLOGY",
    title: "How to Build an Online Travel Agency (OTA) Platform",
    author: "Faisal",
    date: "August 31, 2026",
    profile: "/profile2.png",
  },
];

export default function TravelNews() {
  return (
    <section className="w-full px-5 py-5 sm:px-6 md:px-8 lg:px-8 xl:px-12">
      <div className="mx-auto w-full max-w-[1400px]">

        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-10"
        >
          {/* Small Heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="
              mb-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-[#0b3aa8]
              sm:text-[13px]
              md:text-[14px]
            "
          >
            TRAVELSOTA NEWS
          </motion.div>

          {/* Main Heading + View All */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-[950px]">
              {/* Main Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.1 }}
                className="
                  text-[30px]
                  font-black
                  leading-[1.08]
                  tracking-[-0.03em]
                  text-[#07142f]
                  sm:text-[35px]
                  md:text-[30px]
                "
              >
                Latest Travel Technology News & Insights
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="
                  mt-4
                  max-w-[830px]
                  text-[18px]
                  font-small
                  leading-[1.7]
                  text-[#334e73]
                  md:text-[18px]
                  lg:text-[16px]
                "
              >
                Read the latest travel technology news, OTA trends, GDS
                updates, NDC developments, travel APIs, booking technology
                and industry insights from TravelsOTA.
              </motion.p>
            </div>

            {/* View All News */}
            <motion.a
              href="#"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="
                group
                flex
                w-fit
                shrink-0
                items-center
                gap-3
                text-[15px]
                font-bold
                text-[#0b3aa8]
                sm:text-[16px]
              "
            >
              <span>View All News</span>

              <motion.span
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className="text-[14px]"
              >
                <FaArrowRight />
              </motion.span>
            </motion.a>
          </div>
        </motion.div>

        {/* ================= NEWS CARDS ================= */}
        <div
          className="
            grid
            grid-cols-1
            gap-9
            md:grid-cols-2
            lg:grid-cols-3
            lg:gap-8
          "
        >
          {newsPosts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.65,
                delay: index * 0.12,
                ease: "easeOut",
              }}
              whileHover={{ y: -6 }}
              className="
                group
                cursor-pointer
              "
            >
              {/* ================= IMAGE ================= */}
              <div
                className="
                  relative
                  aspect-[1.78/1]
                  w-full
                  overflow-hidden
                  rounded-[18px]
                  bg-[#f1f3f7]
                "
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-[1.045]
                  "
                  sizes="
                    (max-width: 768px) 100vw,
                    (max-width: 1024px) 50vw,
                    33vw
                  "
                />

                {/* Image Overlay */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/10
                    via-transparent
                    to-transparent
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                  "
                />

                {/* Category Badge */}
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  className="
                    absolute
                    right-4
                    top-4
                    rounded-full
                    bg-[#e60000]
                    px-4
                    py-2
                    text-[11px]
                    font-extrabold
                    tracking-[-0.01em]
                    text-white
                    shadow-[0_8px_20px_rgba(0,0,0,0.18)]
                    sm:text-[11px]
                  "
                >
                  {post.category}
                </motion.span>
              </div>

              {/* ================= CONTENT ================= */}
              <div className="pt-6">

                {/* Title */}
                <h3
                  className="
                    text-[23px]
                    font-black
                    leading-[1.28]
                    tracking-[-0.025em]
                    text-[#07142f]
                    transition-colors
                    duration-300
                    group-hover:text-[#0b3aa8]
                    sm:text-[23px]
                  "
                >
                  {post.title}
                </h3>

                {/* ================= AUTHOR META ================= */}
                <div
                  className="
                    mt-5
                    flex
                    items-center
                    gap-3
                    text-[14px]
                    sm:text-[15px]
                  "
                >
                  {/* Profile */}
                  <div
                    className="
                      relative
                      h-10
                      w-10
                      shrink-0
                      overflow-hidden
                      rounded-full
                      bg-[#e5e7eb]
                    "
                  >
                    <Image
                      src={post.profile}
                      alt={post.author}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Author */}
                  <span className="font-semibold text-[#17233d]">
                    {post.author}
                  </span>

                  {/* Dot */}
                  <span className="text-[#64748b]">
                    •
                  </span>

                  {/* Date */}
                  <span className="font-medium text-red-500">
                    {post.date}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}