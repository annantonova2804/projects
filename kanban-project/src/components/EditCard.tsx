import { useState } from "react";

interface Props {
  initialTitle: string;
  initialDescription: string;
  onSave: (title: string, description: string) => void;
  onCancel: () => void;
}

export function EditCard({ initialTitle, initialDescription, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const save = () => {
    const trimmed = title.trim();
    if (trimmed) onSave(trimmed, description.trim());
    else onCancel();
  };

  return (
    <div>
      <input
        autoFocus
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") onCancel();
        }}
        className="w-full bg-transparent text-sm font-semibold text-[#E8EAED] outline-none mb-2 border-b border-[#6366F1] pb-1"
      />
      <textarea
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancel();
        }}
        className="w-full bg-transparent text-xs text-[#6B6F80] outline-none resize-none mb-3"
      />
      <div className="flex gap-2">
        <button
          onClick={save}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-[#6366F1] rounded-md hover:bg-[#4F52D1] transition-colors"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-xs text-[#6B6F80] hover:text-[#A0A4B8] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
