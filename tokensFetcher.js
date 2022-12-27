import Web3 from "web3";
import fetch from "node-fetch";
import yesno from "yesno";
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()



function fetchTokens() {
    return fetch("https://api.1inch.io/v5.0/1/tokens")
        .then((res) => res.json())
        .then((res) => res);
}


fetchTokens()
    .then((data) => {
        console.log("Fetching >>>>> ", data.tokens);
        let tokensObject = data.tokens;
        let tokensArray = Object.values(tokensObject);
        let ObjectToSave = {};
        tokensArray.forEach(token => {
            ObjectToSave[`${token.symbol}`] = token
        })

        
fs.appendFile('data/tokens.json', JSON.stringify(ObjectToSave), err => {
  if (err) {
    console.error(err);
  }
    console.log("Tokens data has been written into data/tokens.js file :) ")
});

    })
    .catch((err) => console.log("this is the error", err));
