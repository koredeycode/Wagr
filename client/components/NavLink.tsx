"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  name: string;
  href: string;
};

const NavLink = ({ name, href }: NavItem) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`nav-link text-sm font-medium ${isActive ? "active" : ""}`}
    >
      {name}
    </Link>
  );
};

export default NavLink;
