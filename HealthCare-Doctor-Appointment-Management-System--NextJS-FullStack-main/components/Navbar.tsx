"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl"
    >
      <div className="glassmorphism rounded-3xl px-6 py-3 flex items-center justify-between border border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/assets/icons/logo-icon.svg"
            height={32}
            width={32}
            alt="logo"
            className="h-8 w-8"
          />
          <span className="text-18-bold text-white tracking-widest hidden sm:block">
            CARE<span className="text-green-500">PULSE</span>
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6">
            {["Home", "Doctors", "Treatments", "About"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-14-medium text-dark-700 hover:text-green-500 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <Button className="shad-primary-btn rounded-full px-6 hover:scale-105 transition-transform">
            Book Now
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
