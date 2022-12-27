import Web3 from "web3";
import fetch from "node-fetch";
import yesno from "yesno";
import dotenv from 'dotenv'
dotenv.config()

const chainId = 56;
const web3RpcUrl = "https://bsc-dataseed.binance.org";
const walletAddress = process.env.WALLET_PUBLIC;
const privateKey = process.env.WALLLET_PRIVATE;

const swapParams = {
    fromTokenAddress: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe", // 1INCH
    toTokenAddress: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3", // DAI
    amount: "100000000000000000",
    fromAddress: walletAddress,
    slippage: 1,
    disableEstimate: false,
    allowPartialFill: false,
};

const broadcastApiUrl =
    "https://tx-gateway.1inch.io/v1.1/" + chainId + "/broadcast";

const apiBaseUrl = "https://api.1inch.io/v4.0/" + chainId;

const web3 = new Web3(web3RpcUrl);

function apiRequestUrl(methodName, queryParams) {
    return (
        apiBaseUrl +
        methodName +
        "?" +
        new URLSearchParams(queryParams).toString()
    );
}

function checkAllowance(tokenAddress, walletAddress) {
    return fetch(
        apiRequestUrl("/approve/allowance", { tokenAddress, walletAddress })
    )
        .then((res) => res.json())
        .then((res) => res);
}

checkAllowance(swapParams.fromTokenAddress, walletAddress)
    .then((data) => {
        console.log("Allowance: ay rahi", data);
    })
    .catch((err) => console.log("this is the error", err));
