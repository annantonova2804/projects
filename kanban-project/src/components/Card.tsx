import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditCard } from "./EditCard";
import type { Card as CardType } from "../types";

interface Props {
  card: CardType;
  onEdit: (id: string, title: string, description: string) => void;
  onDelete: (id: string) => void;
}

export function Card({ card, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  if (editing) {
    return (
      <div ref={setNodeRef} style={style} className="bg-[#1A1C24] border border-[#2A2D3A] rounded-xl p-3 mb-2">
        <EditCard
          initialTitle={card.title}
          initialDescription={card.description}
          onSave={(title, description) => { onEdit(card.id, title, description); setEditing(false); }}
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
      className="group bg-[#1A1C24] border border-[#1F2028] hover:border-[#2A2D3A] rounded-xl p-3 mb-2 cursor-grab active:cursor-grabbing transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-sm font-semibold text-[#E8EAED] leading-snug">{card.title}</span>
        <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setEditing(true)}
            className="text-[#4A4E5E] hover:text-[#A0A4B8] transition-colors"
            aria-label="Edit"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onDelete(card.id)}
            className="text-[#4A4E5E] hover:text-[#EF4444] transition-colors"
            aria-label="Remove"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>
      {card.description && (
        <p className="text-xs text-[#6B6F80] leading-relaxed">{card.description}</p>
      )}
    </div>
  );
}
