import * as AWS from "aws-sdk";
import { getResponse } from "../../helpers/lambdaHelper";
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Callback, Context } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";

const cognitoClientId = new AWS.CognitoIdentityServiceProvider();
const ClientId = process.env.USER_POOL_CLIENT_ID || "";

export const handler: APIGatewayProxyHandler = (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => new Promise(async (resolve, reject) => {
    const { name, email, address, password } = JSON.parse(event.body || '{}');
    try {
        const payload:CognitoIdentityServiceProvider.Types.InitiateAuthRequest = {
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: ClientId,
            AuthParameters: {
              USERNAME: email,
              PASSWORD: password
            }
          }
          const dataSession = await cognitoClientId.initiateAuth(payload).promise();
        return getResponse({
            statusCode: 400,
            body: {
                dataSession
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