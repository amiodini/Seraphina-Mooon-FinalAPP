import Link from "next/link"
import NavItems from "./NavItems"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"

const Navbar = () => {
    return (
      <nav className="navbar">
        <Link href="/" >
            <div className="flex items-center gap-2.5 cursor-pointer">
                <img src="images/logo.svg" 
                    alt="logo" width={46} height={44}
                />
                <p className="font-bold text-2xl">Seraphina Moon</p>
            </div>
        </Link>
        <div className="flex items-center gap-8">
            <NavItems />
            <SignedOut>
                <SignInButton >
                    <button className="btn-signin">
                        Sign In
                    </button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>

        </div>
      </nav>
    )
  }
  
  export default Navbar