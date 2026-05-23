const { ethers } = require("ethers");
const fs = require("fs");

const RPC_URL = "https://rpc.testnet.arc.network";
const REGISTRY_ADDRESS = fs.readFileSync("registry-address.txt", "utf8").trim();
const TRIGGER_ADDRESS = fs.readFileSync("trigger-address.txt", "utf8").trim();
const PRIVATE_KEY = fs.readFileSync(".owner.key", "utf8").trim();
const registryAbi = JSON.parse(fs.readFileSync("build/contracts_CreatorRegistry_sol_CreatorRegistry.abi", "utf8"));

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const registry = new ethers.Contract(REGISTRY_ADDRESS, registryAbi, wallet);

  console.log("Setting trigger contract...");
  const tx = await registry.setTriggerContract(TRIGGER_ADDRESS);
  await tx.wait();
  console.log("✅ Trigger contract authorized in registry");
}

main().catch(console.error);
