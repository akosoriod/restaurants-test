import * as AWS from "aws-sdk";
import { IUser } from "../interfaces/IUser";
import { getItem, putItem } from "../helpers/dynamoHelper";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const TABLE_NAME: string = process.env.TABLE_NAME || "";
const ClientId = process.env.USER_POOL_CLIENT_ID || "";
const UserPoolId = process.env.USER_POOL_ID || "";

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

export class User implements IUser {
    name: string;
    email: string;
    address: string;
    password: string;

    constructor(props: IUser) {
        this.name = props.name;
        this.email = props.email;
        this.address = props.address;
        this.password = props.password;
    }

    create = async (): Promise<any> => {
        try {
            const params: DocumentClient.PutItemInput = {
                TableName: TABLE_NAME,
                Item: {
                    PK: 'USER',
                    SK: 'USER#' + this.email,
                    name: this.name,
                    email: this.email,
                    address: this.address,
                    password: this.password  //cifrar
                },
                ReturnValues: "ALL_OLD"
            }
            await putItem(params); //save in dynamoDB
            await this.saveCognito(); //save in cognito
            const params2: DocumentClient.GetItemInput = {
                TableName: TABLE_NAME,
                Key: {
                    PK: 'USER',
                    SK: 'USER#' + this.email
                }
            }
            let res = getItem(params2);
            return res;
        } catch (error) {
            return { error: error }
        }
    }

    saveCognito = (email_verified = false) =>
    new Promise((resolve, reject) => {
        const signupCognitoParams: AWS.CognitoIdentityServiceProvider.Types.SignUpRequest = {
            ClientId,
            Username: this.email,
            Password: this.password || "",
            UserAttributes: [
                {
                    Name: "email",
                    Value: this.email
                }
            ]
        }
        this.signUpCognito(signupCognitoParams)
            .then((results) => resolve(results))
            .catch((error) => reject(error))
    })

    signUpCognito = (params: AWS.CognitoIdentityServiceProvider.Types.SignUpRequest) =>
    new Promise((resolve, reject) => {
        cognitoIdentityServiceProvider
            .signUp(params)
            .promise()
            .then((results) => resolve(results))
            .catch((error) => reject(error))
    })
}

