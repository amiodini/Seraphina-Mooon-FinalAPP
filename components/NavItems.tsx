'use client';
import Link from "next/link"
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems= [
                {label: "The Deck", href: "/deck"}, 
                {label: "Gift a Reading", href: "/readings/new"}, 
                {label: "My Readings", href: "/readings"},
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