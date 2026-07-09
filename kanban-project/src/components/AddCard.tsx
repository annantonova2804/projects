import { useState } from "react";

interface Props {
  onAdd: (title: string, description: string) => void;
}

export function AddCard({ onAdd }: Props) {
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, description.trim());
    setTitle("");
    setDescription("");
    setActive(false);
  };

  const cancel = () => {
    setTitle("");
    setDescription("");
    setActive(false);
  };

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="mt-2 w-full text-left px-3 py-2 text-xs font-medium text-[#6B6F80] hover:text-[#A0A4B8] hover:bg-[#1F2028] rounded-lg transition-colors"
      >
        + Add card
      </button>
    );
  }

  return (
    <div className="mt-2 bg-[#1A1C24] border border-[#2A2D3A] rounded-lg p-3">
      <input
        autoFocus
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") cancel();
        }}
        placeholder="Card title"
        className="w-full bg-transparent text-sm text-[#E8EAED] placeholder-[#4A4E5E] outline-none mb-2"
      />
      <textarea
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") cancel();
        }}
        placeholder="Description (optional)"
        className="w-full bg-transparent text-xs text-[#6B6F80] placeholder-[#4A4E5E] outline-none resize-none mb-3"
      />
      <div className="flex gap-2">
        <button
          onClick={submit}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-[#6366F1] rounded-md hover:bg-[#4F52D1] transition-colors"
        >
          Add
        </button>
        <button
          onClick={cancel}
          className="px-3 py-1.5 text-xs text-[#6B6F80] hover:text-[#A0A4B8] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
