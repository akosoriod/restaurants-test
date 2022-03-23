import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Callback, Context } from "aws-lambda"; 
import { getResponse } from "../../helpers/lambdaHelper";
import { Search } from "../../entities/search";
import fetch from 'node-fetch';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {

    const { lat,long,radius} = JSON.parse(event.body || '{}');
    const res = new Search({lat,long,radius});
    const payment = await res.create();
   if (payment.hasOwnProperty("error")) {
           return getResponse({
           statusCode: 400,
           body: {
               error: payment.error
           }
       })
   } else {
       return getResponse({
           statusCode: 201,
           body: {
                payment
           }
       })
   } 
   //} 

}

