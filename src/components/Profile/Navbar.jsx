import { useStore } from '../../logic/useStore';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Map', icon: '◈' },
  { id: 'emotional', label: 'Emotional', icon: '◉' },
  { id: 'sensory', label: 'Sensory', icon: '◎' },
  { id: 'discoveries', label: 'Discoveries', icon: '✧' },
  { id: 'patterns', label: 'Patterns', icon: '⬡' },
  { id: 'insight', label: 'Insight', icon: '◬' },
  { id: 'recommendations', label: 'Guidance', icon: '⟐' },
  { id: 'spark', label: 'SPARK', icon: '◇' },
  { id: 'sparkResults', label: 'Results', icon: '★' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function Navbar() {
  const activeModule = useStore((s) => s.activeModule);
  const setActiveModule = useStore((s) => s.setActiveModule);
  const currentState = useStore((s) => s.cognitiveState.current);

  return (
    <nav className="bg-arcane-muted/80 backdrop-blur-sm border-b border-indigo-900/20 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">◈</span>
          <span className="text-indigo-300 font-medium text-sm">ND Cognitive OS</span>
          <span className="text-xs text-indigo-500/60 ml-2 px-2 py-0.5 rounded-full bg-indigo-900/20">
            {currentState}
          </span>
        </div>
        <div className="flex gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                activeModule === item.id
                  ? 'bg-indigo-600/30 text-indigo-200'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-indigo-900/20'
              }`}
            >
              <span className="mr-1">{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
