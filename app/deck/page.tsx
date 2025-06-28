import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";


import { deck } from "@/constants";
import CardsList from "@/components/CardList";
  
  const Deck = async () => {

    const majorArcana = deck.filter((card) => card.arcana === "Major");
    const minorArcana = deck.filter((card) => card.arcana === "Minor");    

  
    return (
      <main className="min-lg:w-3/4">
        <section className="flex justify-between gap-4 max-sm:flex-col items-center">
          <div >
            <h1>The Deck</h1>
            <p>This Tarot Deck is ancient and powerful.</p>
            <p>I have gathered all the cards in my long travels around the world</p>
            <p>Now each card combines all the wisdom it gathered from its previous owners with the deep knowledge and rach of technology</p>
            <p>It will bring new insights and a new light to all the readings.</p>
          </div>
        </section>
        <Accordion type="single" collapsible className="w-full" >
          <AccordionItem value="MajorArcana">
            <AccordionTrigger className="text-2xl font-bold">
              Major Arcana {`(${majorArcana.length})`}
            </AccordionTrigger>
            <AccordionContent>
              <CardsList
                cards={majorArcana}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="MinorArcanaCups">
            <AccordionTrigger className="text-2xl font-bold">
              Minor Arcana - Cups {`(${minorArcana.filter((card) => card.seed === "Cups").length})`}
            </AccordionTrigger>
                 <AccordionContent>
                    <CardsList
                        cards={minorArcana.filter((card) => card.seed === "Cups")}
                    />
                    </AccordionContent>
            </AccordionItem>
            <AccordionItem value="MinorArcanaPentacles">
            <AccordionTrigger className="text-2xl font-bold">
              Minor Arcana - Pentacles {`(${minorArcana.filter((card) => card.seed === "Pentacles").length})`}
            </AccordionTrigger>
                 <AccordionContent>
                    <CardsList
                        cards={minorArcana.filter((card) => card.seed === "Pentacles")}
                    />
                    </AccordionContent>
            </AccordionItem>
            <AccordionItem value="MinorArcanaSwords">
            <AccordionTrigger className="text-2xl font-bold">
              Minor Arcana - Swords {`(${minorArcana.filter((card) => card.seed === "Swords").length})`}
            </AccordionTrigger>
                 <AccordionContent>
                    <CardsList
                        cards={minorArcana.filter((card) => card.seed === "Swords")}
                    />
                    </AccordionContent>
            </AccordionItem>
            <AccordionItem value="MinorArcanaWands">
            <AccordionTrigger className="text-2xl font-bold">
              Minor Arcana - Wands {`(${minorArcana.filter((card) => card.seed === "Wands").length})`}
            </AccordionTrigger>
                 <AccordionContent>
                    <CardsList
                        cards={minorArcana.filter((card) => card.seed === "Wands")}
                    />
                    </AccordionContent>
            </AccordionItem>

        </Accordion>
      </main>
    );
  };
  export default Deck;