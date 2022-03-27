import * as cdk from '@aws-cdk/core';
import { getIAMPolicy } from "./services/iam";
import { getLambdas } from "./services/lambda";
import * as cognito from "@aws-cdk/aws-cognito";
import { getApiGatewayResources } from "./services/apiGateway";
import * as lambdaEventSources from '@aws-cdk/aws-lambda-event-sources';
import { UserPool } from "@aws-cdk/aws-cognito";
import { CfnAuthorizer } from '@aws-cdk/aws-apigateway';
import { RemovalPolicy } from 'aws-cdk-lib';


export class TybaInfrastructureStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, env: any, props?: cdk.StackProps) {
        super(scope, id, props);

        // COGNITO
        const userPool = new cognito.UserPool(this, env.USER_POOL_NAME, {
            userPoolName: env.USER_POOL_NAME,
            selfSignUpEnabled: true,
            signInAliases: {
                username: false
            },
            standardAttributes: {
                email: { required: true, mutable: true },
            },
            removalPolicy: RemovalPolicy.DESTROY
        });

        const userPoolClient = new cognito.UserPoolClient(this, 'app-client', {
            authFlows: {
                userPassword: true,
                userSrp: true,
            },
            userPoolClientName: env.USER_POOL_CLIENT_NAME,
            userPool,
            oAuth: {
                flows: {
                    implicitCodeGrant: true,
                    authorizationCodeGrant: true,
                },
                scopes: [
                    cognito.OAuthScope.OPENID,
                    cognito.OAuthScope.EMAIL
                ],
                callbackUrls: ["https://example.com"],
                logoutUrls: [env.LOGOUT_URL],
            }
        })
    
        userPool.addDomain('CognitoDomain', {
            cognitoDomain: {
                domainPrefix: env.USER_POOL_NAME.toLowerCase(),
            },
        });

        // API GATEWAY

        const {
            versionRoute,
            authorizer,
            signupRoute,
            signinRoute,
            logoutRoute,
            searchesRoute,
            searchRoute,
            searchDetailRoute
        } = getApiGatewayResources(this, env, { userPool }
        );

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
                },
                authorizer
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
            lambdaFunction.addToRolePolicy(getIAMPolicy(["cognito-idp:*"]));
            

        })
    }
}
