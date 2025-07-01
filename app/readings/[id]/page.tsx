import { getReading } from "@/lib/actions/companion.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TarotReading from "@/components/TarotReading";

interface TarotReadingPageProps {
    params: Promise<{ id: string }>;
}

const TarotReadingDisplay = async ({params}: TarotReadingPageProps) => {
  const { id } = await params;
  console.log("id in:", id);
  const tarotReading = await getReading(id);
  const user = await currentUser();
 

  if (!user) redirect("/sign-in");
  if (!tarotReading) redirect("/companions");

  const tarotReadingJson = JSON.parse(tarotReading);

    return (
      <main>
        <div>
            <TarotReading data={tarotReadingJson.TarotReading} />
        </div>
      </main>
    )
  }
  
  export default TarotReadingDisplay