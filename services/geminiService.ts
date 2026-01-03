
import { GoogleGenAI, Type } from "@google/genai";

/**
 * WellTrack Logic Service - Version Gratuite avec gestion de Quota
 */

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") return null;
  return new GoogleGenAI({ apiKey });
};

/**
 * Utilitaire pour retenter une fonction en cas d'erreur 429 (Quota)
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error.message?.includes("429") || error.status === 429 || error.message?.includes("RESOURCE_EXHAUSTED"))) {
      console.warn(`Quota atteint. Nouvelle tentative dans ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const analyzeMealImage = async (base64Image: string): Promise<{ name: string; calories: number; macros: { p: number; c: number; f: number } }> => {
  const ai = getAiClient();
  if (!ai) throw new Error("Clé API manquante dans GitHub Secrets.");

  const base64Data = base64Image.split(',')[1] || base64Image;

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
          { text: "Analyse ce repas. Donne le nom, calories, protéines, glucides, lipides. Réponds UNIQUEMENT en JSON : {name, calories, protein, carbs, fats}." },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fats: { type: Type.NUMBER },
          },
          required: ["name", "calories", "protein", "carbs", "fats"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return {
      name: data.name || "Plat analysé",
      calories: data.calories || 0,
      macros: { p: data.protein || 0, c: data.carbs || 0, f: data.fats || 0 }
    };
  });
};

export const getDailyRecommendations = async (contextData: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "IA en attente de configuration.";

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Donne un conseil de santé court (max 12 mots) pour : ${contextData}`,
    });
    return response.text || "Restez actif !";
  });
};

export const generateWorkoutPlan = async (equipment: string[], type: string): Promise<any> => {
  const ai = getAiClient();
  if (!ai) return null;

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Programme ${type} avec : ${equipment.join(', ')}. Format JSON {name, blocks: [{type, exercises: [{name, sets, reps, weight, restSeconds}]}]}.`,
      config: { responseMimeType: "application/json" }
    });
    return response.text ? JSON.parse(response.text) : null;
  });
};

export const generateAvatarBase = async (): Promise<string | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: 'Anatomical body scan, futuristic blue glowing fibers, dark background.' }],
      },
      config: { imageConfig: { aspectRatio: "9:16" } }
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  });
};
