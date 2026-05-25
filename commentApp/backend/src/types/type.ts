export interface Comment {
    id: number;
    content: string;
    author: string;
    createdAt: string;
    replies: Comment[];
}