import * as cdk from "@aws-cdk/core";


const getEnvVariables = (dependentVariables: any) => {
    const {
        PROJECT_ENVIRONMENT
    } = dependentVariables;

    const PROJECT_NAME = "tyba";
    const PROJECT_VERSION = 1;

    let AWS_ACCOUNT;
    switch (PROJECT_ENVIRONMENT) {
        case `local`:
            AWS_ACCOUNT = `000000000000`;
            break;
        default:
            AWS_ACCOUNT = `322889881075`
            break;
    }

    const AWS_CURRENT_REGION = `us-east-1`;


    const AWS_ENVIRONMENT = {
        account: AWS_ACCOUNT,
        region: AWS_CURRENT_REGION,
    }

    const REPOSITORY_ARN = `arn:aws:codecommit:${AWS_CURRENT_REGION}:${AWS_ACCOUNT}:${PROJECT_NAME}`;
    const PIPELINE_NAME = `Pipeline-${PROJECT_NAME}-V${PROJECT_VERSION}-${PROJECT_ENVIRONMENT}`
    const API_NAME = `${PROJECT_NAME}-V${PROJECT_VERSION}-Api-${PROJECT_ENVIRONMENT}`;
    const STACK_NAME = `${PROJECT_NAME}-V${PROJECT_VERSION}-Stack-${PROJECT_ENVIRONMENT}`;
    const MAIN_TABLE_NAME = `${PROJECT_NAME}-V${PROJECT_VERSION}-MainTable-${PROJECT_ENVIRONMENT}`;
    const TOKEN_SECRET=`1W5q6rhnxY4fAywpQdvgAs4KYzmsU629VnOMUnfXM3yhDqRHRqO26sjdIJBxpxHJ`;
    const API_KEY_MAPS=`AIzaSyAleTOP47ClaPq8hRB5UsZxO1cP6rFupI8`;

    return {
        PROJECT_ENVIRONMENT,
        PROJECT_NAME,
        PROJECT_VERSION,
        AWS_ACCOUNT,
        AWS_CURRENT_REGION,
        AWS_ENVIRONMENT,
        REPOSITORY_ARN,
        PIPELINE_NAME,
        API_NAME,
        STACK_NAME,
        MAIN_TABLE_NAME,
        TOKEN_SECRET,
        API_KEY_MAPS
    }
}


const developmentDependentVariables = {
    PROJECT_ENVIRONMENT: "development"
}

export const envDevelopment = getEnvVariables(developmentDependentVariables);
