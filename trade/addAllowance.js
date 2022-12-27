import Web3 from "web3"
import fetch from "node-fetch"
import yesno from "yesno"
import dotenv from 'dotenv'
dotenv.config()

const chainId = 1;
const web3RpcUrl = "https://bsc-dataseed.binance.org";
const walletAddress = process.env.WALLET_PUBLIC; // Set your wallet address
const privateKey = process.env.WALLET_PRIVATE; // Set private key of your wallet. Be careful! Don't share this key to anyone!

const swapParams = {
    fromTokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
    toTokenAddress: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3", // DAI
    amount: "1",
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
async function broadCastRawTransaction(rawTransaction) {
    return fetch(broadcastApiUrl, {
        method: "post",
        body: JSON.stringify({ rawTransaction }),
        headers: { "Content-Type": "application/json" },
    })
        .then((res) => res.json())
        .then((res) => {
            return res.transactionHash;
        });
}
async function signAndSendTransaction(transaction) {
    const { rawTransaction } = await web3.eth.accounts.signTransaction(
        transaction,
        privateKey
    );
    return await broadCastRawTransaction(rawTransaction);
}
async function buildTxForApproveTradeWithRouter(tokenAddress, amount) {
    const url = apiRequestUrl(
        "/approve/transaction",
        amount ? { tokenAddress, amount } : { tokenAddress }
    );
    const transaction = await fetch(url).then((res) => res.json());
    const gasLimit = await web3.eth.estimateGas({
        ...transaction,
        from: walletAddress,
    });
    return { ...transaction, gas: gasLimit };
}
// First, let's build the body of the transaction
const transactionForSign = await buildTxForApproveTradeWithRouter(swapParams.fromTokenAddress);
console.log('Transaction for approve: ', transactionForSign);
const ok = await yesno({
    question:
        "Do you want to send a transaction to approve trade with 1inch router?",
});
// Before signing a transaction, make sure that all parameters in it are specified correctly
//if (!ok) {return false}
// Send a transaction and get its hash
const approveTxHash = await signAndSendTransaction(transactionForSign);
console.log("Approve tx hash: ", approveTxHash);
