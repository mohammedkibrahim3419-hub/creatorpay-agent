const { ethers } = require("ethers");
const fs = require("fs");

const RPC_URL = "https://rpc.testnet.arc.network";
const REGISTRY_ADDRESS = fs.readFileSync("registry-address.txt", "utf8").trim();
const registryAbi = JSON.parse(fs.readFileSync("build/contracts_CreatorRegistry_sol_CreatorRegistry.abi", "utf8"));

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const registry = new ethers.Contract(REGISTRY_ADDRESS, registryAbi, provider);

  const address = "0xD6e23224d58D2035A2F8Dfa8eE8A2106822165B6";
  const isRegistered = await registry.isRegistered(address);
  const count = await registry.getCreatorCount();

  console.log("Registry address:", REGISTRY_ADDRESS);
  console.log("Is registered:", isRegistered);
  console.log("Total creators:", count.toString());
}

main().catch(console.error);
