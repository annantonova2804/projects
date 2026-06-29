import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditCard } from "./EditCard";
import type { Card as CardType } from "../types";

interface Props {
  card: CardType;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function Card({ card, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  if (editing) {
    return (
      <div ref={setNodeRef} style={style} className="bg-white rounded shadow-sm p-2 mb-2">
        <EditCard
          initialTitle={card.title}
          onSave={(title) => { onEdit(card.id, title); setEditing(false); }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group bg-white rounded shadow-sm p-2 mb-2 cursor-grab active:cursor-grabbing flex items-start justify-between gap-2"
    >
      <span className="text-sm text-[#172B4D] break-words min-w-0">{card.title}</span>
      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setEditing(true)}
          className="text-[#5E6C84] hover:text-[#172B4D] transition-colors"
          aria-label="Edit card"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(card.id)}
          className="text-[#5E6C84] hover:text-[#DE350B] transition-colors"
          aria-label="Delete card"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
