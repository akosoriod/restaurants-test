import * as path from "path";
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apiGateway from "@aws-cdk/aws-apigateway";
import {Resource} from "@aws-cdk/aws-apigateway/lib/resource";
import {NodejsFunction} from "@aws-cdk/aws-lambda-nodejs";
import {Construct} from "@aws-cdk/core";
import {NodejsFunctionProps} from "@aws-cdk/aws-lambda-nodejs/lib/function";
import { AuthorizationType, Authorizer, MethodOptions } from "@aws-cdk/aws-apigateway";

const handlersDirectoryPath = path.join(__dirname, `./../../src/handlers/`)

const getFunctionsForSynth = (
    allLambdas: { [key: string]: () => NodejsFunction },
    onlySynth: string[]
) => {
    let lambdasForSynth: { [key: string]: NodejsFunction } = {}

    if (onlySynth.length > 0) {
        onlySynth.forEach((functionKey: string) => {
            lambdasForSynth[functionKey] = allLambdas[functionKey]();
        })
    } else {
        Object.keys(allLambdas).forEach((functionKey: string) => {
            lambdasForSynth[functionKey] = allLambdas[functionKey]();
        })
    }

    return lambdasForSynth;
}
const addLambdaToRoute = (
    lambdaFunction: NodejsFunction,
    baseRoute: apiGateway.Resource,
    method: string,
    authorizer?: Authorizer
) => {

    let methodOptions: MethodOptions;
    if (authorizer) {
        methodOptions = {
            authorizationType: AuthorizationType.CUSTOM,
            authorizer
        }
    } else {
        methodOptions = {}
    }

    baseRoute.addMethod(
        method,
        new apiGateway.LambdaIntegration(lambdaFunction, {proxy: true}),
        methodOptions
    )
}

const addLambdaToNewRoute = (
    lambdaFunction: NodejsFunction,
    baseRoute: apiGateway.Resource,
    path: string,
    method: string,
    authorizer?: Authorizer
) => {
    const newRoute = baseRoute.addResource(path);

    addLambdaToRoute(
        lambdaFunction,
        newRoute,
        method,
        authorizer
    )
}

const getNodeLambdaFunction =
    (scope: Construct,
     functionName: string,
     handlerPathFromHandlers: string,
     env: any,
     remainingProps?: NodejsFunctionProps,
     routeConfig?: {
         baseRoute: Resource,
         method: string,
         path?: string,
     },
     authorizer?: Authorizer
    ) => {
        const fixedEnvironmentVariables = {
            PROJECT_ENVIRONMENT: env.PROJECT_ENVIRONMENT,
            TABLE_NAME: env.TABLE_NAME,
        }
        const lambdaFunction = new NodejsFunction(scope, functionName, {
            functionName: `${env.PROJECT_NAME}-V${env.PROJECT_VERSION}-${functionName}-${env.PROJECT_ENVIRONMENT}`,
            memorySize: remainingProps?.memorySize || 128,
            timeout: remainingProps?.timeout || cdk.Duration.seconds(15),
            runtime: remainingProps?.runtime || lambda.Runtime.NODEJS_14_X,
            handler: remainingProps?.handler || 'handler',
            entry: handlersDirectoryPath + handlerPathFromHandlers,
            environment: {...fixedEnvironmentVariables, ...remainingProps?.environment},
            bundling: {
                minify: true,
            },
        })

        if (routeConfig) {
            if (routeConfig.path) {
                addLambdaToNewRoute(
                    lambdaFunction,
                    routeConfig.baseRoute,
                    routeConfig.path,
                    routeConfig.method,
                    authorizer
                );
            } else {
                addLambdaToRoute(
                    lambdaFunction,
                    routeConfig.baseRoute,
                    routeConfig.method,
                    authorizer
                )
            }

        }

        return lambdaFunction;
    }


export const getLambdas = (
    stack: cdk.Construct,
    env: any,
    opt: any
): { [key: string]: NodejsFunction } => {
    const signup = () => getNodeLambdaFunction(
        stack,
        "signup",
        "auth/signup.ts",
        env,
        {
            environment: {
                TABLE_NAME: env.MAIN_TABLE_NAME,
                USER_POOL_ID: env.USER_POOL_ID,
                USER_POOL_CLIENT_ID: env.USER_POOL_CLIENT_ID
            }
        },
        {baseRoute: opt.routes.signupRoute, path: '', method: "POST"}
    );

    const signin = () => getNodeLambdaFunction(
        stack,
        "signin",
        "auth/signin.ts",
        env,
        {
            environment: {
                TABLE_NAME: env.MAIN_TABLE_NAME
            }
        },
        {baseRoute: opt.routes.signinRoute, path: '', method: "POST"}
    );

    const logout = () => getNodeLambdaFunction(
        stack,
        "logout",
        "auth/logout.ts",
        env,
        {
            environment: {
                TABLE_NAME: env.MAIN_TABLE_NAME
            }
        },
        {baseRoute: opt.routes.logoutRoute, path: '', method: "POST"}
    );

// search
    const searches = () => getNodeLambdaFunction(
        stack,
        "searches",
        "search/searches.ts",
        env,
        {
            environment: {
                TABLE_NAME: env.MAIN_TABLE_NAME,
                API_KEY_MAPS: env.API_KEY_MAPS,
            }
        },
        {baseRoute: opt.routes.searchesRoute, path: '', method: "GET"},
        opt.authorizer
    );

    const createSearch = () => getNodeLambdaFunction(
        stack,
        "createSearch",
        "search/createSearch.ts",
        env,
        {
            environment: {
                TABLE_NAME: env.MAIN_TABLE_NAME,
                API_KEY_MAPS: env.API_KEY_MAPS
            }
        },
        {baseRoute: opt.routes.searchRoute, path: 'new', method: "POST"},
        opt.authorizer
    );


    const allLambdas: { [key: string]: () => NodejsFunction } = {
        signup,
        signin,
        logout,
        searches,
        createSearch
    }

    return getFunctionsForSynth(allLambdas, opt.onlySynth || []);

}