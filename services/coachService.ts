
import { GoogleGenAI } from "@google/genai";
import { UserProfile, ActivityLog, ChatMessage } from "../types";

export const getCoachResponse = async (
  messages: ChatMessage[],
  context: {
    user: UserProfile;
    lastActivity?: ActivityLog;
    dailyCalories: number;
    hydration: number;
  }
) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    return "⚠️ Clé API manquante. Ajoutez API_KEY dans vos secrets GitHub.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const { user, dailyCalories, hydration } = context;
  const systemInstruction = `Tu es le Coach WellTrack. Utilisateur: ${user.name}. Stats: ${dailyCalories}kcal, ${hydration}ml. Sois très bref et motivant.`;

  const callApi = async (retries = 2, delay = 3000): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messages.map(m => ({
          role: m.role === 'user' ? 'user' : ('model' as any),
          parts: [{ text: m.content }]
        })),
        config: { systemInstruction, temperature: 0.7 }
      });
      return response.text || "Je n'ai pas pu répondre.";
    } catch (error: any) {
      if (retries > 0 && (error.message?.includes("429") || error.status === 429)) {
        await new Promise(res => setTimeout(res, delay));
        return callApi(retries - 1, delay * 2);
      }
      return "Le serveur est un peu surchargé (Quota gratuit atteint). Réessaie dans 1 minute.";
    }
  };

  return callApi();
};
