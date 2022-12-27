import Fs from 'fs/promises';
import dotenv from 'dotenv'
dotenv.config()

export async function jsonToObject(path) {
    const json = await Fs.readFile(path)  
    return JSON.parse(json)
}

export function toReadAblePrice(token, Price) {
    let string = ["1"];
    for(let i = 0; i<parseInt(token.decimals); i++) {
    string.push("0")
    } 
    return parseFloat(Price)/parseInt(string.toString().replace(/,/g, ""));
}
 
export function toSendAblePrice(token, Price) {
    let string = [Price.toString()];
    for(let i = 0; i<parseInt(token.decimals); i++) {
    string.push("0")
    } 
   return string.toString().replace(/,/g, "");
}


