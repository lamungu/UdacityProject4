import 'source-map-support/register'

import { APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllTodos } from '../../businessLogic/todoManager'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
    const todos = await getAllTodos(getUserId(event))
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            items: todos
        })
    }
}
