import 'source-map-support/register'

import { APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllTodos } from '../../businessLogic/todoManager'

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
    const todos = await getAllTodos()
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
