import { IUser } from "../interfaces/IUser";
import { getResponseValue } from "../helpers/utilsHelper";


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
   
        } catch (error) {
            return { error: error }
        }
    }
    edit = async (id: string): Promise<any> => {
        try {
                
        } catch (error) {
            return { error: error }
        }
    }
    static getUser = async (id: string): Promise<any> => {
        try {

        } catch (error) {
            return { error: error }
        }
    }

}

