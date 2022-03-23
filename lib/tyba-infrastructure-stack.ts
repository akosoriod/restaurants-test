import * as cdk from '@aws-cdk/core';
import {getLambdas} from "./services/lambda";
import {getIAMPolicy} from "./services/iam";
import {getApiGatewayResources} from "./services/apiGateway";

export class TybaInfrastructureStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, env: any, props?: cdk.StackProps) {

        super(scope, id, props);

       /*
        const jwksUri = ssm.StringParameter.fromStringParameterAttributes(
            this,
            'jwksURI',
            {
                parameterName: 'https://akod.us.auth0.com/.well-known/jwks.json',
            },
        ).stringValue;

        const audience = ssm.StringParameter.fromStringParameterAttributes(
            this,
            'audience',
            {
                parameterName: 'https://0sdrvcpvi4.execute-api.us-east-1.amazonaws.com',
            },
        ).stringValue;

        const tokenIssuer = ssm.StringParameter.fromStringParameterAttributes(
            this,
            'tokenIssuer',
            {
                parameterName: 'https://akod.us.auth0.com/',
            },
        ).stringValue;

        // Lambda Authorizer
        const auth0AuthorizerFunction = new lambda.Function(
            this,
            'auth0AuthorizerFunction',
            {
                runtime: lambda.Runtime.NODEJS_12_X,
                code: lambda.Code.fromAsset(NODE_LAMBDA_SRC_DIR),
                handler: 'auth/authorizer.handler',
                layers: [nodeModuleLayer],
                environment: {
                    JWKS_URI: jwksUri,
                    AUDIENCE: audience,
                    TOKEN_ISSUER: tokenIssuer,
                },
            },
        );
        */
        // API GATEWAY

        const {
            versionRoute,
            signupRoute,
            signinRoute,
            logoutRoute,
            searchesRoute,
            searchRoute,
            searchDetailRoute
        } = getApiGatewayResources(this, env);

        // LAMBDAS

        const lambdas = getLambdas(
            this,
            env,
            {
                onlySynth: [],
                routes: {
                    versionRoute,
                    signupRoute,
                    signinRoute,
                    logoutRoute,
                    searchesRoute,
                    searchRoute,
                    searchDetailRoute
                }
            });

        const {
            signup,
            signin,
            logout,
            searches,
            createSearch
        } = lambdas;

        Object.keys(lambdas).forEach((lambdaFunctionKey: string) => {
            const lambdaFunction = lambdas[lambdaFunctionKey];
            lambdaFunction.addToRolePolicy(getIAMPolicy(["dynamodb:*"]));
        })
    }
}
