import { useState, useEffect } from 'react';
import { UserProfile, ActivityLog, Meal, SleepLog, Supplement, JournalEntry, WorkoutProgram } from '../types';

// Mock Initial Data
const INITIAL_USER: UserProfile = {
  name: "Alex",
  age: 28,
  weight: 70,
  height: 175,
  gender: 'M',
  points: 1250,
  level: 5,
  badges: ["Lève-tôt", "Marathonien", "Gourmet Healthy"],
  availableEquipment: ['Poids du corps', 'Haltères', 'Barre', 'Banc', 'Poulie', 'Machines']
};

const INITIAL_PROGRAMS: WorkoutProgram[] = [
  {
    id: '1',
    name: 'PPL A (Push)',
    programType: 'PUSH',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80',
    lastPerformed: 'Il y a 2 jours',
    blocks: [
      {
        id: 'b1',
        type: 'SINGLE',
        exercises: [{ name: 'Développé Couché', sets: 4, reps: 10, weight: 60, restSeconds: 90 }]
      },
      {
        id: 'b2',
        type: 'SINGLE',
        exercises: [{ name: 'Développé Militaire', sets: 4, reps: 10, weight: 40, restSeconds: 90 }]
      }
    ]
  },
  {
    id: '2',
    name: 'Dos & Biceps',
    programType: 'PULL',
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=500&q=80',
    blocks: [
      {
        id: 'b1',
        type: 'SUPERSET',
        exercises: [
           { name: 'Tractions', sets: 3, reps: 10, weight: 0, restSeconds: 90 },
           { name: 'Rowing Barre', sets: 3, reps: 12, weight: 50, restSeconds: 90 }
        ]
      }
    ]
  }
];

const INITIAL_ACTIVITIES: ActivityLog[] = [
  { id: '1', type: 'Marche', durationMinutes: 30, calories: 150, date: new Date().toISOString() },
  { id: '2', type: 'Yoga', durationMinutes: 45, calories: 200, date: new Date().toISOString() }
];

const INITIAL_MEALS: Meal[] = [
  { id: '1', name: 'Avoine & Whey', category: 'Petit-déjeuner', calories: 450, protein: 30, carbs: 55, fats: 8, timestamp: new Date().toISOString() },
  { id: '2', name: 'Poulet Riz Brocolis', category: 'Déjeuner', calories: 600, protein: 45, carbs: 70, fats: 12, timestamp: new Date().toISOString() }
];

const INITIAL_SLEEP: SleepLog[] = [
  { date: '2023-10-26', durationHours: 7.5, qualityScore: 85, deepSleepMinutes: 120 },
  { date: '2023-10-27', durationHours: 6.2, qualityScore: 65, deepSleepMinutes: 90 },
  { date: '2023-10-28', durationHours: 8.0, qualityScore: 92, deepSleepMinutes: 140 },
];

const INITIAL_SUPPLEMENTS: Supplement[] = [
  { id: '1', name: 'Vitamine D', taken: true, time: '08:00' },
  { id: '2', name: 'Magnésium', taken: false, time: '22:00' },
  { id: '3', name: 'Oméga-3', taken: true, time: '12:30' }
];

export const useAppData = () => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [activities, setActivities] = useState<ActivityLog[]>(INITIAL_ACTIVITIES);
  const [programs, setPrograms] = useState<WorkoutProgram[]>(INITIAL_PROGRAMS);
  const [meals, setMeals] = useState<Meal[]>(INITIAL_MEALS);
  const [sleepHistory, setSleepHistory] = useState<SleepLog[]>(INITIAL_SLEEP);
  const [supplements, setSupplements] = useState<Supplement[]>(INITIAL_SUPPLEMENTS);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [dailySteps, setDailySteps] = useState(4532);
  const [isHealthConnected, setIsHealthConnected] = useState(false);

  // Computed properties
  const dailyCalories = meals.reduce((acc, meal) => acc + meal.calories, 0);
  const dailySleep = sleepHistory[sleepHistory.length - 1];

  const updateUser = (updatedData: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const addMeal = (meal: Meal) => {
    setMeals(prev => [...prev, meal]);
    setUser(prev => ({ ...prev, points: prev.points + 10 })); 
  };

  const addActivity = (activity: ActivityLog) => {
    setActivities(prev => [...prev, activity]);
    setUser(prev => ({ ...prev, points: prev.points + 25 }));
  };

  const addProgram = (program: WorkoutProgram) => {
    setPrograms(prev => [...prev, program]);
  };

  const deleteProgram = (id: string) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
  };

  const toggleSupplement = (id: string) => {
    setSupplements(prev => prev.map(s => s.id === id ? { ...s, taken: !s.taken } : s));
  };

  const addJournalEntry = (entry: JournalEntry) => {
    setJournal(prev => [...prev, entry]);
    setUser(prev => ({ ...prev, points: prev.points + 15 }));
  };

  const syncHealthData = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    setDailySteps(12453); 
    setActivities(prev => [
        ...prev,
        { id: 'health-kit-1', type: 'Marche (Apple Santé)', durationMinutes: 42, calories: 185, date: new Date().toISOString() }
    ]);
    setIsHealthConnected(true);
    setUser(prev => ({ ...prev, points: prev.points + 50 })); 
  };

  return {
    user, activities, programs, meals, sleepHistory, supplements, journal,
    stats: { dailyCalories, dailySteps, dailySleep, isHealthConnected },
    actions: { updateUser, addMeal, addActivity, addProgram, deleteProgram, toggleSupplement, addJournalEntry, syncHealthData }
  };
};