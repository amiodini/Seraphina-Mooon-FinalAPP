
import Image from "next/image"
import Link from "next/link"

const ReadingIntro = () => {
    return (
      <section className="reading-section w-fit">
        <div className="flex flex-col max-sm:w-full gap-2.5">
              <h1 className="font-bold text-3xl">Get YOUR personalized Tarot Reading</h1>
              <p>
              Step into a world where technology meets mysticism! Uncover the hidden pathways of your digital destiny with Seraphina Moon’s Blind IT Tarot Reading. Let our AI-powered, entertainment-focused reading surprise you with insights that bridge the gap between modern innovation and ancient wisdom.
              Imagine receiving a personalized, one-of-a-kind tarot spread, crafted solely by digital magic to spark inspiration and creativity. Whether you're curious about your next tech project, seeking guidance on navigating the digital landscape, or simply in search of a moment of reflective fun, this blind reading is your portal to a unique experience.
              Why Choose Seraphina Moon?</p>
              <p>
              ✨ AI-Generated Brilliance: Experience tarot readings reimagined through innovative, cutting-edge technology.</p>
              <p>
              ✨ Blind & Unpredictable: Embrace the thrill of the unknown as each card reveals a message uniquely for you.</p>
              <p>
              ✨ Pure Entertainment: This reading is designed to entertain and inspire—no serious advice, just creative spark!</p>
              <p>
              Don't wait—dive into the digital mystique and let Seraphina Moon show you what surprises lie hidden in your future. Grab your Blind IT Tarot Reading today and start your journey into the exciting realm of technology and intuition!
              </p>
          </div>
        <button className="btn-primary">
          <Image src="icons/plus.svg" alt="Add" width={12} height={12} />
          <Link href="readings/new">
            <p>Get your Reading</p>
          </Link>
        </button>
      </section>
    )
  }
  
  export default ReadingIntro