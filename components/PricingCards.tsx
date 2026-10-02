"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaBriefcase,
  FaBuilding,
} from "react-icons/fa";

/* =========================================================
   FEATURES
========================================================= */

const startupFeatures = [
  "B2B & B2C OTA Booking Platform",
  "Flight Booking Module",
  "Hotel Booking Module",
  "Admin Dashboard",
  "Customer & Booking Management",
  "Basic Markup Management",
  "Payment Gateway Integration",
  "Multi-Currency Support",
  "Mobile Responsive Design",
  "Standard Technical Support",
];

const agencyFeatures = [
  "Everything in Startup",
  "B2B + B2C Travel Platform",
  "Agent Registration & Login",
  "Agent Dashboard & Wallet",
  "Agent Commission Management",
  "Multiple Supplier Management",
  "Advanced Markup Rules",
  "Tours & Car Rental Modules",
  "Automated Invoicing & Vouchers",
  "Standard Technical Support",
];

const enterpriseFeatures = [
  "Everything in Agency",
  "Complete B2B2C Travel Platform",
  "Multiple Flight & Hotel Supplier Integrations",
  "GDS & NDC Integration",
  "Advanced Supplier Routing",
  "Sub-Agent Management",
  "White-Label Travel Portals",
  "Multiple Domains",
  "Advanced Reporting & Analytics",
  "Dedicated Account Manager",
];

/* =========================================================
   FEATURE POPUP CONTENT

  
========================================================= */

const featureTooltips: Record<string, string> = {
  "Flight Booking Module":
    "Includes one Flight API for real-time flight search, fares, availability, seating, baggage and booking.",

  "Hotel Booking Module":
    " Includes one Hotel API for hotel search, property details, room availability, rates and booking.",
                    
  "Payment Gateway Integration":
    "Includes Stripe or PayPal integration.",

  "Standard Technical Support":
    "Includes 3 months basic support with a 3-working-day response time.Extended support starts from USD 100/month.",

  "Everything in Startup":
    "License valid for up to 2 domains.",

  "Tours & Car Rental Modules":
    " Manual inventory modules for adding, managing and selling tour packages and rental vehicles.",

  "Everything in Agency":
    "License valid for up to 3 domains.",
};

/* =========================================================
   FEATURE LIST
========================================================= */

type FeatureListProps = {
  features: string[];
  popular?: boolean;
};

function FeatureList({
  features,
  popular = false,
}: FeatureListProps) {
  return (
    <div className="flex-1 space-y-3">
      {features.map((feature, index) => {
        const tooltip = featureTooltips[feature];

        return (
          <div
            key={feature}
            className={`
              group
              flex
              items-start
              gap-3
              text-[14px]
              leading-5
              transition-all
              duration-300
              hover:translate-x-1

              ${
                popular && index === 0
                  ? "font-bold text-[#111827]"
                  : "font-medium text-[#374151]"
              }
            `}
          >
            {/* ================= CHECK ICON ================= */}

            <span
              className={`
                mt-0.5
                flex
                h-5
                w-5
                shrink-0
                items-center
                justify-center
                rounded-full
                text-[11px]
                font-bold
                transition-all
                duration-300
                group-hover:scale-110

                ${
                  popular
                    ? "bg-[#0b3aa8] text-white"
                    : "bg-[#eff6ff] text-[#0b3aa8]"
                }
              `}
            >
              ✓
            </span>

            {/* ================= FEATURE TEXT ================= */}

            <div className="relative min-w-0">
              {tooltip ? (
                <div className="group/tooltip relative inline-block">
                  {/* Feature text */}

                  <span
                    className="
                      inline-block
                      cursor-help
                      border-b
                      border-dotted
                      border-[#8fa4c7]
                      pb-[1px]
                      transition-colors
                      duration-200
                      group-hover/tooltip:border-[#0b3aa8]
                    "
                  >
                    {feature}
                  </span>

                  {/* ================= POPUP ================= */}

                  <div
                    className="
                      pointer-events-none
                      invisible

                      absolute
                      bottom-[calc(100%+12px)]
                      left-1/2
                      z-[100]

                      w-[250px]
                      // max-w-[calc(100vw-40px)]

                      -translate-x-1/2
                      translate-y-2

                      rounded-[18px]

                      bg-[#081225]

                      px-[10px]
                      py-[10px]

                      text-left
                      text-[12px]
    
                      leading-[1.4]
                      text-white

                      opacity-0

                      shadow-[0_18px_40px_rgba(2,6,23,0.25)]

                      transition-all
                      duration-300
                      ease-out

                      group-hover/tooltip:visible
                      group-hover/tooltip:translate-y-0
                      group-hover/tooltip:opacity-100

                      sm:w-[250px]
                    "
                  >
                    {tooltip}

                    {/* Popup Arrow */}

                    <span
                      className="
                        absolute
                        -bottom-[7px]
                        left-1/2
                        h-4
                        w-4
                        -translate-x-1/2
                        rotate-45
                        bg-[#081225]
                      "
                    />
                  </div>
                </div>
              ) : (
                /* Normal feature without popup */

                <span>{feature}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   PRICING CARD PROPS
========================================================= */

type PricingCardProps = {
  title: string;
  icon: React.ReactNode;
  description: string;
  price: string;
  pricePrefix?: string;
  priceLabel: string;
  highlight: string;
  buttonText: string;
  features: string[];
  popular?: boolean;
};

/* =========================================================
   PRICING CARD
========================================================= */

function PricingCard({
  title,
  icon,
  description,
  price,
  pricePrefix,
  priceLabel,
  highlight,
  buttonText,
  features,
  popular = false,
}: PricingCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: popular ? 1.02 : 1.015,
        y: -4,
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      className={`
        group
        relative
        flex
        h-full
        min-h-[890px]
        flex-col
        overflow-visible
        rounded-[28px]
        bg-white
        p-6
        transition-all
        duration-300
        sm:p-7

        ${
          popular
            ? `
              border-2
              border-[#0b3aa8]
              shadow-[0_20px_55px_rgba(11,58,168,0.10)]
              hover:shadow-[0_25px_65px_rgba(11,58,168,0.18)]
            `
            : `
              border
              border-slate-200
              shadow-[0_12px_40px_rgba(15,23,42,0.04)]
              hover:border-[#0b3aa8]
              hover:shadow-[0_20px_55px_rgba(11,58,168,0.12)]
            `
        }
      `}
    >
      {/* =====================================================
          MOST POPULAR
      ===================================================== */}

      {popular && (
        <div
          className="
            absolute
            left-1/2
            top-0
            z-20
            flex
            -translate-x-1/2
            -translate-y-1/2
            items-center
            gap-2
            whitespace-nowrap
            rounded-full
            bg-[#0b3aa8]
            px-5
            py-2
            text-[11px]
            font-black
            tracking-[0.14em]
            text-white
            shadow-[0_12px_30px_rgba(11,58,168,0.25)]
          "
        >
          <span className="text-sm">✧</span>

          <span>MOST POPULAR</span>
        </div>
      )}

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center gap-4">
        {/* Icon */}

        <div
          className={`
            flex
            h-[52px]
            w-[52px]
            shrink-0
            items-center
            justify-center
            rounded-2xl
            text-[22px]
            transition-all
            duration-300
            group-hover:rotate-3
            group-hover:scale-105

            ${
              popular
                ? `
                  bg-[#0b3aa8]
                  text-white
                  shadow-[0_10px_22px_rgba(11,58,168,0.25)]
                `
                : `
                  bg-[#eff6ff]
                  text-[#0b3aa8]
                `
            }
          `}
        >
          {icon}
        </div>

        {/* Title */}

        <h3
          className="
            text-[26px]
            font-black
            text-[#111827]
          "
        >
          {title}
        </h3>
      </div>

      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <p
        className="
          mt-5
          min-h-[56px]
          text-[15px]
          leading-6
          text-[#64748b]
        "
      >
        {description}
      </p>

      {/* =====================================================
          PRICE
      ===================================================== */}

      <div
        className="
          mt-5
          rounded-2xl
          border
          border-[#dbeafe]
          bg-[#eff6ff]
          px-4
          py-5
          transition-all
          duration-300
          hover:border-[#bfdbfe]
          hover:bg-[#eaf3ff]
        "
      >
        <div className="flex items-baseline gap-2">
          {pricePrefix && (
            <span className="text-[18px] font-bold text-[#64748b]">
              {pricePrefix}
            </span>
          )}

          <span
            className="
              text-[38px]
              font-black
              leading-none
              text-[#111827]
            "
          >
            {price}
          </span>

          <span
            className="
              text-lg
              font-black
              text-[#0b3aa8]
            "
          >
            USD
          </span>
        </div>

        <div
          className="
            mt-2
            text-[11px]
            font-black
            uppercase
            tracking-[0.16em]
            text-[#0b3aa8]
          "
        >
          {priceLabel}
        </div>
      </div>

      {/* =====================================================
          SINGLE HIGHLIGHT
      ===================================================== */}

      <div className="mt-5 min-h-[24px]">
        <p
          className={`
            flex
            items-center
            gap-2
            text-[11px]

            ${
              popular
                ? "font-bold text-[#0b3aa8]"
                : "font-semibold text-[#64748b]"
            }
          `}
        >
          <span className="text-[#0b3aa8]">•</span>

          <span>{highlight}</span>
        </p>
      </div>

      {/* =====================================================
          MAIN BUTTON
      ===================================================== */}

      <a
        href="mailto:sales@travelsota.com"
        className="
          mt-4
          flex
          h-[50px]
          w-full
          items-center
          justify-center
          gap-3
          rounded-xl
          bg-[#0b3aa8]
          px-4
          text-[14px]
          font-bold
          text-white
          shadow-[0_14px_30px_rgba(11,58,168,0.22)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:bg-[#2563eb]
          hover:shadow-[0_18px_35px_rgba(37,99,235,0.28)]
        "
      >
        <span>{buttonText}</span>

        <span
          className="
            text-lg
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        >
          →
        </span>
      </a>

      {/* =====================================================
          DIVIDER
      ===================================================== */}

      <div className="my-6 h-px w-full bg-slate-100" />

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <FeatureList
        features={features}
        popular={popular}
      />

      {/* =====================================================
          BOTTOM LINK
      ===================================================== */}

      <div
        className="
          mt-6
          border-t
          border-slate-100
          pt-5
        "
      >
        <a
          href="#"
          className="
            group
            flex
            items-center
            justify-between
            text-[12px]
            font-black
            tracking-wide
            text-[#0b3aa8]
            transition-all
            duration-300
            hover:tracking-[0.05em]
          "
        >
          <span>VIEW ALL FEATURES</span>

          <span
            className="
              text-lg
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          >
            →
          </span>
        </a>
      </div>
    </motion.div>
  );
}

/* =========================================================
   PRICING CARDS COMPONENT
========================================================= */

export default function PricingCards() {
  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[90rem]
        px-4
        sm:px-6
        lg:px-8
      "
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.15,
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="
          grid
          w-full
          grid-cols-1
          items-stretch
          gap-6
          sm:gap-7
          lg:grid-cols-3
          lg:gap-7
          xl:gap-8
        "
      >
        {/* =================================================
            STARTUP
        ================================================= */}

        <PricingCard
          title="Startup"
          icon={<FaRocket />}
          description="For entrepreneurs and small travel businesses ready to launch their own B2B & B2C OTA."
          price="2,999"
          priceLabel="Starting Package"
          highlight="License valid for 1 domain"
          buttonText="Start Your OTA"
          features={startupFeatures}
        />

        {/* =================================================
            AGENCY
        ================================================= */}

        <PricingCard
          title="Agency"
          icon={<FaBriefcase />}
          description="For established travel agencies scaling B2B agent networks and direct B2C sales."
          price="5,999"
          priceLabel="One-Time License"
          highlight="Includes B2B Agent Portal & Wallet System"
          buttonText="Grow Your Agency"
          features={agencyFeatures}
          popular
        />

        {/* =================================================
            ENTERPRISE
        ================================================= */}

        <PricingCard
          title="Enterprise"
          icon={<FaBuilding />}
          description="For large travel companies requiring custom supplier routing, white-label setup, and scale."
          price="8,999"
          pricePrefix="From"
          priceLabel="Custom Quote"
          highlight="Multi-branch & White-Label Architecture"
          buttonText="Talk to Sales"
          features={enterpriseFeatures}
        />
      </motion.div>
    </div>
  );
}