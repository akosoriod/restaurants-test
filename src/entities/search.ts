import { ISearch } from "../interfaces/ISearch";

const TABLE_NAME = process.env.TABLE_NAME || "";

export class Search implements ISearch {
    lat: string;
    long: string;
    radius: string;
    constructor(props: ISearch) {
        this.lat = props.lat;
        this.long = props.long;
        this.radius = props.radius;
    }

    create = async (): Promise<any> => {
        try {

        } catch (error) {
            return { error: error }
        }
    }
  
    static getOrder = async (id: string): Promise<any> => {
        try {

        } catch (error) {
            return { error: error }
        }
    }
    static delete = async (id: string): Promise<any> => {
        try {
   
        } catch (error) {
            return { error: error }
        }
    }

    static getOrders = async (start: string, number: string): Promise<any> => {

        try {

        } catch (error) {
            return { error: error }
        }
    }
}

