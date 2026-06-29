import { useState } from "react";

interface Props {
  onAdd: (title: string) => void;
}

export function AddCard({ onAdd }: Props) {
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState("");

  const submit = () => {
    const trimmed = title.trim();
    if (trimmed) onAdd(trimmed);
    setTitle("");
    setActive(false);
  };

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="mt-2 w-full text-left px-2 py-1.5 text-sm text-[#5E6C84] hover:text-[#172B4D] hover:bg-[#DFE1E6] rounded transition-colors"
      >
        + Add a card
      </button>
    );
  }

  return (
    <div className="mt-2">
      <textarea
        autoFocus
        rows={2}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
          if (e.key === "Escape") { setTitle(""); setActive(false); }
        }}
        placeholder="Card title"
        className="w-full px-2 py-1.5 text-sm text-[#172B4D] bg-white border border-[#0052CC] rounded resize-none outline-none"
      />
      <div className="flex gap-2 mt-1">
        <button
          onClick={submit}
          className="px-3 py-1 text-sm text-white bg-[#0052CC] rounded hover:bg-[#0747A6] transition-colors"
        >
          Add
        </button>
        <button
          onClick={() => { setTitle(""); setActive(false); }}
          className="px-3 py-1 text-sm text-[#5E6C84] hover:text-[#172B4D] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
