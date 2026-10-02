import Link from "next/link";
import { Changa_One } from "next/font/google";

const changaOne = Changa_One({
  weight: "400",
  subsets: ["latin"],
});

type LogoProps = {
  variant?: "dark" | "light";
  className?: string;
};

export default function Logo({
  variant = "dark",
  className = "",
}: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      className={`group flex shrink-0 items-center gap-3 border-0 outline-none focus:outline-none focus:ring-0 ${className}`}
    >
      {/* Logo Icon */}
      <div
        className={`
          flex h-10 w-10 items-center justify-center rounded-xl
          shadow-md transition-all duration-300
          group-hover:-translate-y-0.5
          ${
            isLight
              ? "bg-white text-primary"
              : "bg-primary text-white"
          }
        `}
      >
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
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 3 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
      </div>

      {/* Logo Text */}
      <div>
        <div
          className={`
            ${changaOne.className}
            text-[30px]
            leading-none
            tracking-[-0.01em]
            ${
              isLight
                ? "text-white"
                : "text-gray-900"
            }
          `}
        >
          Travels
          <span
            className={
              isLight
                ? "text-[#7fa4ff]"
                : "text-primary"
            }
          >
            &nbsp;OTA
          </span>
        </div>

        <div
          className={`
            hidden
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.25em]
            sm:block
            ${
              isLight
                ? "text-blue-100"
                : "text-gray-500"
            }
          `}
        >
          Travel Technology
        </div>
      </div>
    </Link>
  );
}