
import React from 'react';
import TarotReading from "@/components/TarotReading";
import { createTarotReading } from '@/lib/utils';


const Home = async () => {

let tarotReading = ""
tarotReading = await createTarotReading("Lucas", "45", "seeking an adventure", false, "");

const tarotReadingJson = JSON.parse(tarotReading);

  return (
    <div>
      <TarotReading data={tarotReadingJson.TarotReading} />
    </div>
  );
};

export default Home;