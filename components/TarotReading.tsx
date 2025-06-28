
import { deck } from "@/constants";
import React from "react";
interface TarotCard {
    Name: string;
    Verse: string;
  }
  
  interface CardInterpretation extends TarotCard {
    Meaning: string;
  }
  
  interface TarotReadingData {
    Introduction: string;
    CardsDrawn: TarotCard[];
    CardInterpretations: CardInterpretation[];
    Synthesis: string;
    Closing: string;
  }
  
  interface TarotReadingProps {
    data: TarotReadingData;
  }
  
  
  const TarotReading = ({ data }:TarotReadingProps) => {


    return (
 
      <div className="reading-section w-fit items-center justify-center">
        <h1 className="font-bold">Your Tarot Reading</h1>
  
        <p className="flex items-center justify-center">{data.Introduction}</p>
  
        <div >
          <h2 className="font-bold text-2xl">Cards Drawn</h2>
          <div className="flex items-center justify-center gap-2">
            {data.CardsDrawn.map((card, index) => (
              <div key={index} className="flex  items-center justify-center gap-2 flex-wrap">
               <img src={`${deck.find(c => c.name === card.Name)?.image}`}
                alt={card.Name} height={240} width={110} className={card.Verse === "Reversed" ? 'rotate-180' : ''}
                />
                <p ><b>{card.Name}</b></p>
                <p >{card.Verse}</p>
              </div>
            ))}
          </div>
        </div>
        <br />
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <h2 className="font-bold text-2xl">Interpreting your cards</h2>
          {data.CardInterpretations.map((interpretation, index) => (
            <div key={index} className="flex items-stretch justify-center gap-2 flex-wrap">
              <h3><b>{interpretation.Name} - {interpretation.Verse}</b></h3>
              <p className="flex items-stretch flex-wrap">{interpretation.Meaning}</p>
            </div>
          ))}
        </div>
  
        <h2 className="font-bold text-2xl">In Summary</h2>
        <p >{data.Synthesis}</p>
  
        <p className="font-bold text-2xl">{data.Closing}</p>
  
        
      </div>
    );
  };
  
  export default TarotReading;