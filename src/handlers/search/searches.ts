import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Callback, Context } from "aws-lambda"; 
import { getResponse } from "../../helpers/lambdaHelper";
import { Search } from "../../entities/search";
import { getEmail } from "../../helpers/authorizationHelper";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const userEmail:string = await getEmail(event);
    console.log(userEmail);
    const searches = await Search.getSearches(userEmail);
    if (searches.hasOwnProperty("error")) {
            return getResponse({
            statusCode: 400,
            body: {
                error: searches.error
            }
        })
    } else {
        return getResponse({
            statusCode: 200,
            body: {
                searches
            }
        })
    }


}