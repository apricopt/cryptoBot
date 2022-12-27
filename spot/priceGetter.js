import { BigNumber } from 'ethers'
import Web3 from 'web3'
import dotenv from 'dotenv'
dotenv.config()

const yourInfuraKey = process.env.INFURA;
const web3 = new Web3(`https://mainnet.infura.io/v3/${yourInfuraKey}`);

import OffChainOracleAbi from "./abi/offchainOracleAbi.js";


const offChainOracleAddress = "0x07D91f5fb9Bf7798734C3f606dB065549F6893bb";
const offChainOracleContract = new web3.eth.Contract(
    JSON.parse(OffChainOracleAbi),
    offChainOracleAddress
);

const token = {
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
    decimals: 6
};

offChainOracleContract.methods
    .getRateToEth(
        token.address, // source token
        true // use source wrappers
    )
    .call()
    .then((rate) => {
        const numerator = BigNumber.from(10).pow(token.decimals);
        const denominator = BigNumber.from(10).pow(18); // eth decimals
        const price = BigNumber.from(rate).mul(numerator).div(denominator);
        console.log(price.toString()); // 472685293218315
    })
    .catch(console.log);
