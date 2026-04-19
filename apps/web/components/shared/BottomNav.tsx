"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/closet",  label: "Closet",  icon: "👗" },
  { href: "/outfits", label: "Outfits", icon: "✨" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-neutral-100 pb-safe">
      <div className="max-w-2xl mx-auto flex items-center justify-around px-2">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className="relative flex flex-col items-center gap-1 py-3 px-6 transition-all duration-200"
            >
              {/* Active pill background */}
              {active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 bg-primary-50 rounded-2xl"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={cn(
                "relative text-xl transition-transform duration-200 z-10",
                active && "scale-110"
              )}>
                {icon}
              </span>
              <span className={cn(
                "relative text-xs font-medium z-10 transition-colors duration-200",
                active ? "text-primary-500 font-semibold" : "text-neutral-400"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
