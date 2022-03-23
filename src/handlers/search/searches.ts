import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Callback, Context } from "aws-lambda"; 
import { getResponse } from "../../helpers/lambdaHelper";
import { Search } from "../../entities/search";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const userEmail = 'akod55@gmail.com';
    const orders = await Search.getSearches(userEmail);
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