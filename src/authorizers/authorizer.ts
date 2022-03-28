import {
    APIGatewayAuthorizerEvent,
    APIGatewayAuthorizerHandler,
    APIGatewayAuthorizerResult,
    APIGatewayTokenAuthorizerEvent,
    Callback,
    Context
} from "aws-lambda";
import jwtDecode from "jwt-decode";
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {queryTable} from '../helpers/dynamoHelper';
import { CognitoJwtVerifier } from "aws-jwt-verify";

const BEARER_TOKEN_REGEX = /Bearer (.*)/;
const TableName = process.env.TABLE_NAME || "";
const ClientId = process.env.USER_POOL_CLIENT_ID || "";
const UserPoolId = process.env.USER_POOL_ID || "";

function generatePolicyDocument(effect: string, methodArn: string) {
  if (!effect || !methodArn) return null

  const policyDocument = {
    Version: '2012-10-17',
    Statement: [{
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: methodArn
    }]
  };

  return policyDocument;
}

const generateAuthResponse = (principalId: string, effect: string, methodArn: string) => {
  const policyDocument = generatePolicyDocument(effect, methodArn);

  return {
    principalId,
    policyDocument
  }
}

export const handler: APIGatewayAuthorizerHandler = (
  event: APIGatewayAuthorizerEvent,
  context: Context,
  callback: Callback,
): Promise<APIGatewayAuthorizerResult> => new Promise(async (resolve, reject) => {
  const methodArn = event.methodArn;
  try {
    const cleanToken = BEARER_TOKEN_REGEX.exec((event as APIGatewayTokenAuthorizerEvent).authorizationToken)?.[1];
    if(!cleanToken) {
      callback(null, generateAuthResponse('user', 'Deny', methodArn));
      return;
    }
    const decodedToken: any = jwtDecode(cleanToken);

    if (!decodedToken) {
      console.log('Denied access');
      callback(null, generateAuthResponse('user', 'Deny', methodArn));
      return;
    }

    // Verifier that expects valid access tokens:
    const verifier = CognitoJwtVerifier.create({
      userPoolId: UserPoolId,
      tokenUse: "access",
      clientId: ClientId,
    });
    
    try {
      const payload = await verifier.verify(
        cleanToken
      );
      console.log("Token is valid. Payload:", payload);
    } catch {
      console.log("Token not valid!");
    }

    console.log('decodedToken', decodedToken)

    const query: DocumentClient.QueryInput = {
      "TableName": TableName,
      "ScanIndexForward": true,
      "IndexName": "Inverted",
      "KeyConditionExpression": "#cd420 = :cd420 AND #cd421 = :cd421",
      "ExpressionAttributeValues": {
        ":cd420": "USER",
        ":cd421": `USER#${decodedToken.email}`,
      },
      "ExpressionAttributeNames": {
        "#cd420": "PK",
        "#cd421": "SK"
      }
    }

    queryTable(query)
      .then((results) => {
        console.log('results', results)
        if ((results?.Count ?? 0) > 0) {
          callback(null, generateAuthResponse('user', 'Allow', methodArn));
          return;
        }
        callback(null, generateAuthResponse('user', 'Deny', methodArn));
        return;
      })
      .catch((error) => {
        console.log('error', error)
        callback(null, generateAuthResponse('user', 'Deny', methodArn));
        return;
      })
  } catch (error) {
    callback(null, generateAuthResponse('user', 'Deny', methodArn));
    return;
  }
});