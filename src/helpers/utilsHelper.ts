export const getRowsValue = async (arr: any, field: string): Promise<any> => {
    const data = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(arr[0]))));
    return data[0][field];
}

export const getResponseValue = async (arr: any,field: string): Promise<any> => {
    const data = JSON.parse(JSON.stringify(arr));
    return data[0][field];
}

export const getDate = async (): Promise<string> => {
    let date = new Date();
    let dateStr =    date.getFullYear() + "-" +
                    ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
                    ("00" + date.getDate()).slice(-2) + " " +
                    ("00" + date.getHours()).slice(-2) + ":" +
                    ("00" + date.getMinutes()).slice(-2) + ":" +
                    ("00" + date.getSeconds()).slice(-2);
    return dateStr;
    
}