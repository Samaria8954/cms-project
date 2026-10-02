"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronUp } from "react-icons/fa";


export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.7, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={{
            scale: 1.06,
            boxShadow: "0 10px 30px rgba(11,58,168,0.18)",
          }}
          whileTap={{ scale: 0.94 }}
          aria-label="Scroll to top"
          className="
            fixed
            bottom-[85px]
            right-4
            z-50
            flex
            h-[50px]
            w-[50px]
            items-center
            justify-center
            rounded-full
            border
            border-[#0b3aa8]
            bg-white
            text-[#0b3aa8]
            shadow-[0_4px_18px_rgba(11,58,168,0.10)]
            transition-shadow
            duration-300
            sm:right-5
            sm:h-[59px]
            sm:w-[59px]
          "
        >
          <FaChevronUp className="text-[20px]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}