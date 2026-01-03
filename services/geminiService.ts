
import { GoogleGenAI } from "@google/genai";

/**
 * WellTrack Logic Service
 * Intègre l'IA Google Gemini & Imagen pour les fonctionnalités avancées.
 */

// Initialisation du client seulement si la clé est présente (évite crash en dev sans env)
const ai = process.env.API_KEY 
  ? new GoogleGenAI({ apiKey: process.env.API_KEY }) 
  : null;

const TIPS = [
  "Buvez au moins 2L d'eau aujourd'hui pour optimiser votre récupération.",
  "Une marche de 15 minutes après le déjeuner améliore la sensibilité à l'insuline.",
  "Le sommeil est la clé : essayez de dormir 7h30 pour une régénération cellulaire optimale.",
  "Consommez des protéines à chaque repas pour maintenir votre masse musculaire.",
  "Évitez les écrans 30 minutes avant de dormir pour une meilleure mélatonine.",
  "Variez vos sources de légumes pour un apport complet en micronutriments.",
  "La régularité bat l'intensité. Mieux vaut 3 séances courtes que 1 longue de temps en temps."
];

export const analyzeMealImage = async (base64Image: string): Promise<{ name: string; calories: number; macros: { p: number; c: number; f: number } }> => {
  // Simulation locale pour la démo instantanée
  return { 
    name: "Plat analysé (Démo)", 
    calories: 450, 
    macros: { p: 25, c: 50, f: 15 } 
  };
};

export const getDailyRecommendations = async (contextData: string): Promise<string> => {
  const randomIndex = Math.floor(Math.random() * TIPS.length);
  return TIPS[randomIndex];
};

export const generateWorkoutPlan = async (equipment: string[], type: string): Promise<any> => {
  return {
    name: `Programme ${type} (Auto)`,
    blocks: [
      {
        type: "SINGLE",
        exercises: [
          { name: "Exercice Fondamental", sets: 3, reps: 10, weight: 10, restSeconds: 60 }
        ]
      }
    ]
  };
};

/**
 * Génère un avatar 3D anatomique futuriste via Gemini Image Generation
 * Utilise gemini-2.5-flash-image pour une meilleure disponibilité que Imagen direct.
 */
export const generateAvatarBase = async (): Promise<string | null> => {
  if (!ai) {
    console.error("API Key manquante");
    return null;
  }

  try {
    // Utilisation de gemini-2.5-flash-image (via generateContent) au lieu de imagen-3.0
    // pour éviter les erreurs 404 sur les clés API standard.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A futuristic 3D wireframe anatomical human body scan silhouette, front view, dark blue void background, glowing cyan contour lines, symmetric, neutral pose, arms slightly apart, highly detailed medical sci-fi visualization, unreal engine 5 render, centered.',
          },
        ],
      },
      config: {
        // Configuration spécifique pour la génération d'image
        imageConfig: {
          aspectRatio: "9:16",
        }
      }
    });

    // L'image est retournée dans inlineData d'une des parties du contenu
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64 = part.inlineData.data;
          // Le mimeType est souvent image/png ou image/jpeg
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Erreur Génération Avatar:", error);
    return null;
  }
};
