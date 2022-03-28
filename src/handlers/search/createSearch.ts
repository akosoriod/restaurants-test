import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Callback, Context } from "aws-lambda"; 
import { getResponse } from "../../helpers/lambdaHelper";
import { Search } from "../../entities/search";
import { getEmail } from "../../helpers/authorizationHelper";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const userEmail:string = await getEmail(event);
    console.log(userEmail);
    const { lat,long,radius} = JSON.parse(event.body || '{}');
    const res = new Search({lat,long,radius,userEmail});
    const result = await res.create();
   if (result.hasOwnProperty("error")) {
           return getResponse({
           statusCode: 400,
           body: {
               error: result.error
           }
       })
   } else {
       return getResponse({
           statusCode: 201,
           body: {
            result
           }
       })
   }
}

