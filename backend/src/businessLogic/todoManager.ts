import { TodoItem } from "../models/TodoItem";
import { TodoRepository } from "../repositories/todoRepository";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import * as uuid from 'uuid';
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

const todoRepository = new TodoRepository;

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
    return todoRepository.getAllTodos(userId)
}

export async function createTodo(request: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const itemId = uuid.v4();
    const createdAt = new Date().toISOString()

    return await todoRepository.createTodo({
        todoId: itemId,
        done: false,
        userId,
        createdAt,
        ...request
      })
}

export async function updateTodo(todoId: string, request: UpdateTodoRequest): Promise<null> {
    return todoRepository.updateTodo(todoId, request as TodoItem)
}

export async function deleteTodo(todoId: string): Promise<TodoItem[]> {
    return todoRepository.deleteTodo(todoId)
}