import { useStore } from './logic/useStore';
import Dashboard from './components/Profile/Dashboard';
import EmotionalNavigator from './components/EmotionalNavigator/EmotionalNavigator';
import SensoryCheckIn from './components/SensoryCheckIn/SensoryCheckIn';
import Discoveries from './components/Discoveries/Discoveries';
import Recommendations from './components/Recommendations/Recommendations';
import PatternEngine from './components/PatternEngine/PatternEngine';
import CognitiveInsight from './components/CognitiveInsight/CognitiveInsight';
import SPARKAssessment from './components/SPARK/SPARKAssessment';
import SPARKResults from './components/SPARK/SPARKResults';
import Settings from './components/Settings/Settings';
import Landing from './components/Landing/Landing';
import Onboarding from './components/Profile/Onboarding';
import Navbar from './components/Profile/Navbar';

const MODULES = {
  dashboard: Dashboard,
  emotional: EmotionalNavigator,
  sensory: SensoryCheckIn,
  discoveries: Discoveries,
  recommendations: Recommendations,
  patterns: PatternEngine,
  insight: CognitiveInsight,
  spark: SPARKAssessment,
  sparkResults: SPARKResults,
  settings: Settings,
  landing: Landing,
};

export default function App() {
  const activeModule = useStore((s) => s.activeModule);
  const showOnboarding = useStore((s) => s.showOnboarding);
  const profile = useStore((s) => s.profile);

  if (showOnboarding) return <Onboarding />;

  // Show landing page if user hasn't completed onboarding
  if (!profile.cognitiveStyle) {
    return <Landing />;
  }

  const ModuleComponent = MODULES[activeModule] || Dashboard;

  return (
    <div className="min-h-screen bg-arcane-dark">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <ModuleComponent />
      </main>
    </div>
  );
}
