
import { ActivityLog, WorkoutBlock, ExerciseDetail } from '../types';

export interface GraphDataPoint {
  date: string;
  load: number;
  volume: number;
  rpe: number;
  reps: number;
  isDeload: boolean;
}

export interface ProgressionInsight {
  status: 'PROGRESSION' | 'STAGNATION' | 'REGRESSION' | 'DELOAD';
  message: string;
}

export const getExerciseProgressionData = (
  exerciseName: string,
  history: ActivityLog[]
): GraphDataPoint[] => {
  return history
    .filter(log => log.blocks?.some(b => b.exercises.some(e => e.name === exerciseName)))
    .map(log => {
      const exData = log.blocks!
        .flatMap(b => b.exercises)
        .filter(e => e.name === exerciseName);
      
      const avgLoad = exData.reduce((acc, e) => acc + e.weight, 0) / exData.length;
      const totalVolume = exData.reduce((acc, e) => acc + (e.weight * e.reps * e.sets), 0);
      const avgRpe = exData.reduce((acc, e) => acc + (e.rpe || 0), 0) / exData.length;
      const avgReps = exData.reduce((acc, e) => acc + e.reps, 0) / exData.length;

      return {
        date: new Date(log.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        load: parseFloat(avgLoad.toFixed(1)),
        volume: totalVolume,
        rpe: parseFloat(avgRpe.toFixed(1)),
        reps: parseFloat(avgReps.toFixed(1)),
        isDeload: false // Sera calculé par l'insight
      };
    })
    .reverse();
};

export const analyzeTrend = (data: GraphDataPoint[]): ProgressionInsight => {
  if (data.length < 3) return { status: 'STAGNATION', message: "Données insuffisantes pour une analyse de tendance." };

  const last = data[data.length - 1];
  const prev = data[data.length - 2];
  const first = data[data.length - 3];

  // Détection Deload (Baisse volontaire > 15%)
  if (last.load < prev.load * 0.85) {
    return { status: 'DELOAD', message: "Phase de récupération (deload) détectée pour consolider les acquis." };
  }

  // Progression de charge
  if (last.load > prev.load) {
    return { status: 'PROGRESSION', message: "Surcharge progressive appliquée avec succès sur la charge." };
  }

  // Plateau / Stagnation (Charge identique sur 3 séances)
  if (last.load === prev.load && prev.load === first.load) {
    if (last.reps > prev.reps) {
      return { status: 'PROGRESSION', message: "Progression de volume détectée malgré une charge stable." };
    }
    return { status: 'STAGNATION', message: "Plateau détecté. Envisagez une variation d'intensité ou de tempo." };
  }

  if (last.load < prev.load) {
    return { status: 'REGRESSION', message: "Baisse de performance notée. Vérifiez votre sommeil et nutrition." };
  }

  return { status: 'STAGNATION', message: "Performance stable. Focus sur la qualité d'exécution." };
};
