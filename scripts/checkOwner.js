const { ethers } = require("ethers");
const fs = require("fs");

const RPC_URL = "https://rpc.testnet.arc.network";
const TRIGGER_ADDRESS = fs.readFileSync("trigger-address.txt", "utf8").trim();
const triggerAbi = JSON.parse(fs.readFileSync("build/contracts_PaymentTrigger_sol_PaymentTrigger.abi", "utf8"));

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const trigger = new ethers.Contract(TRIGGER_ADDRESS, triggerAbi, provider);
  const owner = await trigger.owner();
  console.log("Contract owner:", owner);
  console.log("Trigger address:", TRIGGER_ADDRESS);
}

main().catch(console.error);
