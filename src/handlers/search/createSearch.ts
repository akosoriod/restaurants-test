import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Callback, Context } from "aws-lambda"; 
import { getResponse } from "../../helpers/lambdaHelper";
import { request } from "http";
import fetch from 'node-fetch';


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {

    const { lat,long,radius} = JSON.parse(event.body || '{}');
    const types="restaurant";
    const url="https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+long+"&radius=" +radius+"&types=" + types + "&key="+ process.env.API_KEY_MAPS;
    const res = await fetch(url)
            .then(res =>  res.json())
            .catch(e => {
                console.error({
                'message':'error in get location method',
                error: e,
                });
            });
 /* if (res.hasOwnProperty("error")) {
           return getResponse({
           statusCode: 400,
           body: {
               error: res.error
           }
       })
   } else {*/
       return getResponse({
           statusCode: 201,
           body: {
            res
           }
       })
   //} 

}

