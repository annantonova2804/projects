import { Board } from "./components/Board";

export function App() {
  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <header className="px-6 py-4 border-b border-[#DFE1E6] bg-white">
        <h1 className="text-lg font-semibold text-[#172B4D]">Kanban Board</h1>
      </header>
      <Board />
    </div>
  );
}
