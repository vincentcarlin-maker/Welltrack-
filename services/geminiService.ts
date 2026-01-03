
import { GoogleGenAI, Type } from "@google/genai";

/**
 * WellTrack Logic Service
 * Intègre l'IA Google Gemini pour les fonctionnalités avancées.
 */

// Utilisation directe de process.env.API_KEY comme requis
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") return null;
  return new GoogleGenAI({ apiKey });
};

/**
 * Analyse une image de repas pour extraire le nom et les macros
 */
export const analyzeMealImage = async (base64Image: string): Promise<{ name: string; calories: number; macros: { p: number; c: number; f: number } }> => {
  const ai = getAiClient();
  if (!ai) throw new Error("API Key non configurée");

  // Nettoyage du préfixe base64 si présent
  const base64Data = base64Image.split(',')[1] || base64Image;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data,
            },
          },
          {
            text: "Analyse ce repas. Donne le nom du plat, une estimation des calories totales, et les macronutriments (protéines, glucides, lipides en grammes). Réponds uniquement en JSON avec les clés : name, calories, protein, carbs, fats.",
          },
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
    console.error("Erreur analyse repas:", error);
    return { name: "Erreur analyse", calories: 0, macros: { p: 0, c: 0, f: 0 } };
  }
};

/**
 * Récupère des recommandations quotidiennes basées sur les stats
 */
export const getDailyRecommendations = async (contextData: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Connectez-vous pour des conseils personnalisés.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `En tant que coach expert WellTrack, donne-moi un seul conseil de santé court, percutant et motivant basé sur ce contexte : ${contextData}. Ne dépasse pas 20 mots.`,
    });
    return response.text || "Restez hydraté et régulier !";
  } catch (error) {
    return "La régularité est la clé du succès.";
  }
};

/**
 * Génère un programme d'entraînement structuré
 */
export const generateWorkoutPlan = async (equipment: string[], type: string): Promise<any> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Crée un programme de musculation de type ${type} en utilisant uniquement ce matériel : ${equipment.join(', ')}.
      Inclus 4 exercices. Pour chaque exercice, précise : nom, séries, répétitions, poids (0 si pdc), et repos.
      Format de réponse : JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            blocks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        sets: { type: Type.NUMBER },
                        reps: { type: Type.NUMBER },
                        weight: { type: Type.NUMBER },
                        restSeconds: { type: Type.NUMBER },
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "null");
  } catch (error) {
    console.error("Erreur génération programme:", error);
    return null;
  }
};

/**
 * Génère un avatar 3D via Gemini Image Generation
 */
export const generateAvatarBase = async (): Promise<string | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'Detailed full body muscular anatomy chart, front view, futuristic medical scan style, glowing bio-luminescent cyan muscle fibers on deep dark background, hyper-realistic, high quality, symmetric pose.',
          },
        ],
      },
      config: {
        imageConfig: { aspectRatio: "9:16" }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Erreur Génération Avatar:", error);
    return null;
  }
};
