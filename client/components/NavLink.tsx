"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  name: string;
  href: string;
};
const NavLink = ({ name, href }: NavItem) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={
        isActive
          ? "text-primary text-sm font-bold"
          : "text-text hover:text-primary text-sm font-medium transition-colors"
      }
    >
      {name}
    </Link>
  );
};

export default NavLink;
