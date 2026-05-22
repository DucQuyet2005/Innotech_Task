export interface User {
    id: string;
    username: string;
    passwordHash: string;
}

export interface Todo {
    id: string;
    userId: string;
    text: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
}
