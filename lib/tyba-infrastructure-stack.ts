import * as cdk from '@aws-cdk/core';
import {getLambdas} from "./services/lambda";
import {getIAMPolicy} from "./services/iam";
import {getApiGatewayResources} from "./services/apiGateway";

export class TybaInfrastructureStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, env: any, props?: cdk.StackProps) {

        super(scope, id, props);


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
            signup
        } = lambdas;

        Object.keys(lambdas).forEach((lambdaFunctionKey: string) => {
            const lambdaFunction = lambdas[lambdaFunctionKey];
            lambdaFunction.addToRolePolicy(getIAMPolicy(["dynamodb:*"]));
        })
    }
}
