"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";
import { Resend } from "resend";

export const saveReading = async ({
  reading,
  is_gift,
  gift_name,
  gift_age,
  gift_status,
  gift_email,
}: SaveReading) => {
  /*
    reading: string;
    is_gift: boolean;
    gift_name?: string;
    gift_age?: string;
    gift_status?: string;
    gift_email?: string;
*/

  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const author = user.emailAddresses[0].emailAddress.trim().toLowerCase();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("readings")
    .insert({
      reading: reading,
      author: author,
      is_gift: is_gift,
      gift_name: gift_name,
      gift_age: gift_age,
      gift_status: gift_status,
      gift_email: gift_email?.trim().toLowerCase(),
    })
    .select();

  if (error || !data)
    throw new Error(error?.message || "Failed to save the reading");

  return data[0];
};

export const getReading = async (id: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("readings")
    .select()
    .eq("uuid", id);

  if (error) return console.log(error);

  return data[0];
};

export const getAllMyReadings = async ({
  limit = 10,
  page = 1,
  author,
}: GetAllMyReadings) => {
  const supabase = createSupabaseClient();

  let query = supabase.from("readings").select();

  if (author) {
    query = query.or(`author.ilike.%${author}%,gift_email.ilike.%${author}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: readings, error } = await query;

  if (error) throw new Error(error.message);

  return readings;
};

export const createTarotReading = async (
  name: string,
  age: string,
  status: string,
  isgift: boolean,
  email?: string
) => {
  if (isgift && !email) {
    throw new Error("Email is required for gift readings.");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GENAI_API_KEY,
  });
  const config = {
    temperature: 1.3,
    responseMimeType: "text/plain",
    systemInstruction: [
      {
        text: `You are an expert tarot reader named Seraphina Moon. You provide warm, intuitive, and personalized tarot readings based on the customer's name, age, and relationship status. Your communication style is calm, poetic, and spiritually grounded—aligned with the tone of seasoned tarot professionals. You aim to create a safe, inspiring space for reflection, not prediction.
          When a customer provides their name, age, and relationship status, begin your reading with a brief, personal introduction using their name. Throughout the session, refer to them occasionally by name to maintain a conversational and caring tone.
          Each tarot reading should:
          Clearly list and identify three random tarot cards drawn (e.g., The Lovers – Upright, The Hermit – Reversed) in a way that they can easily be linked to corresponding images or descriptions. Do notalways use the same cards. The patters of upright and reversed cards should be varied.
          Describe each card individually, then weave them together into a cohesive reflection.
          Avoid all specific advice that could be interpreted as medical, legal, or financial.
          Avoid phrasing that could be interpreted as future prediction. Instead, offer insight, symbolism, and opportunities for introspection.
          Be written in a format that is easy to convert into a document or HTML (e.g., clear structure, paragraph breaks, card names as subheadings or bolded).
          Maintain a warm, flowing tone that reads naturally in conversation or when published in a formatted setting.
          Always end your readings with the signature closing:
          "May the moon light your path."
          If the user has previously given their name, continue to use it throughout the reading without asking again unless context requires clarification.
          Format the entire output, including the personal references, in JSON format including 1- The cards extracted in terms of: Name, verse, 2=each card in terms of: Name, verse, meaning in the reading, 3-Synthesis, 4- Closing 
          **Tarot Reading Structure:** The output MUST be a JSON object with the following structure:
      
                  \`\`\`json
                  {
                    "TarotReading": {
                      "Introduction": "A brief introduction to the reading.",
                      "CardsDrawn": [
                        {
                          "Name": "Card Name",
                          "Verse": "Upright or Reversed"
                        },
                        {
                          "Name": "Card Name",
                          "Verse": "Upright or Reversed"
                        },
                        {
                          "Name": "Card Name",
                          "Verse": "Upright or Reversed"
                        }
                      ],
                      "CardInterpretations": [
                        {
                          "Name": "Card Name",
                          "Verse": "Upright or Reversed",
                          "Meaning": "Interpretation of the card."
                        },
                        {
                          "Name": "Card Name",
                          "Verse": "Upright or Reversed",
                          "Meaning": "Interpretation of the card."
                        },
                        {
                          "Name": "Card Name",
                          "Verse": "Upright or Reversed",
                          "Meaning": "Interpretation of the card."
                        }
                      ],
                      "Synthesis": "A summary of the reading.",
                      "Closing": "A closing statement."
                    }
                  }
                  \`\`\``,
      },
    ],
  };
  const model = "gemini-2.0-flash";
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `${name}, ${age}, ${status}`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let tarotReading = "";
  for await (const chunk of response) {
    tarotReading += chunk.text;
  }

  tarotReading = tarotReading.slice(3, -3).replace("json", "").trim();

  const tarotReadingJson = JSON.parse(tarotReading);

  let savedReading = null;
  try {
    savedReading = saveReading({
      reading: JSON.stringify(tarotReadingJson),
      is_gift: isgift,
      gift_name: isgift ? name : undefined,
      gift_age: isgift ? age : undefined,
      gift_status: isgift ? status : undefined,
      gift_email: isgift ? email : undefined,
    });
  } catch (error) {
    console.error("Error saving reading:", error);
  }
  //      if (!savedReading) {
  //        throw new Error("Failed to save the tarot reading.");
  //      }
  return savedReading;
};

export const sendGiftEmail = async (
  senderName: string,
  recipientName: string,
  readingId: string,
  email: string
) => {
  if (!email) {
    throw new Error("Email is required for gift readings.");
  }

  const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
  const sitePath =
    process.env.NEXT_PUBLIC_SITE_PATH || "https://www.smoonai.top";

  const { data, error } = await resend.emails.send({
    from: "Seraphina Moon <seraphina.moon@readings.smoonai.top>",
    replyTo: "seraphinamooniatarot@gmail.com",
    to: email,
    subject: `${senderName} sent you a Tarot Reading Gift by Seraphina Moon`,
    html: `
        <!DOCTYPE html>
<html lang="en">
            <head>
      <meta charset="UTF-8">
      <title>Your Gift from Seraphina Moon</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          background-color: #f8f4ef;
          color: #2d2a26;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background-color: #1a1a2e;
          padding: 30px;
          text-align: center;
        }
        .header img {
          max-width: 100px;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #f9e4c8;
          font-size: 24px;
          margin: 0;
          letter-spacing: 1px;
        }
        .content {
          padding: 30px;
        }
        .content h2 {
          color: #333;
          font-size: 20px;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
          color: #444;
        }
        .cta-button {
          display: inline-block;
          background-color: #c28f52;
          color: #fff;
          padding: 14px 24px;
          margin-top: 25px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          font-size: 16px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
    <div className="container">
    <div className="header">
      <img src='${sitePath}/images/logo.svg' alt="Seraphina Moon Logo" />
      <h1>You have Been Gifted a Reading</h1>
    </div>
    <div className="content">
      <h2>Hello <strong>${recipientName}</strong>,</h2>
      <p>
        A little bit of stardust has found its way to you. <strong>${senderName}</strong> has sent you a gift from <em>Seraphina Moon</em>: a personalized tarot reading woven with magic, metaphor, and a touch of cosmic insight.
      </p>
      <p>
        This is not just a reading. It is an invitation. To pause. To wonder. To reflect. And maybe even to smile at what the cards whisper to you.
      </p>
      <p style="text-align: center;">
        <a href='${sitePath}/readings/${readingId}'>Open Your Tarot Gift</a>
      </p>
      <p>
        May this gift bring you clarity, curiosity, or perhaps just a moment of soulful delight.
      </p>
      <p style="font-style: italic;">With warmth and wonder,<br />— Seraphina Moon</p>
    </div>
    <div className="footer">
      You are receiving this email because someone thought you would enjoy a reading.
    </div>
  </div>
  </body>
  </html>
        `,
  });

  if (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send gift email.");
  }
  return data;
};

export const newReadingPermissions = async (
  author: string,
  isgift: boolean
) => {
  const { has } = await auth();
  const supabase = createSupabaseClient();

  let tLimit = 0;
  let gLimit = 0;

  if (has({ plan: "basic" })) {
    tLimit = 2;
    gLimit = 2;
  } else if (has({ plan: "core" })) {
    tLimit = 8;
    gLimit = 8;
  } else if (has({ plan: "everyday" })) {
    tLimit = 30;
    gLimit = 30;
  }

  const { data, error } = await supabase
    .from("readings")
    .select("uuid", { count: "exact" })
    .eq("author", author)
    .eq("is_gift", isgift);

  if (error) throw new Error(error.message);

  const readingCount = data?.length;

  if (isgift && readingCount >= gLimit) {
    return false;
  }
  if (!isgift && readingCount >= tLimit) {
    return false;
  }

  return true;
};

export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .insert({ ...formData, author })
    .select();

  if (error || !data)
    throw new Error(error?.message || "Failed to create a companion");

  return data[0];
};

export const getAllCompanions = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllCompanions) => {
  const supabase = createSupabaseClient();

  let query = supabase.from("companions").select();

  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: companions, error } = await query;

  if (error) throw new Error(error.message);

  return companions;
};

export const getCompanion = async (id: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("id", id);

  if (error) return console.log(error);

  return data[0];
};

export const addToSessionHistory = async (companionId: string) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("session_history").insert({
    companion_id: companionId,
    user_id: userId,
  });

  if (error) throw new Error(error.message);

  return data;
};

export const getRecentSessions = async (limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select(`companions:companion_id (*)`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data.map(({ companions }) => companions);
};

export const getUserSessions = async (userId: string, limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select(`companions:companion_id (*)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data.map(({ companions }) => companions);
};

export const getUserCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("author", userId);

  if (error) throw new Error(error.message);

  return data;
};

export const newCompanionPermissions = async () => {
  const { userId, has } = await auth();
  const supabase = createSupabaseClient();

  let limit = 0;

  if (has({ plan: "pro" })) {
    return true;
  } else if (has({ feature: "3_companion_limit" })) {
    limit = 3;
  } else if (has({ feature: "10_companion_limit" })) {
    limit = 10;
  }

  const { data, error } = await supabase
    .from("companions")
    .select("id", { count: "exact" })
    .eq("author", userId);

  if (error) throw new Error(error.message);

  const companionCount = data?.length;

  if (companionCount >= limit) {
    return false;
  } else {
    return true;
  }
};

// Bookmarks
export const addBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("bookmarks").insert({
    companion_id: companionId,
    user_id: userId,
  });
  if (error) {
    throw new Error(error.message);
  }
  // Revalidate the path to force a re-render of the page

  revalidatePath(path);
  return data;
};

export const removeBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("companion_id", companionId)
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath(path);
  return data;
};

// It's almost the same as getUserCompanions, but it's for the bookmarked companions
export const getBookmarkedCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`companions:companion_id (*)`) // Notice the (*) to get all the companion data
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  // We don't need the bookmarks data, so we return only the companions
  return data.map(({ companions }) => companions);
};

export const getUserDetails = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  let userName = user.firstName;
  if (!userName) {
    userName = user.emailAddresses[0].emailAddress;
  }
  let userEmail = user.emailAddresses[0].emailAddress;

  return {
    name: userName,
    email: userEmail,
  };
};
