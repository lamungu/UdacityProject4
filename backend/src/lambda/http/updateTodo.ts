import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todoManager';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const request: UpdateTodoRequest = JSON.parse(event.body)

    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    await updateTodo(todoId, request)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: ''
    };
}
