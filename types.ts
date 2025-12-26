
export enum ViewState {
  HOME = 'HOME',
  ACTIVITY = 'ACTIVITY',
  SLEEP = 'SLEEP',
  NUTRITION = 'NUTRITION',
  SUPPLEMENTS = 'SUPPLEMENTS',
  JOURNAL = 'JOURNAL',
  GAMIFICATION = 'GAMIFICATION',
  RECOMMENDATIONS = 'RECOMMENDATIONS',
  PROFILE = 'PROFILE'
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: 'M' | 'F';
  points: number;
  level: number;
  badges: string[];
  availableEquipment: string[];
}

export interface ExerciseDetail {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  restSeconds: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

export interface WorkoutBlock {
  id: string;
  type: 'SINGLE' | 'SUPERSET'; 
  exercises: ExerciseDetail[];
}

export type ProgramType = 'PUSH' | 'PULL' | 'LEGS' | 'FULL_BODY' | 'CUSTOM';

export interface WorkoutProgram {
  id: string;
  name: string;
  programType: ProgramType;
  blocks: WorkoutBlock[];
  imageUrl?: string; // Nouveau: Image de fond pour la carte
  lastPerformed?: string; // Nouveau: Date de dernière réalisation
  scheduledDay?: string; // Nouveau: Jour de la semaine prévu (ex: 'Lundi')
}

export interface ActivityLog {
  id: string;
  type: string;
  durationMinutes: number;
  calories: number;
  date: string;
  blocks?: WorkoutBlock[];
}

export type MealCategory = 'Petit-déjeuner' | 'Déjeuner' | 'Dîner' | 'Collation';

export interface Meal {
  id: string;
  name: string;
  category: MealCategory;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: string;
  imageUrl?: string;
}

export interface SleepLog {
  date: string;
  durationHours: number;
  qualityScore: number; // 0-100
  deepSleepMinutes: number;
}

export interface Supplement {
  id: string;
  name: string;
  taken: boolean;
  time: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: number; // 1-5
  energy: number; // 1-5
  notes: string;
}

export interface AIAnalysisResult {
  text: string;
  structuredData?: any;
}
