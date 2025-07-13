const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const contractABI = require("./abis/ProductTraceability.json").abi;

// Connect to blockchain using a provider and a wallet signer
const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL); // e.g., from Hardhat, Infura, Alchemy
const wallet = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, provider); // Use wallet with signer

// Load contract address from .env
const contractAddress = process.env.CONTRACT_ADDRESS;

// Initialize contract with signer
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

module.exports = contract;