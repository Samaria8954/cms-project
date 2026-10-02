export default function TopBanner() {
  return (
    <div className="bg-primary text-white">
      {/* 0px - 640px */}
      <span className="block px-4 py-2 text-center font-bold text-xs sm:hidden">
        Build &amp; Scale Your Online Travel Agency
      </span>

      {/* 641px - 1020px and above */}
      <span className="hidden px-4 py-3 text-center font-bold text-xs sm:block sm:text-sm">
        Build, Launch &amp; Scale Your Online Travel Agency with TravelsOTA — Flights, Hotels &amp; APIs
      </span>
    </div>
  );
}