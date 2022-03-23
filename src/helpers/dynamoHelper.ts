import * as AWS from "aws-sdk";
import {DocumentClient} from "aws-sdk/clients/dynamodb";

let clientOptions = {};
const endpoint = process.env.LOCAL_STACK_ENDPOINT;
if (endpoint) {
    clientOptions = {
        endpoint,
    }
}
const dynamo = new AWS.DynamoDB.DocumentClient(clientOptions);

export const getItem = (params: DocumentClient.GetItemInput): Promise<DocumentClient.GetItemOutput> =>
    new Promise((resolve, reject) => {
        dynamo
            .get(params)
            .promise()
            .then((results) => resolve(results))
            .catch((error) => reject(error))
    });

export const queryTable = (params: DocumentClient.QueryInput): Promise<DocumentClient.QueryOutput> =>
    new Promise((resolve, reject) => {
        dynamo
            .query(params)
            .promise()
            .then((results) => {
                resolve(results);
            })
            .catch((error) => {
                reject(error);
            });
    })


export const putItem = (params: DocumentClient.PutItemInput) =>
    new Promise((resolve, reject) => {
        dynamo.put(params)
            .promise()
            .then((results) => {
                resolve(results);
            })
            .catch((error) => {
                reject(error);
            })
    })

export const updateItem = (params: DocumentClient.UpdateItemInput): Promise<DocumentClient.UpdateItemOutput> =>
    new Promise((resolve, reject) => {
        dynamo.update(params)
            .promise()
            .then((results) => {
                resolve(results);
            })
            .catch((error) => {
                reject(error);
            })
    })