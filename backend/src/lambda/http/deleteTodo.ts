import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/todoManager';
import { getUserId } from '../utils';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    
    await deleteTodo(getUserId(event), todoId)
  
    return {
        statusCode: 204,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: ''
    };
}
