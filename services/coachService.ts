
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
    return "⚠️ Configuration requise : Ajoutez votre API_KEY dans les Secrets de votre dépôt GitHub pour activer le coach.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const { user, dailyCalories, hydration } = context;
  
  const systemInstruction = `Tu es le Coach WellTrack. Utilisateur: ${user.name}, ${user.weight}kg. Stats: ${dailyCalories}kcal, ${hydration}ml. Réponds de façon brève et motivante.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: messages.map(m => ({
        role: m.role === 'user' ? 'user' : ('model' as any),
        parts: [{ text: m.content }]
      })),
      config: { systemInstruction, temperature: 0.7 }
    });

    return response.text || "Je n'ai pas pu analyser tes données pour le moment.";
  } catch (error: any) {
    console.error("Coach API Error:", error);
    return "Connexion momentanément indisponible. Vérifiez votre quota d'API gratuite.";
  }
};
