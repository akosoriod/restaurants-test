import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Callback, Context } from "aws-lambda"; 
import { getResponse } from "../../helpers/lambdaHelper";
import { User } from "../../entities/user";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const { name,email,address,password} = JSON.parse(event.body || '{}');
    const res = new User({name,email,address,password});
    const user = await res.create();
   if (user.hasOwnProperty("error")) {
           return getResponse({
           statusCode: 400,
           body: {
               error: user.error
           }
       })
   } else {
       return getResponse({
           statusCode: 201,
           body: {
            user
           }
       })
   } 

}