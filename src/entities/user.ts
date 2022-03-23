import { IUser } from "../interfaces/IUser";
import { getItem, putItem } from "../helpers/dynamoHelper";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const TABLE_NAME: string = process.env.TABLE_NAME || "";

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
            await putItem(params);
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


}

