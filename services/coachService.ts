
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
  if (!apiKey || apiKey === "undefined") {
    return "Erreur : Clé API non détectée. Vérifiez vos secrets GitHub.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const { user, lastActivity, dailyCalories, hydration } = context;
  
  const systemInstruction = `Tu es le Coach WellTrack, un expert en musculation et nutrition.
Utilisateur : ${user.name}, ${user.weight}kg, Niveau ${user.level}.
Stats jour : ${dailyCalories}kcal, ${hydration}ml d'eau.
Dernier sport : ${lastActivity ? lastActivity.type : 'aucun'}.
Sois court, motivant et précis.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      })),
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "Je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error("Coach API Error:", error);
    return "Erreur de connexion avec l'IA. Vérifiez votre clé API.";
  }
};
