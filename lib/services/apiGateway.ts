import * as apiGateway from "@aws-cdk/aws-apigateway";
import * as cdk from '@aws-cdk/core';
import {EndpointType, SecurityPolicy} from "@aws-cdk/aws-apigateway";

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



    const versionRoute = restApi.root.addResource(`v${env.PROJECT_VERSION}`);
    const signupRoute = versionRoute.addResource('signup');
    const signinRoute = versionRoute.addResource('signin');
    const logoutRoute = versionRoute.addResource('logout');
    const searchesRoute = versionRoute.addResource('searches');
    const searchRoute = versionRoute.addResource('search');
    const searchDetailRoute = searchRoute.addResource('{searchId}');

    return {
        restApi,
        versionRoute,
        signupRoute,
        signinRoute,
        logoutRoute,
        searchesRoute,
        searchRoute,
        searchDetailRoute
    }
}