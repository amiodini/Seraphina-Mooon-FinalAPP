import ReadingForm from "@/components/ReadingForm";
import {auth} from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const NewReading = async () => {
  const { userId } = await auth();


  if (!userId) redirect("/sign-in"); 

  return (
    <main className="min-lg:w-1/3 min-md:w-2/3 items-center justify-center">
      <article className="w-full gap-4 flex flex-col">
        <h1>Ask for a new Tarot Reading</h1>

        <ReadingForm />
      </article>
    </main>
  )
}

export default NewReading
