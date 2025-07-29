import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  import {redirect} from "next/navigation";
  import { currentUser } from '@clerk/nextjs/server';
  import { getAllMyReadings } from "@/lib/actions/companion.actions";
  
  
  const AllMyReadings = async () => {

    const user = await currentUser();
    if (!user) redirect("/sign-in");

    const author = user.emailAddresses[0].emailAddress.trim().toLowerCase();

    const myReadings = await getAllMyReadings({limit: 100, page: 1, author: author});

    console.log("My Readings:", myReadings);

    const myOwnReadings = myReadings.filter((reading) => reading.author === author && !reading.is_gift);
    const giftReadings = myReadings.filter((reading) => reading.gift_email === author);
    const giftedReadings = myReadings.filter((reading) => reading.is_gift && reading.author === author);

  
    return (
      <main className="min-lg:w-3/4">
        <section className="flex justify-between gap-4 max-sm:flex-col items-center">
          <div >
            <h1>My Readings</h1>
            <p>This page lists all your tarot readings.</p>
            <p>The ones that you requested to Seraphina.</p>
            <p>The ones that you gifted to your friends.</p>
            <p>The ones that were gifted to you.</p>
          </div>
        </section>
        <Accordion type="single" collapsible className="w-full" >
          <AccordionItem value="ReadingsIRequested">
            <AccordionTrigger className="text-2xl font-bold">
              Readings I requested {`(${myOwnReadings.length})`}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4 justify-between">
                {myOwnReadings.length === 0 && <p className="text-muted-foreground">You have not requested any readings yet.</p>}
                {myOwnReadings.map((reading) => (
                  <div key={reading.uuid} className="border border-black rounded-lg p-3">
                    <h2 className="text-sm text-muted-foreground">
                    <a href={`/readings/${reading.uuid}`} className="text-blue-500 hover:underline">
                      Requested on: {new Date(reading.created_at).toLocaleDateString()} </a>
                    </h2>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="MinorArcanaCups">
            <AccordionTrigger className="text-2xl font-bold">
              Readings I gifted {`(${giftedReadings.length})`}
            </AccordionTrigger>
                 <AccordionContent>
                 <div className="flex flex-col gap-4 justify-between">
                {giftedReadings.length === 0 && <p className="text-muted-foreground">You have not gifted any readings yet.</p>}
                {giftedReadings.map((reading) => (
                  <div key={reading.uuid} className="border border-black rounded-lg p-3">
                    <h2 className="text-sm text-muted-foreground">
                      Gifted to: {reading.gift_name} 
                    </h2>
                    <p className="text-sm text-muted-foreground">Age: {reading.gift_age}</p>
                    <p className="text-sm text-muted-foreground">Status: {reading.gift_status}</p>
                  </div>
                ))}
              </div>
                    </AccordionContent>
            </AccordionItem>
            <AccordionItem value="MinorArcanaPentacles">
            <AccordionTrigger className="text-2xl font-bold">
              Gift Readings I received {`(${giftReadings.length})`}
            </AccordionTrigger>
                 <AccordionContent>
                 <div className="flex flex-col gap-4 justify-between">
                {giftedReadings.length === 0 && <p className="text-muted-foreground">You have not received any readings yet.</p>}
                {giftedReadings.map((reading) => (
                  <div key={reading.uuid} className="border border-black rounded-lg p-3">
                    <h2 className="text-sm text-muted-foreground">
                    <a href={`/readings/${reading.uuid}`} className="text-blue-500 hover:underline">
                      Received on: {new Date(reading.created_at).toLocaleDateString()} </a>
                    </h2>
                  </div>
                ))}
              </div>
                    </AccordionContent>
            </AccordionItem>
        </Accordion>
      </main>
    );
  };
  export default AllMyReadings;