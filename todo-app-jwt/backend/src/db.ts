import type { User, Todo } from './types';

// Sử dụng Map để lưu trữ in-memory giúp tìm kiếm theo ID nhanh chóng
export const users = new Map<string, User>();
export const todos = new Map<string, Todo>();
