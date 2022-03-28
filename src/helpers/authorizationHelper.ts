import { APIGatewayProxyEvent, APIGatewayTokenAuthorizerEvent } from "aws-lambda";
import jwtDecode from "jwt-decode";
import { getResponse } from "./lambdaHelper";

const BEARER_TOKEN_REGEX = /Bearer (.*)/;

export const getEmail = async (event:APIGatewayProxyEvent): Promise<any> => {
    const cleanToken:any = BEARER_TOKEN_REGEX.exec(event.headers?.Authorization || '')?.[1] ;
    const decodedToken: any = jwtDecode(cleanToken);
    if (cleanToken == '' || !decodedToken) {
        return getResponse({
            statusCode: 403,
            body: {
                message: 'Unauthorized'
            }
        });
    }
    return decodedToken.email;
    
}