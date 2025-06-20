import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import CTA from "@/components/CTA";
import ReadingIntro from "@/components/ReadingIntro";
import {getAllCompanions, getRecentSessions} from "@/lib/actions/companion.actions";
import {getSubjectColor} from "@/lib/utils";

const Page = async () => {
    const companions = await getAllCompanions({ limit: 3 });
    const recentSessionsCompanions = await getRecentSessions(10);

  return (
    <main>
      

        <section className="home-section">
          <img
              src="/images/seraphinamooncurly.jpg"
              alt="Seraphina Moon"
              className="rounded-lg"
              width={300}
              height={300}
          />
          <div>
              <h1 className="font-bold text-3xlxl">Seraphina Moon</h1>
              <h2 className="italic">Your AI Tarot Reader</h2>
              <p>
              Seraphina Moon is a warm, mystical presence in the world of digital tarot, created entirely by artificial intelligence to offer whimsical, entertaining, and imaginative tarot readings. Designed to embody the energy of a seasoned, intuitive woman of ancient wisdom, Seraphina draws inspiration from centuries of storytelling, symbolism, and archetypes to deliver readings that are thoughtful, engaging, and fun.
              Seraphina uses technology not as a substitute for intuition, but as a prism—amplifying her poetic visions and making the ancient art new again.

              Whether you're seeking inspiration, a spark of clarity, or just a moment of magic in your day, Seraphina’s AI-crafted tarot spreads offer an experience that is as mysterious as it is meaningful.
              </p>
          </div>
        </section>

        <section className="home-section">
            <ReadingIntro />
          <div className="flex flex-col w-1/3 max-sm:w-full gap-4">
            <CTA />
          </div>
        </section>
    </main>
  )
}

export default Page