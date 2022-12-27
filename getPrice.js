import Web3 from "web3";
import fetch from "node-fetch";
import yesno from "yesno";
import ethers from "ethers"
import {toReadAblePrice, jsonToObject, toSendAblePrice } from "./utils/utils.js"
import dotenv from 'dotenv'
dotenv.config()


const Tokens = await jsonToObject("./data/tokens.json")

const chainId = 1;
const web3RpcUrl = "https://bsc-dataseed.binance.org";
const walletAddress = process.env.WALLET_PUBLIC;
const privateKey = process.env.WALLET_PRIVATE;


const swapParams = {
    fromTokenAddress: Tokens.ETH.address, // 1INCH
    toTokenAddress: Tokens.USDT.address, // DAI
    amount: toSendAblePrice(Tokens.ETH, 1),
    fromAddress: walletAddress,
    slippage: 1,
    disableEstimate: false,
    allowPartialFill: false,
// protocols: "UNISWAP_V2,SUSHI,BALANCER,COMPOUND",
    protocols: "UNISWAP_V2"
};

const swapParams2 = {
    fromTokenAddress: Tokens.ETH.address, // 1INCH
    toTokenAddress: Tokens.USDT.address, // DAI
    amount: toSendAblePrice(Tokens.ETH, 1),
    fromAddress: walletAddress,
    slippage: 1,
    disableEstimate: false,
    allowPartialFill: false,
// protocols: "UNISWAP_V2,SUSHI,BALANCER,COMPOUND",
    protocols: "SUSHI"
};

const apiBaseUrl = "https://api.1inch.io/v5.0/" + chainId;

const web3 = new Web3(web3RpcUrl);

function apiRequestUrl(methodName, queryParams) {
    return (
        apiBaseUrl +
        methodName +
        "?" +
        new URLSearchParams(queryParams).toString()
    );
}

function getPrice(fromTokenAddress, walletAddress, amount, toTokenAddress, protocols) {
    return fetch(
        apiRequestUrl("/quote", { fromTokenAddress, walletAddress, amount , toTokenAddress, protocols})
    )
        .then((res) => res.json())
        .then((res) => res);
}

getPrice(swapParams.fromTokenAddress, walletAddress , swapParams.amount, swapParams.toTokenAddress, swapParams.protocols)
    .then((data) => {
        console.log("UNISWAP >> ", toReadAblePrice(data.toToken, data.toTokenAmount))
        console.log("data >> ", toReadAblePrice(Tokens.ETH, data.estimatedGas));
    })
    .catch((err) => console.log("this is the error", err));

getPrice(swapParams2.fromTokenAddress, walletAddress , swapParams2.amount, swapParams2.toTokenAddress, swapParams2.protocols)
    .then((data) => {
        console.log("SUSHI >> ", toReadAblePrice(data.toToken, data.toTokenAmount))
        console.log("data >> ", toReadAblePrice(Tokens.ETH, data.estimatedGas));
    })
    .catch((err) => console.log("this is the error", err));
