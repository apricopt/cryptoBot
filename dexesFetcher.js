import Web3 from "web3";
import fetch from "node-fetch";
import yesno from "yesno";
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

function fetchDexes() {
    return fetch("https://api.1inch.io/v5.0/1/liquidity-sources")
        .then((res) => res.json())
        .then((res) => res);
}


fetchDexes()
    .then((data) => {
        console.log("Fetching >>>>> " , data);
fs.appendFile('data/dexes.json', JSON.stringify(data.protocols), err => {
  if (err) {
    console.error(err);
  }
    console.log("Dexes data has been written into data/dexes.json file :) ")
});

    })
    .catch((err) => console.log("this is the error", err));
