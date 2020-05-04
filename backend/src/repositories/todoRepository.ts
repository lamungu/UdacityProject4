import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { TodoItem } from '../models/TodoItem';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils/logger';

export const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('todoRepository');

export class TodoRepository {
    constructor(
        private readonly dynamoDb: DocumentClient = new XAWS.DynamoDB.DocumentClient,
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX
    ) {
    }

    async getAllTodos(userId: string): Promise<TodoItem[]> {
        logger.info(`Getting all todos for user: ${userId}`)
        // TODO: Get all TODO items for a current user
        const result = await this.dynamoDb.query({
            TableName: this.todosTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            }
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

    async updateTodoAttachmentUrl(userId: string, todoId: string, attachmentUrl: string): Promise<null> {
        console.log('Updating a Todo\'s attachment url')

        await this.dynamoDb.update({
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            },
            UpdateExpression: "set attachmentUrl = :a",
            ExpressionAttributeValues:{
                ":a": attachmentUrl,
            },
          }).promise()

        return undefined
    }
    async updateTodo(userId: string, todoId: string, todoItem: TodoItem): Promise<null> {
        console.log('Updating a Todo')

        await this.dynamoDb.update({
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            },
            UpdateExpression: "set #n = :n, dueDate = :d, done = :c",
            ExpressionAttributeValues:{
                ":n": todoItem.name,
                ":d": todoItem.dueDate,
                ":c": todoItem.done
            },
            ExpressionAttributeNames:{
                "#n": "name"
            }
          }).promise()

        return undefined
    }

    async deleteTodo(userId: string, todoId: string): Promise<null> {
        console.log('Deleting a Todo')

        await this.dynamoDb.delete({
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            }
        }).promise();

        return undefined;
    }
}