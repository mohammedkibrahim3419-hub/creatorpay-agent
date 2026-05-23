const { ethers } = require("ethers");

const RPC_URL = "https://rpc.testnet.arc.network";
const WALLET = "0x721cED542f34596135483113A977e6db0B19F7a4";

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const balance = await provider.getBalance(WALLET);
  console.log("Native USDC balance:", ethers.formatUnits(balance, 18), "USDC");
}

main().catch(console.error);
