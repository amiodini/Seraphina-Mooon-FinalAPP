
import Image from "next/image"
import Link from "next/link"

const CTA = () => {
    return (
      <section className="cta-section w-fit">
        <div className="cta-badge">GIft a Tarot Reading</div>
        <h2 className="tect-3xl font-bold">
          What better gift than a personalized tarot reading?
        </h2>
        <p>Give the name, age, status and, of course, email of the person you want to gift the reading to - and let them have a glimpse ontheir personality and traits.</p>
        <p>They will receive an email with a link to their reading, which they can access at any time.</p>
        <button className="btn-primary">
          <Image src="icons/plus.svg" alt="Add" width={12} height={12} />
          <Link href="companions/new">
            <p>Gif a Reading</p>
          </Link>
        </button>
      </section>
    )
  }
  
  export default CTA