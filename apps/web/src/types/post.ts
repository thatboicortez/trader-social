export type Post = {
  id: string;
  content: string;
  createdAt: string;
  author?: {
    id: string;
    username: string;
    displayName?: string | null;
  };
};