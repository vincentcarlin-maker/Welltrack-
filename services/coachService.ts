
import { GoogleGenAI } from "@google/genai";
import { UserProfile, ActivityLog, Meal, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCoachResponse = async (
  messages: ChatMessage[],
  context: {
    user: UserProfile;
    lastActivity?: ActivityLog;
    dailyCalories: number;
    hydration: number;
  }
) => {
  const { user, lastActivity, dailyCalories, hydration } = context;
  
  const systemInstruction = `Tu es le Coach WellTrack, un expert en musculation, science du sport et nutrition.
Ta personnalité : motivant, professionnel, direct et basé sur les preuves scientifiques.
Contexte utilisateur :
- Nom : ${user.name}, Poids : ${user.weight}kg, Niveau : ${user.level}
- Hydratation : ${hydration}ml (Objectif : ${user.hydrationGoal}ml)
- Calories du jour : ${dailyCalories}kcal
- Dernière activité : ${lastActivity ? `${lastActivity.type} (${lastActivity.durationMinutes}min)` : 'Aucune aujourd\'hui'}

Règles :
1. Donne des conseils exploitables et courts.
2. Si l'utilisateur a un RPE élevé (>9), suggère le repos ou le deload.
3. Encourage la consommation de protéines et l'hydratation.
4. Ne donne pas de diagnostic médical, suggère de consulter si douleur suspecte.
5. Utilise le "tu" pour créer une proximité de coaching.`;

  const history = messages.map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      })),
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "Désolé, j'ai eu une petite défaillance technique. On reprend ?";
  } catch (error) {
    console.error("Coach API Error:", error);
    return "Je n'arrive pas à me connecter au serveur de performance. Vérifie ta connexion !";
  }
};
