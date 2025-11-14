export interface Note {
  _id: string;
  title?: string;
  content: string;
  backgroundColor?: string;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
}
