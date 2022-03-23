import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Callback, Context } from "aws-lambda"; 
import { getResponse } from "../../helpers/lambdaHelper";
import { Search } from "../../entities/search";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const id: string = event.pathParameters?.orderId || '';
    const order = await Search.getOrder(id);
    if (order.hasOwnProperty("error")) {
            return getResponse({
            statusCode: 400,
            body: {
                error: order.error
            }
        })
    } else {
        return getResponse({
            statusCode: 200,
            body: {
                order
            }
        })
    } 
}