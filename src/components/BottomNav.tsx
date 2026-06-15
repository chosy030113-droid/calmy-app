"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Mic, Phone, User } from "lucide-react";

const tabs = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/practice", icon: Mic, label: "연습하기" },
  { href: "/assist", icon: Phone, label: "통화 보조" },
  { href: "/mypage", icon: User, label: "마이페이지" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 390,
        background: "var(--calmy-white)",
        borderTop: "1px solid var(--calmy-border-subtle)",
        display: "flex",
        zIndex: 50,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {tabs.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "10px 0 8px",
              textDecoration: "none",
              color: active ? "var(--calmy-primary-600)" : "var(--calmy-neutral-400)",
              fontSize: 10,
              fontWeight: active ? 700 : 400,
              transition: "color 150ms",
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
