'use client';
import Link from "next/link"
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const footerItems= [
                {label: "Biography", href: "/bio"}, 
                {label: "Disclaimer", href: "/disclaimer"},
                {label: "Terms and conditions", href: "/terms-and-conditions"}, 
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