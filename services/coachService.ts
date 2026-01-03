
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
    return "⚠️ CLÉ API MANQUANTE : Pour activer le coach sur GitHub, allez dans Settings > Secrets > Actions de votre dépôt et ajoutez 'API_KEY'.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const { user, dailyCalories, hydration } = context;
  
  const systemInstruction = `Tu es le Coach WellTrack. Utilisateur: ${user.name}, ${user.weight}kg. Stats: ${dailyCalories}kcal, ${hydration}ml. Réponds de façon brève et motivante.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Version gratuite
      contents: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      })),
      config: { systemInstruction, temperature: 0.7 }
    });

    return response.text || "Je n'ai pas pu générer de réponse.";
  } catch (error: any) {
    if (error.message?.includes("API_KEY_INVALID")) {
      return "⚠️ CLÉ API INVALIDE : La clé configurée dans GitHub Secrets n'est pas reconnue par Google.";
    }
    return "Désolé, j'ai une petite baisse d'énergie (Erreur de connexion).";
  }
};
