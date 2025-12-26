
/**
 * WellTrack Local Logic Service
 * Ce service remplace l'IA Gemini par des algorithmes de conseils locaux.
 */

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
  // Simulation locale sans API
  return { 
    name: "Plat analysé localement", 
    calories: 450, 
    macros: { p: 25, c: 50, f: 15 } 
  };
};

export const getDailyRecommendations = async (contextData: string): Promise<string> => {
  // Retourne un conseil aléatoire parmi la liste locale
  const randomIndex = Math.floor(Math.random() * TIPS.length);
  return TIPS[randomIndex];
};

export const getSleepAnalysis = async (sleepData: any): Promise<string> => {
  if (!sleepData) return "Dormez dans une pièce fraîche et sombre.";
  if (sleepData.durationHours < 6) return "Votre durée de sommeil est courte. Priorisez une sieste de 20min.";
  if (sleepData.qualityScore > 80) return "Excellente qualité. Maintenez vos rituels de coucher.";
  return "Améliorez votre environnement pour augmenter le score de qualité.";
};

export const generateWorkoutPlan = async (equipment: string[], type: string): Promise<any> => {
  // Retourne un programme de base prédéfini localement
  return {
    name: `Programme ${type} (Local)`,
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
