import { ISearch } from "../interfaces/ISearch";
import { getItem, putItem } from "../helpers/dynamoHelper";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

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
                    SK: 'USER#'+this.userEmail,
                    lat: this.lat,
                    long: this.long,
                    radius: this.radius,
                    results: restaurants
                },
                ReturnValues: "ALL_NEW"
            }
            await putItem(params);
            return
        } catch (error) {
            return { error: error }
        }
    }


    static getSearches = async (email:string): Promise<any> => {
        const PK: string = "NFT";
        const SK: string = "USER#"+email;
        const params = {
            Key: {
                PK,
                SK
            },
            TableName: TABLE_NAME,
        };
        try {
            return await getItem(params)
        } catch (error) {
            return { error: error }

        }
    }
}

