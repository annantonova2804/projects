import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card } from "./Card";
import { AddCard } from "./AddCard";
import type { Card as CardType, Column as ColumnType } from "../types";

interface Props {
  column: ColumnType;
  cards: CardType[];
  onAdd: (columnId: string, title: string) => void;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function Column({ column, cards, onAdd, onEdit, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-sm font-semibold text-[#5E6C84] uppercase tracking-wide">
          {column.title}
        </h2>
        <span className="text-xs text-[#5E6C84] bg-[#DFE1E6] rounded-full px-2 py-0.5">
          {cards.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 rounded-lg p-2 min-h-24 transition-colors ${
          isOver ? "bg-[#D6E4FF]" : "bg-[#EBECF0]"
        }`}
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <Card key={card.id} card={card} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </SortableContext>

        <AddCard onAdd={(title) => onAdd(column.id, title)} />
      </div>
    </div>
  );
}
