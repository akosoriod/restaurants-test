import { APIGatewayProxyEvent } from "aws-lambda";
import jwtDecode from "jwt-decode";
import { getResponse } from "./lambdaHelper";

const BEARER_TOKEN_REGEX = /Bearer (.*)/;

export const getEmail = async (event:APIGatewayProxyEvent): Promise<any> => {

    const id: string = event.pathParameters?.['id'] || '';
    const token: string = BEARER_TOKEN_REGEX.exec(event.headers?.Authorization || '')?.[1] || '';
    const decodedToken: any = jwtDecode(token);

    if (token === '' || !decodedToken) {
        return getResponse({
            statusCode: 403,
            body: {
                message: 'Unauthorized'
            }
        });
    }
    return decodedToken.username;
    
}