import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Callback, Context } from "aws-lambda";
import { getResponse } from "../../helpers/lambdaHelper";
import { Auth } from "aws-amplify";


export const handler: APIGatewayProxyHandler = (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => new Promise(async (resolve, reject) => {
    const { name, email, address, password } = JSON.parse(event.body || '{}');
    try {
        const res = await Auth.signIn(email, password);
        const user = await res.create();
        return getResponse({
            statusCode: 400,
            body: {
                ...res
            }
        })
    } catch (error) {
        return getResponse({
            statusCode: 201,
            body: {
                error
            }
        })
    }

});