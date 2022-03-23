import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Callback, Context } from "aws-lambda"; 
import { getResponse } from "../../helpers/lambdaHelper";
import { User } from "../../entities/user";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const { name, email,address,password } = JSON.parse(event.body || '{}');


       return getResponse({
           statusCode: 201,
           body: {
            msg:"hello"
           }
       })
    

}