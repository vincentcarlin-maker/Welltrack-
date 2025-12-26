import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DashboardView } from './features/DashboardView';
import { ActivityView } from './features/ActivityView';
import { NutritionView } from './features/NutritionView';
import { SleepView } from './features/SleepView';
import { GamificationView } from './features/GamificationView';
import { ProfileView } from './features/ProfileView';
import { COM_Complements } from './features/complements/COM_Complements';
import { JOU_Journal } from './features/journal/JOU_Journal';
import { REC_Recommandations } from './features/recommendations/REC_Recommandations';
import { useAppData } from './hooks/useAppData';
import { ViewState } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<ViewState>(ViewState.HOME);
  const { user, stats, activities, meals, sleepHistory, supplements, actions } = useAppData();

  const renderContent = () => {
    switch (activeView) {
      case ViewState.HOME:
        return <DashboardView 
            user={user} 
            stats={stats} 
            onChangeView={setActiveView} 
            onSyncHealth={actions.syncHealthData}
        />;
      case ViewState.ACTIVITY:
        return <ActivityView activities={activities} dailySteps={stats.dailySteps} addActivity={actions.addActivity} />;
      case ViewState.SLEEP:
        return <SleepView sleepHistory={sleepHistory} />;
      case ViewState.NUTRITION:
        return <NutritionView meals={meals} dailyCalories={stats.dailyCalories} addMeal={actions.addMeal} />;
      case ViewState.SUPPLEMENTS:
        return <COM_Complements supplements={supplements} onToggle={actions.toggleSupplement} onBack={() => setActiveView(ViewState.HOME)} />;
      case ViewState.GAMIFICATION:
        return <GamificationView user={user} />;
      case ViewState.PROFILE:
        return <ProfileView user={user} onUpdate={actions.updateUser} />;
      case ViewState.JOURNAL:
        return <JOU_Journal onSave={(entry) => { actions.addJournalEntry(entry); setActiveView(ViewState.HOME); }} onCancel={() => setActiveView(ViewState.HOME)} />;
      case ViewState.RECOMMENDATIONS:
        return <REC_Recommandations stats={stats} onBack={() => setActiveView(ViewState.HOME)} />;
      default:
        return <DashboardView user={user} stats={stats} onChangeView={setActiveView} onSyncHealth={actions.syncHealthData} />;
    }
  };

  return (
    <Layout activeView={activeView} onChangeView={setActiveView}>
      {renderContent()}
    </Layout>
  );
}