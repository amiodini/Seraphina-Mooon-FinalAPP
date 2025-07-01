
import React from 'react';
import TarotReading from "@/components/TarotReading";
import { createTarotReading } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";


const NewReading = async () => {
    const user = await currentUser();
    if (!user) redirect("/sign-in");

    let name = user.firstName;
    if (!name) {name = user.emailAddresses[0].emailAddress;};

    const age = user.publicMetadata.age || "unknown";


let tarotReading = ""
tarotReading = await createTarotReading(name, "45", "seeking an adventure", false, "");

const tarotReadingJson = JSON.parse(tarotReading);

  return (
    <div>
      <TarotReading data={tarotReadingJson.TarotReading} />
    </div>
  );
};

export default NewReading;