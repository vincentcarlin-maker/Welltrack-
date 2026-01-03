
import { GoogleGenAI, Type } from "@google/genai";

/**
 * WellTrack Logic Service - Version Gratuite (Gemini 3 Flash)
 */

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") return null;
  return new GoogleGenAI({ apiKey });
};

export const analyzeMealImage = async (base64Image: string): Promise<{ name: string; calories: number; macros: { p: number; c: number; f: number } }> => {
  const ai = getAiClient();
  if (!ai) throw new Error("Clé API manquante. Configurez API_KEY dans GitHub Secrets.");

  const base64Data = base64Image.split(',')[1] || base64Image;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Modèle performant et gratuit
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
          { text: "Analyse ce repas. Donne le nom, calories, protéines, glucides, lipides. Réponds en JSON : {name, calories, protein, carbs, fats}." },
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
  } catch (error) {
    console.error("Erreur Scan:", error);
    throw error;
  }
};

export const getDailyRecommendations = async (contextData: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Clé API non configurée. (Vérifiez les Secrets GitHub)";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Donne un conseil de santé court (max 15 mots) pour : ${contextData}`,
    });
    return response.text || "Restez actif !";
  } catch (error) {
    return "La régularité est votre meilleure alliée.";
  }
};

export const generateWorkoutPlan = async (equipment: string[], type: string): Promise<any> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Flash est suffisant pour des programmes
      contents: `Programme ${type} avec : ${equipment.join(', ')}. Format JSON {name, blocks: [{type, exercises: [{name, sets, reps, weight, restSeconds}]}]}.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "null");
  } catch (error) {
    return null;
  }
};

export const generateAvatarBase = async (): Promise<string | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Modèle d'image pour la version gratuite
      contents: {
        parts: [{ text: 'Full body muscular anatomy, blue cyan glowing scan, dark background, 4k.' }],
      },
      config: { imageConfig: { aspectRatio: "9:16" } }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    return part ? `data:image/png;base64,${part.inlineData.data}` : null;
  } catch (error) {
    return null;
  }
};
