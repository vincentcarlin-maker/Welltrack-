
import { ActivityLog, ProgressionRecommendation } from '../types';

/**
 * Service de Progression Intelligente WellTrack
 * Analyse l'historique d'entraînement pour suggérer des adaptations basées sur le RPE.
 */

export const getSmartProgression = (
  exerciseName: string, 
  history: ActivityLog[]
): ProgressionRecommendation => {
  // Filtrer les logs pour cet exercice spécifique
  const exerciseHistory = history
    .filter(log => log.blocks?.some(b => b.exercises.some(e => e.name === exerciseName)))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  if (exerciseHistory.length === 0) {
    return {
      text: "Première séance",
      action: 'MAINTAIN',
      explanation: "Établissez votre base de référence aujourd'hui."
    };
  }

  const lastSession = exerciseHistory[0];
  const lastPerf = lastSession.blocks?.flatMap(b => b.exercises).find(e => e.name === exerciseName);

  if (!lastPerf || lastPerf.rpe === undefined) {
    return {
      text: "Continuez l'effort",
      action: 'MAINTAIN',
      explanation: "Renseignez votre RPE pour une analyse intelligente."
    };
  }

  const rpe = lastPerf.rpe;

  // LOGIQUE DE PROGRESSION
  
  // 1. Surmenage détecté (RPE très élevé répétitivement)
  if (rpe >= 9.5) {
    return {
      text: "Récupération nécessaire (Deload)",
      action: 'DELOAD',
      explanation: "L'intensité était trop proche de l'échec. Réduisez la charge de 10% pour consolider la technique.",
      suggestedValue: lastPerf.weight * 0.9
    };
  }

  // 2. Progression de Charge (RPE facile à modéré)
  if (rpe <= 7.5) {
    return {
      text: "Augmentez la difficulté",
      action: 'INCREASE_LOAD',
      explanation: "Votre aisance suggère que vous pouvez porter plus lourd (+2.5kg) tout en restant en sécurité.",
      suggestedValue: lastPerf.weight + 2.5
    };
  }

  // 3. Progression de Volume (RPE optimal mais plateau de force)
  if (rpe >= 8 && rpe < 9) {
    // Si la charge est identique depuis 2 séances, on augmente les reps
    const prevSession = exerciseHistory[1];
    const prevPerf = prevSession?.blocks?.flatMap(b => b.exercises).find(e => e.name === exerciseName);

    if (prevPerf && prevPerf.weight === lastPerf.weight) {
      return {
        text: "Augmentez le volume",
        action: 'INCREASE_REPS',
        explanation: "Votre force est stable. Visez 1 à 2 répétitions de plus par série pour stimuler l'hypertrophie.",
        suggestedValue: lastPerf.reps + 1
      };
    }
  }

  // 4. Maintien technique
  return {
    text: "Maintenez la charge",
    action: 'MAINTAIN',
    explanation: "Votre RPE est dans la zone cible. Concentrez-vous sur une exécution parfaite."
  };
};
