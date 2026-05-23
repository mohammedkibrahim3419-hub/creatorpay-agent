const { ethers } = require("ethers");
const fs = require("fs");

const RPC_URL = "https://rpc.testnet.arc.network";
const REGISTRY_ADDRESS = fs.readFileSync("registry-address.txt", "utf8").trim();
const registryAbi = JSON.parse(fs.readFileSync("build/contracts_CreatorRegistry_sol_CreatorRegistry.abi", "utf8"));

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const registry = new ethers.Contract(REGISTRY_ADDRESS, registryAbi, provider);

  const address = "0x721cED542f34596135483113A977e6db0B19F7a4";
  const isRegistered = await registry.isRegistered(address);
  const creator = await registry.getCreator(address);

  console.log("Is registered:", isRegistered);
  console.log("Creator data:", creator);
}

main().catch(console.error);
