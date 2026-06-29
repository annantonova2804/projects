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
import type { Card, Column as ColumnType, ColumnId } from "../types";

const COLUMNS: ColumnType[] = [
  { id: "backlog",     title: "Backlog",     color: "#6366F1" },
  { id: "discovery",  title: "Discovery",   color: "#A78BFA" },
  { id: "in-progress",title: "In Progress", color: "#F59E0B" },
  { id: "review",     title: "Review",      color: "#34D399" },
  { id: "done",       title: "Done",        color: "#10B981" },
];

export function Board() {
  const [cards, setCards] = useLocalStorage<Card[]>("kanban-cards-v2", []);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnId | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const addCard = (columnId: string, title: string, description: string) => {
    setCards((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, description, columnId: columnId as ColumnId },
    ]);
  };

  const editCard = (id: string, title: string, description: string) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, title, description } : c)));
  };

  const deleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const onDragStart = ({ active }: DragStartEvent) => {
    const card = cards.find((c) => c.id === active.id);
    setActiveCard(card ?? null);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCard(null);
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

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

  const visibleColumns = activeColumn
    ? COLUMNS.filter((c) => c.id === activeColumn)
    : COLUMNS;

  return (
    <div className="px-8 py-6">
      {/* Column tab nav */}
      <nav className="flex gap-6 mb-8 border-b border-[#1F2028]">
        <button
          onClick={() => setActiveColumn(null)}
          className={`pb-3 text-xs font-semibold tracking-widest uppercase transition-colors ${
            activeColumn === null
              ? "text-[#6366F1] border-b-2 border-[#6366F1]"
              : "text-[#4A4E5E] hover:text-[#A0A4B8]"
          }`}
        >
          All
        </button>
        {COLUMNS.map((col) => (
          <button
            key={col.id}
            onClick={() => setActiveColumn(activeColumn === col.id ? null : col.id)}
            className={`pb-3 text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5 transition-colors ${
              activeColumn === col.id
                ? "border-b-2"
                : "text-[#4A4E5E] hover:text-[#A0A4B8]"
            }`}
            style={
              activeColumn === col.id
                ? { color: col.color, borderColor: col.color }
                : {}
            }
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: col.color }}
            />
            {col.title}
          </button>
        ))}
      </nav>

      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex gap-5 overflow-x-auto pb-4">
          {visibleColumns.map((col) => (
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
            <div className="bg-[#1A1C24] border border-[#6366F1] rounded-xl p-3 w-64 rotate-2 shadow-xl cursor-grabbing">
              <p className="text-sm font-semibold text-[#E8EAED]">{activeCard.title}</p>
              {activeCard.description && (
                <p className="text-xs text-[#6B6F80] mt-1">{activeCard.description}</p>
              )}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
