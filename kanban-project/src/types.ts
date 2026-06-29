export type ColumnId = "backlog" | "discovery" | "in-progress" | "review" | "done";

export interface Card {
  id: string;
  title: string;
  description: string;
  columnId: ColumnId;
}

export interface Column {
  id: ColumnId;
  title: string;
  color: string;
}
