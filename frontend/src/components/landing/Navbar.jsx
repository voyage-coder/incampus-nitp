import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Menu, X } from "lucide-react";

import { NAV_LINKS } from "../../constants/navigation";
import { COLORS } from "../../constants/colors";
import Button from "../ui/Button";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${COLORS.border}` : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">

          <div
            className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-md"
            style={{
              background: COLORS.primary,
            }}
          >
            <GraduationCap size={24} color="white" />
          </div>

          <div>
            <h1
              className="text-xl font-bold"
              style={{
                color: COLORS.text,
              }}
            >
              InCampus
            </h1>

            <p
              className="text-xs"
              style={{
                color: COLORS.muted,
              }}
            >
              Campus. Connected.
            </p>
          </div>

        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="group relative font-medium transition-colors duration-300"
              style={{
                color: COLORS.text,
              }}
            >
              {item.name}

              <span
                className="absolute left-0 -bottom-1 h-[2px] w-0 transition-all duration-300 group-hover:w-full"
                style={{
                  background: COLORS.primary,
                }}
              />
            </a>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost">
            Login
          </Button>

          <Button>
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            color: COLORS.text,
          }}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden px-6 py-6 shadow-lg"
          style={{
            background: COLORS.surface,
            borderTop: `1px solid ${COLORS.border}`,
          }}
        >
          <div className="flex flex-col gap-5">

            {NAV_LINKS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-medium"
                style={{
                  color: COLORS.text,
                }}
              >
                {item.name}
              </a>
            ))}

            <div className="flex flex-col gap-3 pt-4">
              <Button variant="ghost">
                Login
              </Button>

              <Button>
                Get Started
              </Button>
            </div>

          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}