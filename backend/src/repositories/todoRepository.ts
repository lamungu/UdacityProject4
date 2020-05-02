import * as AWS from 'aws-sdk'
import { TodoItem } from '../models/TodoItem';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export class TodoRepository {
    constructor(
        private readonly dynamoDb: DocumentClient = new AWS.DynamoDB.DocumentClient,
        private readonly todosTable = process.env.TODOS_TABLE) {
    }

    async getAllTodos(): Promise<TodoItem[]> {
        console.log('Getting all todos')
        // TODO: Get all TODO items for a current user
        const result = await this.dynamoDb.scan({
            TableName: this.todosTable
        }).promise()

        const items = result.Items

        return items as TodoItem[];
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        console.log('Creating a Todo')

        await this.dynamoDb.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        return todoItem
    }

    async updateTodo(todoId: string, todoItem: TodoItem): Promise<null> {
        console.log('Updating a Todo')

        await this.dynamoDb.update({
            TableName: this.todosTable,
            Key: {
                todoId
            },
            UpdateExpression: "set info.name = :n, info.dueDate = :d, info.done = :c",
            ExpressionAttributeValues:{
                ":n": todoItem.name,
                ":d": todoItem.dueDate,
                ":c": todoItem.done
            }
          }).promise()

        return undefined
    }

    async deleteTodo(todoId: string): Promise<null> {
        console.log('Deleting a Todo')

        await this.dynamoDb.delete({
            TableName: this.todosTable,
            Key: {
                todoId
            }
        }).promise();

        return undefined;
    }
}