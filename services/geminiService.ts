import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

// Initialize Gemini Client
// Note: In a production app, API keys should be handled via backend proxy.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper for retry logic with exponential backoff
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    // Check if error is 429 (Resource Exhausted) or 503 (Service Unavailable)
    const isRetryable = error?.status === 429 || error?.status === 503;
    
    if (retries > 0 && isRetryable) {
      console.warn(`Gemini API Error (${error.status || 'Unknown'}). Retrying in ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const analyzeMealImage = async (base64Image: string): Promise<{ name: string; calories: number; macros: { p: number; c: number; f: number } }> => {
  try {
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Analyze this food image. Identify the main dish, estimate calories, and macros (protein, carbs, fats)." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            macros: {
              type: Type.OBJECT,
              properties: {
                p: { type: Type.NUMBER },
                c: { type: Type.NUMBER },
                f: { type: Type.NUMBER }
              }
            }
          }
        }
      }
    }));

    const text = response.text;
    return text ? JSON.parse(text) : { name: "Non identifié", calories: 0, macros: { p: 0, c: 0, f: 0 } };
  } catch (error: any) {
    if (error?.status === 429) {
        console.warn("Gemini Quota Exceeded (Meal Analysis).");
        return { name: "Quota IA atteint", calories: 0, macros: { p: 0, c: 0, f: 0 } };
    }
    console.error("AI Meal Analysis Failed:", error);
    return { name: "Erreur analyse", calories: 0, macros: { p: 0, c: 0, f: 0 } };
  }
};

export const getDailyRecommendations = async (contextData: string): Promise<string> => {
  try {
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this user health data, give 3 concise, motivating recommendations formatted as a bulleted list: ${contextData}`,
      config: {
        maxOutputTokens: 200,
        temperature: 0.7
      }
    }));
    return response.text || "Continuez vos efforts pour rester en bonne santé !";
  } catch (error: any) {
    if (error?.status === 429) {
        console.warn("Gemini Quota Exceeded (Recommendations).");
        return "Limite d'utilisation IA atteinte pour aujourd'hui. Continuez vos efforts !";
    }
    console.error("AI Recommendations Failed:", error);
    return "L'IA se repose un instant. Buvez de l'eau !";
  }
};

export const getSleepAnalysis = async (sleepData: any): Promise<string> => {
    try {
        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyze this sleep data and give one specific improvement tip: ${JSON.stringify(sleepData)}`,
        }));
        return response.text || "Dormez dans une pièce fraîche et sombre.";
    } catch (error: any) {
        if (error?.status === 429) return "Analyse sommeil indisponible (Quota atteint).";
        return "Pas de données suffisantes pour l'analyse.";
    }
}

export const generateWorkoutPlan = async (equipment: string[], type: string): Promise<any> => {
  try {
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a comprehensive ${type} workout program using ONLY this equipment: ${equipment.join(', ')}. 
      Structure it with warm-up (if needed included in first block), and main exercises. 
      Return structured JSON.`,
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
                  type: { type: Type.STRING, enum: ["SINGLE", "SUPERSET"] },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        sets: { type: Type.NUMBER },
                        reps: { type: Type.NUMBER },
                        weight: { type: Type.NUMBER },
                        restSeconds: { type: Type.NUMBER }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }));
    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    if (error?.status === 429) {
        console.warn("Gemini Quota Exceeded (Workout Gen).");
        return null; // The UI should handle null to show an error or fallback
    }
    console.error("AI Workout Generation Failed:", error);
    return null;
  }
};