const { ethers } = require("ethers");
const fs = require("fs");

const abi = JSON.parse(fs.readFileSync("build/contracts_CreatorRegistry_sol_CreatorRegistry.abi", "utf8"));
const bin = fs.readFileSync("build/contracts_CreatorRegistry_sol_CreatorRegistry.bin", "utf8");

const RPC_URL = "https://rpc.testnet.arc.network";

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  const privateKey = await new Promise((resolve) => {
    process.stdout.write("Enter your private key: ");
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim());
      process.stdin.destroy();
    });
  });

  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("Deploying from:", wallet.address);

  const factory = new ethers.ContractFactory(abi, bin, wallet);
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("CreatorRegistry deployed at:", address);
  fs.writeFileSync("registry-address.txt", address);
}

main().catch(console.error);
