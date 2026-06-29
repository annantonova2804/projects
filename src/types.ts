export type ColumnId = "todo" | "in-progress" | "done";

export interface Card {
  id: string;
  title: string;
  columnId: ColumnId;
}

export interface Column {
  id: ColumnId;
  title: string;
}
