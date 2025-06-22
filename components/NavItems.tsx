'use client';
import Link from "next/link"
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import path from "path";

const navItems= [
                {label: "The Deck", href: "/deck"}, 
                {label: "Gift a Reading", href: "/companions"}, 
                {label: "My Readings", href: "/my-journey"},
                ] 

const NavItems = () => {

    const pathname = usePathname();

    return (
        <nav className="flex items-center gap-4">
        {navItems.map(({label, href}) => (
            <Link 
                key={label} 
                href={href}
                className={cn(pathname === href && "text-primary font-semibold")}>
               {label}
            </Link>
            ))
        }
        </nav>

    )
  }
  
  export default NavItems