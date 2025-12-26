import { ActivityLog } from '../../../types';

export const getProgressionRecommendation = (exerciseName: string, history: ActivityLog[]): { text: string; action: 'LOAD' | 'REPS' | 'SETS' | 'DELOAD' | 'HOLD' } => {
  // 1. Filtrer et trier l'historique pour cet exercice
  const relevantLogs = history
    .filter(log => log.blocks?.some(b => b.exercises.some(e => e.name === exerciseName)))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3); // Analyse sur les 3 dernières séances

  // Cas : Pas d'historique
  if (relevantLogs.length === 0) {
    return { text: "Nouvel exercice : Trouvez votre charge de confort.", action: 'HOLD' };
  }

  const lastSession = relevantLogs[0];
  const lastExData = lastSession.blocks?.flatMap(b => b.exercises).find(e => e.name === exerciseName);

  // Cas : Données manquantes
  if (!lastExData || typeof lastExData.rpe === 'undefined') {
    return { text: "Renseignez le RPE pour activer le coaching IA.", action: 'HOLD' };
  }

  const rpe = lastExData.rpe;
  const prevSession = relevantLogs[1];
  const prevExData = prevSession?.blocks?.flatMap(b => b.exercises).find(e => e.name === exerciseName);

  // --- LOGIQUE DE PROGRESSION (Ordre de priorité : Sécurité > Charge > Volume) ---

  // 1. Règle de Deload (Sécurité)
  if (rpe >= 9 && prevExData?.rpe && prevExData.rpe >= 9) {
    return { text: "Alerte Surmenage : Réduisez la charge (-10%) ou le volume.", action: 'DELOAD' };
  }

  // 2. Augmentation de la Charge
  if (rpe <= 7) {
    return { text: "Facile ? Augmentez la charge (+1 à 2.5kg).", action: 'LOAD' };
  }
  if (rpe === 8) {
    return { text: "Charge optimale. Tentez une petite augmentation si forme parfaite.", action: 'LOAD' };
  }

  // 3. Augmentation des Répétitions (Volume)
  // Si RPE stable (ex: 8.5) mais qu'on stagne en charge, on pousse les reps
  if (rpe <= 8.5 && prevExData && lastExData.weight === prevExData.weight) {
    return { text: "Charge stable : Visez +1 ou +2 répétitions aujourd'hui.", action: 'REPS' };
  }

  // 4. Maintien
  return { text: "Maintenez l'effort et la technique actuelle.", action: 'HOLD' };
};
