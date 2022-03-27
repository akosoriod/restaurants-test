import * as cdk from '@aws-cdk/core';
import { getIAMPolicy } from "./services/iam";
import { getLambdas } from "./services/lambda";
import * as cognito from "@aws-cdk/aws-cognito";
import { getApiGatewayResources } from "./services/apiGateway";
import { VerificationEmailStyle} from '@aws-cdk/aws-cognito'
import { RemovalPolicy } from 'aws-cdk-lib';


export class TybaInfrastructureStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, env: any, props?: cdk.StackProps) {
        super(scope, id, props);

        // COGNITO
        const userPool = new cognito.UserPool(this, env.USER_POOL_NAME, {
            userPoolName: env.USER_POOL_NAME,
            selfSignUpEnabled: true,
            signInAliases: { username: false, email: true },
            autoVerify: {
                email: true,
            },
            userVerification: {
                emailStyle: VerificationEmailStyle.LINK
            },
            standardAttributes: {
                email: { required: true, mutable: true },
            },
            removalPolicy: RemovalPolicy.DESTROY
        });

        const userPoolClient = new cognito.UserPoolClient(this, 'app-client', {
            authFlows: {
                adminUserPassword: true,
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
                callbackUrls:  [env.LOGOUT_URL],
                logoutUrls: [env.LOGOUT_URL],
            }
        })
    
        userPool.addDomain('CognitoDomain', {
            cognitoDomain: {
                domainPrefix: env.USER_POOL_NAME.toLowerCase(),
            },
        });

        env.USER_POOL_CLIENT_ID = userPoolClient.userPoolClientId;
        env.USER_POOL_ID = userPool.userPoolId;
    
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
