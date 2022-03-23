import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Callback, Context } from "aws-lambda"; 
import { getResponse } from "../../helpers/lambdaHelper";
import { Search } from "../../entities/search";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const start: string = event.queryStringParameters?.start || '0';
    const number: string = event.queryStringParameters?.number || '10';
    const orders = await Search.getOrders(start, number);
    if (orders.hasOwnProperty("error")) {
            return getResponse({
            statusCode: 400,
            body: {
                error: orders.error
            }
        })
    } else {
        return getResponse({
            statusCode: 200,
            body: {
                orders
            }
        })
    }


}