import React from 'react'
import Link from 'next/link';

interface CompanionCardProps {
    id: string;   // Unique identifier for the companion
    name: string; // Name of the companion
    subject: string; // Subject the companion specializes in
    topic: string; // Topic the companion covers
    duration: number; // Duration of the session in minutes
    color: string; // Color associated with the companion
}

const CompanionCard = ({id, name, subject, topic, duration, color}: 
    CompanionCardProps) => {
    return (
        <article className="companion-card" style={{ backgroundColor: color }}>
        <div className="flex justify-between items-center">
            <div className="subject-badge">
                {subject}
            </div>
            <button className="companion-bookmark"> 
                <img src="/icons/bookmark.svg" alt="Bookmark Icon"
                width={12.5} height={15} />
            </button>
        </div>
        <h2 className="text-2xl font-bold">{name}</h2>
        <p className="text-sm">{topic}</p>
        <div className="flex items-center gap-2">
            <img src="/icons/clock.svg" alt="Clock Icon" 
                width={13} height={13} />
            <p className="text-sm"> {duration} min</p>
        </div>
        <Link href={'/companions/${id}'} className="w-full">
            <button className="btn-primary w-full justify-center">
                Launch Lesson
            </button>
        </Link>
        </article>   

    )
  }
  
  export default CompanionCard