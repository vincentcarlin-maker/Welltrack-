
import { useState, useEffect } from 'react';
import { UserProfile, ActivityLog, Meal, SleepLog, Supplement, JournalEntry, WorkoutProgram } from '../types';

const STORAGE_KEYS = {
  USER: 'welltrack_user',
  ACTIVITIES: 'welltrack_activities',
  PROGRAMS: 'welltrack_programs',
  MEALS: 'welltrack_meals',
  SLEEP: 'welltrack_sleep',
  SUPPLEMENTS: 'welltrack_supplements',
  JOURNAL: 'welltrack_journal',
  STEPS: 'welltrack_steps'
};

const DEFAULT_USER: UserProfile = {
  name: "Nouvel Utilisateur",
  age: 25,
  weight: 70,
  height: 175,
  gender: 'M',
  points: 0,
  level: 1,
  badges: [],
  availableEquipment: ['Poids du corps']
};

export const useAppData = () => {
  const load = <T>(key: string, defaultValue: T): T => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [user, setUser] = useState<UserProfile>(() => load(STORAGE_KEYS.USER, DEFAULT_USER));
  const [activities, setActivities] = useState<ActivityLog[]>(() => load(STORAGE_KEYS.ACTIVITIES, []));
  const [programs, setPrograms] = useState<WorkoutProgram[]>(() => load(STORAGE_KEYS.PROGRAMS, []));
  const [meals, setMeals] = useState<Meal[]>(() => load(STORAGE_KEYS.MEALS, []));
  const [sleepHistory, setSleepHistory] = useState<SleepLog[]>(() => load(STORAGE_KEYS.SLEEP, []));
  const [supplements, setSupplements] = useState<Supplement[]>(() => load(STORAGE_KEYS.SUPPLEMENTS, [
    { id: '1', name: 'Multivitamines', taken: false, time: '08:00' },
    { id: '2', name: 'Oméga-3', taken: false, time: '12:00' },
    { id: '3', name: 'Magnésium', taken: false, time: '21:00' }
  ]));
  const [journal, setJournal] = useState<JournalEntry[]>(() => load(STORAGE_KEYS.JOURNAL, []));
  const [dailySteps, setDailySteps] = useState<number>(() => load(STORAGE_KEYS.STEPS, 0));
  const [isHealthConnected, setIsHealthConnected] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities)); }, [activities]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs)); }, [programs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals)); }, [meals]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SLEEP, JSON.stringify(sleepHistory)); }, [sleepHistory]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SUPPLEMENTS, JSON.stringify(supplements)); }, [supplements]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(journal)); }, [journal]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.STEPS, JSON.stringify(dailySteps)); }, [dailySteps]);

  const dailyCalories = meals
    .filter(m => new Date(m.timestamp).toDateString() === new Date().toDateString())
    .reduce((acc, meal) => acc + meal.calories, 0);
  
  const dailySleep = sleepHistory.length > 0 ? sleepHistory[sleepHistory.length - 1] : null;

  const updateUser = (updatedData: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const addMeal = (meal: Meal) => {
    setMeals(prev => [meal, ...prev]);
    setUser(prev => ({ ...prev, points: prev.points + 10 })); 
  };

  const addActivity = (activity: ActivityLog) => {
    setActivities(prev => [activity, ...prev]);
    setUser(prev => ({ ...prev, points: prev.points + 25 }));
  };

  const addProgram = (program: WorkoutProgram) => {
    setPrograms(prev => [...prev, program]);
  };

  const updateProgram = (id: string, updates: Partial<WorkoutProgram>) => {
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProgram = (id: string) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
  };

  const toggleSupplement = (id: string) => {
    setSupplements(prev => prev.map(s => s.id === id ? { ...s, taken: !s.taken } : s));
  };

  const addJournalEntry = (entry: JournalEntry) => {
    setJournal(prev => [entry, ...prev]);
    setUser(prev => ({ ...prev, points: prev.points + 15 }));
  };

  const syncHealthData = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newSteps = dailySteps + Math.floor(Math.random() * 5000) + 2000;
    setDailySteps(newSteps); 
    setIsHealthConnected(true);
    setUser(prev => ({ ...prev, points: prev.points + 50 })); 
  };

  return {
    user, activities, programs, meals, sleepHistory, supplements, journal,
    stats: { dailyCalories, dailySteps, dailySleep, isHealthConnected },
    actions: { updateUser, addMeal, addActivity, addProgram, updateProgram, deleteProgram, toggleSupplement, addJournalEntry, syncHealthData }
  };
};
