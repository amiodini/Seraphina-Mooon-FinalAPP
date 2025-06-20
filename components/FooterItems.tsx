'use client';
import Link from "next/link"
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import path from "path";

const footerItems= [
                {label: "Biography", href: "/"}, 
                {label: "Disclaimer", href: "/"},
                {label: "Terms and conditiona", href: "/"}, 
              ] 

const FooterItems = () => {

    const pathname = usePathname();

    return (
        <nav className="navbar items-center gap2.5">
        {footerItems.map(({label, href}) => (
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
  
  export default FooterItems