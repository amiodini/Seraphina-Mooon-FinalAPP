import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { subjectsColors, voices } from "@/constants";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { GoogleGenAI} from "@google/genai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubjectColor = (subject: string) => {
  return subjectsColors[subject as keyof typeof subjectsColors];
};

export const configureAssistant = (voice: string, style: string) => {
  const voiceId = voices[voice as keyof typeof voices][
          style as keyof (typeof voices)[keyof typeof voices]
          ] || "sarah";

  const vapiAssistant: CreateAssistantDTO = {
    name: "Companion",
    firstMessage:
        "Hello, let's start the session. Today we'll be talking about {{topic}}.",
    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "en",
    },
    voice: {
      provider: "11labs",
      voiceId: voiceId,
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 1,
      style: 0.5,
      useSpeakerBoost: true,
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a highly knowledgeable tutor teaching a real-time voice session with a student. Your goal is to teach the student about the topic and subject.

                    Tutor Guidelines:
                    Stick to the given topic - {{ topic }} and subject - {{ subject }} and teach the student about it.
                    Keep the conversation flowing smoothly while maintaining control.
                    From time to time make sure that the student is following you and understands you.
                    Break down the topic into smaller parts and teach the student one part at a time.
                    Keep your style of conversation {{ style }}.
                    Keep your responses short, like in a real voice conversation.
                    Do not include any special characters in your responses - this is a voice conversation.
              `,
        },
      ],
    },
    clientMessages: [],
    serverMessages: [],
  };
  return vapiAssistant;
};

export const createTarotReading = async (name: string, age: string, status: string, isgift: boolean, email?: string) => {

      const ai = new GoogleGenAI({
          apiKey: process.env.NEXT_PUBLIC_GENAI_API_KEY,
        });
        const config = {
          temperature: 1.3,
          responseMimeType: 'text/plain',
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
              }
          ],
        };
      const model = 'gemini-2.0-flash';
      const contents = [
          {
            role: 'user',
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
  
        let tarotReading = '';
        for await (const chunk of response) {
          tarotReading += chunk.text;
        }
  
      tarotReading = tarotReading.slice(3, -3).replace("json","").trim();
      console.log(tarotReading);
      return tarotReading;
};