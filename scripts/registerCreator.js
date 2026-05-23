const { ethers } = require("ethers");
const fs = require("fs");

const RPC_URL = "https://rpc.testnet.arc.network";
const REGISTRY_ADDRESS = fs.readFileSync("registry-address.txt", "utf8").trim();
const registryAbi = JSON.parse(fs.readFileSync("build/contracts_CreatorRegistry_sol_CreatorRegistry.abi", "utf8"));

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  const privateKey = await new Promise((resolve) => {
    process.stdout.write("Enter private key: ");
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim());
      process.stdin.destroy();
    });
  });

  const wallet = new ethers.Wallet(privateKey, provider);
  const registry = new ethers.Contract(REGISTRY_ADDRESS, registryAbi, wallet);

  const tx = await registry.register("@kebspolygon");
  console.log("⏳ Registering...", tx.hash);
  await tx.wait();
  console.log("✅ Creator registered! Address:", wallet.address);
}

main().catch(console.error);
