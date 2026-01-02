"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  name: string;
  href: string;
  exact?: boolean; // If true, only exact match is considered active
};

const NavLink = ({ name, href, exact = false }: NavItem) => {
  const pathname = usePathname();
  
  // For exact matching, only match if path is exactly the href
  // For non-exact, also match if current path is a child of href
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + "/");

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

