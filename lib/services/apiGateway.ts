import * as apiGateway from '@aws-cdk/aws-apigateway';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';
import { getIAMPolicy } from './iam';

const authorizersDirectoryPath = path.join(__dirname, `./../../src/authorizers/`);

export const getApiGatewayResources = (scope: cdk.Construct, env: any, opt?: any) => {
    const restApi = new apiGateway.RestApi(scope, env.API_NAME, {
        restApiName: env.API_NAME,
        deployOptions: {
            stageName: env.API_STAGE_NAME,
        },
        defaultCorsPreflightOptions: {
            allowHeaders: apiGateway.Cors.DEFAULT_HEADERS,
            allowMethods: apiGateway.Cors.ALL_METHODS,
            allowCredentials: true,
            allowOrigins: apiGateway.Cors.ALL_ORIGINS,
        },
    });

    // 👇🏻 Authorizer function
    const authorizerFunction = new NodejsFunction(scope, 'authorizerHandler', {
        functionName: `${env.PROJECT_NAME}-V${env.PROJECT_VERSION}-authorizerHandler-${env.PROJECT_ENVIRONMENT}`,
        memorySize: 128,
        timeout: cdk.Duration.seconds(60),
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'handler',
        entry: authorizersDirectoryPath + 'authorizer.ts',
        environment: {
            TABLE_NAME: env.MAIN_TABLE_NAME,
        },
        bundling: {
            minify: true
        },
    });


    // 👇🏻 Grant Dynamo access to the authorizer
    authorizerFunction.addToRolePolicy(getIAMPolicy(["dynamodb:*"]));

    const authorizer = new apiGateway.TokenAuthorizer(scope, 'authorizer', {
        handler: authorizerFunction,
    });

    const versionRoute = restApi.root.addResource(`v${env.PROJECT_VERSION}`);
    const signupRoute = versionRoute.addResource('signup');
    const signinRoute = versionRoute.addResource('signin');
    const logoutRoute = versionRoute.addResource('logout');
    const searchesRoute = versionRoute.addResource('searches');
    const searchRoute = versionRoute.addResource('search');
    const searchDetailRoute = searchRoute.addResource('{searchId}');

    return {
        restApi,
        authorizer,
        versionRoute,
        signupRoute,
        signinRoute,
        logoutRoute,
        searchesRoute,
        searchRoute,
        searchDetailRoute
    }
}