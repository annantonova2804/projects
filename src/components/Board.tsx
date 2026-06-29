import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { Column } from "./Column";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Card, ColumnId } from "../types";

const COLUMNS = [
  { id: "todo" as ColumnId, title: "To Do" },
  { id: "in-progress" as ColumnId, title: "In Progress" },
  { id: "done" as ColumnId, title: "Done" },
];

const INITIAL_CARDS: Card[] = [];

export function Board() {
  const [cards, setCards] = useLocalStorage<Card[]>("kanban-cards", INITIAL_CARDS);
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const addCard = (columnId: string, title: string) => {
    setCards((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, columnId: columnId as ColumnId },
    ]);
  };

  const editCard = (id: string, title: string) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  };

  const deleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveCard(cards.find((c) => c.id === active.id) ?? null);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCard(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const activeCard = cards.find((c) => c.id === activeId)!;
    const overCard = cards.find((c) => c.id === overId);
    const targetColumnId = overCard ? overCard.columnId : (overId as ColumnId);

    setCards((prev) => {
      const updated = prev.map((c) =>
        c.id === activeId ? { ...c, columnId: targetColumnId } : c
      );
      if (overCard) {
        const oldIndex = updated.findIndex((c) => c.id === activeId);
        const newIndex = updated.findIndex((c) => c.id === overId);
        return arrayMove(updated, oldIndex, newIndex);
      }
      return updated;
    });
  };

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="flex gap-6 p-6 overflow-x-auto min-h-screen items-start">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            column={col}
            cards={cards.filter((c) => c.columnId === col.id)}
            onAdd={addCard}
            onEdit={editCard}
            onDelete={deleteCard}
          />
        ))}
      </div>
      <DragOverlay>
        {activeCard && (
          <div className="bg-white rounded shadow-md p-2 text-sm text-[#172B4D] w-72 rotate-2 cursor-grabbing">
            {activeCard.title}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
