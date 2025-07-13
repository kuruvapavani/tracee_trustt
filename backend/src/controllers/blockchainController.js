const getBlockchainStats = async (req, res) => {
  try {
    // Mock data — replace this with real data later from Ethers.js/Web3.js
    const data = {
      network: "Ethereum Sepolia",
      lastBlockNumber: 18542912,
      averageConfirmationTime: "12.5s",
      totalTransactions: 13942,
      totalGasUsed: "3,259,000",
      contractAddress: "0x1234abcd5678efgh9012ijkl3456mnop7890qrst",
      recentActivity: [
        {
          type: "Add Step",
          hash: "0xabc123456789...",
          time: "5 mins ago",
          status: "confirmed",
        },
        {
          type: "Product Registered",
          hash: "0xdef987654321...",
          time: "10 mins ago",
          status: "pending",
        },
        {
          type: "Authenticity Verified",
          hash: "0xaaa555333222...",
          time: "20 mins ago",
          status: "confirmed",
        },
      ],
    };

    res.json(data);
  } catch (err) {
    console.error("Blockchain stats error:", err);
    res.status(500).json({ message: "Failed to fetch blockchain stats" });
  }
};

module.exports = { getBlockchainStats };


// const { ethers } = require("ethers");

// const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL); // e.g., from Alchemy or Infura

// const CONTRACT_ADDRESS = `${process.env.CONTRACT_ADDRESS}`;
// const ABI = require("../config/abis/ProductTraceability.json"); // Replace with your actual ABI JSON

// const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

// const getBlockchainStats = async (req, res) => {
//   try {
//     const network = await provider.getNetwork();
//     const blockNumber = await provider.getBlockNumber();
//     const latestBlock = await provider.getBlock(blockNumber);
//     const gasUsed = latestBlock.gasUsed.toString();

//     // Optional: call smart contract methods
//     // const totalTransactions = await contract.totalTransactions();

//     const data = {
//       network: network.name + " (Chain ID: " + network.chainId + ")",
//       lastBlockNumber: blockNumber,
//       averageConfirmationTime: "12.5s", // Replace with your own calculation if needed
//       totalTransactions: 13942, // Replace with dynamic contract call if available
//       totalGasUsed: gasUsed,
//       contractAddress: CONTRACT_ADDRESS,
//       recentActivity: [], // You can later fetch recent txs using Alchemy/Infura or custom logic
//     };

//     res.json(data);
//   } catch (err) {
//     console.error("Blockchain stats error:", err);
//     res.status(500).json({ message: "Failed to fetch blockchain stats" });
//   }
// };

// module.exports = { getBlockchainStats };
