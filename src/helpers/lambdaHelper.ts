import {APIGatewayProxyResult} from "aws-lambda";
import {stringify} from 'flatted';

export const getResponse = (
    {body, statusCode, error}: { body?: any, statusCode?: number, error?: any, badRequest?: boolean }
): APIGatewayProxyResult => {
    const headers = {
        "Content-Type": "application/json",
        "X-Custom-Header": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
    }

    if (error) {
        console.log(error);
        if (process.env.PROJECT_ENVIRONMENT === "master") error = "See internal logs.";
        return {
            body: JSON.stringify({
                message: "There was an error!",
                error
            }),
            statusCode: statusCode || 500,
            headers
        };
    }

    if (!statusCode) {
        throw new Error('Please provide status code');
    }

    return {
        body: JSON.stringify(body || {}),
        statusCode,
        headers
    };
}