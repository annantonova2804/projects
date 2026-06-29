import { useState } from "react";

interface Props {
  initialTitle: string;
  onSave: (title: string) => void;
  onCancel: () => void;
}

export function EditCard({ initialTitle, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initialTitle);

  const save = () => {
    const trimmed = title.trim();
    if (trimmed) onSave(trimmed);
    else onCancel();
  };

  return (
    <div>
      <textarea
        autoFocus
        rows={2}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); save(); }
          if (e.key === "Escape") onCancel();
        }}
        className="w-full px-2 py-1.5 text-sm text-[#172B4D] bg-white border border-[#0052CC] rounded resize-none outline-none"
      />
      <div className="flex gap-2 mt-1">
        <button
          onClick={save}
          className="px-3 py-1 text-sm text-white bg-[#0052CC] rounded hover:bg-[#0747A6] transition-colors"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1 text-sm text-[#5E6C84] hover:text-[#172B4D] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
