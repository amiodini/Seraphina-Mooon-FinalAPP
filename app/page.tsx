import CompanionCard from '@/components/CompanionCard'
import CompanionsList from '@/components/CompanionsList'
import CTA from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { recentSessions } from '@/constants'
import React from 'react'

const Page = () => {
  return (
    <main>
      <h1 >Popular Companions</h1>
     <section className='home-section'>
      <CompanionCard 
        id="124"
        name="The brainiac"
        subject="science"
        topic="Neural Network of the Brain"
        duration={45}
        color="#E5D0FF"
      />
      <CompanionCard 
        id="126"
        name="The nuber wizard"
        subject="maths"
        topic="Derivatives & Integrals"
        duration={30}
        color="#FFDA6E"
      />
      <CompanionCard 
        id="128"
        name="The vocabulary builder"
        subject="language"
        topic="English Literature"
        duration={45}
        color="#BDE7FF"
      />
     </section>
     <section className='home-section'>
      <CompanionsList 
        title="Recently Completed Sessions"
        //description="Here are your recently completed sessions with your AI companions. You can review them or start a new session."
        companions={recentSessions}
        classNames="w-2/3 max-lg:w-full"
      />
      <CTA />
     </section>

    </main>
  )
}

export default Page