
export enum ViewState {
  HOME = 'HOME',
  ACTIVITY = 'ACTIVITY',
  SLEEP = 'SLEEP',
  NUTRITION = 'NUTRITION',
  SUPPLEMENTS = 'SUPPLEMENTS',
  JOURNAL = 'JOURNAL',
  GAMIFICATION = 'GAMIFICATION',
  RECOMMENDATIONS = 'RECOMMENDATIONS',
  PROFILE = 'PROFILE',
  COACH = 'COACH',
  ADMIN = 'ADMIN'
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number; 
  height: number; 
  gender: 'M' | 'F';
  points: number;
  level: number;
  badges: string[];
  availableEquipment: string[];
  hydrationGoal: number; // in ml
}

export interface ExerciseDetail {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  restSeconds: number;
  rpe?: number; 
  durationSeconds?: number;
  isCompleted?: boolean;
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
  imageUrl?: string; 
  lastPerformed?: string; 
  scheduledDay?: string; 
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
  qualityScore: number; 
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
  mood: number; 
  energy: number; 
  notes: string;
}

export interface ProgressionRecommendation {
  text: string;
  action: 'INCREASE_LOAD' | 'INCREASE_REPS' | 'INCREASE_SETS' | 'DELOAD' | 'MAINTAIN';
  explanation: string;
  suggestedValue?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
