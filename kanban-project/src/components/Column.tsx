import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card } from "./Card";
import { AddCard } from "./AddCard";
import type { Card as CardType, Column as ColumnType } from "../types";

interface Props {
  column: ColumnType;
  cards: CardType[];
  onAdd: (columnId: string, title: string, description: string) => void;
  onEdit: (id: string, title: string, description: string) => void;
  onDelete: (id: string) => void;
}

export function Column({ column, cards, onAdd, onEdit, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col w-64 shrink-0">
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: column.color }}>
            — {cards.length} {cards.length === 1 ? "card" : "cards"}
          </span>
        </div>
        <h2 className="text-base font-bold text-[#E8EAED]">{column.title}</h2>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 rounded-xl p-2 min-h-32 transition-colors ${
          isOver ? "bg-[#1F2130]" : "bg-transparent"
        }`}
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <Card key={card.id} card={card} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </SortableContext>
        <AddCard onAdd={(title, description) => onAdd(column.id, title, description)} />
      </div>
    </div>
  );
}
