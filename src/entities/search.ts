import { ISearch } from "../interfaces/ISearch";
import { getItem, putItem, queryTable } from "../helpers/dynamoHelper";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import fetch from "node-fetch";

const TABLE_NAME: string = process.env.TABLE_NAME || "";

export class Search implements ISearch {
    lat: string;
    long: string;
    radius: string;
    userEmail: string;
    results: any;
    constructor(props: ISearch) {
        this.lat = props.lat;
        this.long = props.long;
        this.radius = props.radius;
        this.userEmail = props.userEmail;
    }

    create = async (): Promise<any> => {
        const types = "restaurant";
        const date = Date.now();
        try {
            const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + this.lat + "," + this.long + "&radius=" + this.radius + "&types=" + types + "&key=" + process.env.API_KEY_MAPS;
            const restaurants = await fetch(url)
                .then(res => res.json())
                .catch(e => {
                    console.error({
                        'message': 'error in get location method',
                        error: e,
                    });
                });
            const params: DocumentClient.PutItemInput = {
                TableName: TABLE_NAME,
                Item: {
                    PK: 'SEARCH',
                    SK: 'USER#'+this.userEmail+'#'+date,
                    lat: this.lat,
                    long: this.long,
                    radius: this.radius,
                    results: restaurants
                }
            }
            await putItem(params);
            const params2: DocumentClient.GetItemInput = {
                TableName: TABLE_NAME,
                Key: {
                    PK: 'SEARCH',
                    SK: 'USER#'+this.userEmail+'#'+date
                }
            }
            let res = getItem(params2);
            return res
        } catch (error) {
            return { error: error }
        }
    }


    static getSearches = async (email:string): Promise<any> => {
        const PK: string = "SEARCH";
        const SK: string = "USER#"+email;
        const params:DocumentClient.QueryInput = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :sk)",
            ExpressionAttributeValues: {
              ":pk": "SEARCH",
              ":sk": "USER#"+email
            },
            ExpressionAttributeNames: {
              "#pk": "PK",
              "#sk": "SK"
            }
        };
        try {
            return await queryTable(params)
        } catch (error) {
            return { error: error }

        }
    }
}

