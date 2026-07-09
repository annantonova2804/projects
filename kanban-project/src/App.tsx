import { Board } from "./components/Board";

export function App() {
  return (
    <div className="min-h-screen bg-[#0D0E12] text-[#E8EAED]">
      <header className="px-8 pt-8 pb-6 border-b border-[#1F2028]">
        <p className="text-xs font-semibold tracking-widest text-[#6366F1] uppercase mb-1">
          Single Board Kanban
        </p>
        <h1 className="text-3xl font-bold text-[#E8EAED] mb-2">Kanban Studio</h1>
        <p className="text-sm text-[#6B6F80] max-w-md">
          Keep momentum visible. Drag cards between stages and capture quick notes without getting buried in settings.
        </p>
      </header>
      <Board />
    </div>
  );
}
