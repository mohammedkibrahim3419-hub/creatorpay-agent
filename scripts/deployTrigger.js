const { ethers } = require("ethers");
const fs = require("fs");

const abi = JSON.parse(fs.readFileSync("build/contracts_PaymentTrigger_sol_PaymentTrigger.abi", "utf8"));
const bin = fs.readFileSync("build/contracts_PaymentTrigger_sol_PaymentTrigger.bin", "utf8");

const RPC_URL = "https://rpc.testnet.arc.network";
const REGISTRY_ADDRESS = fs.readFileSync("registry-address.txt", "utf8").trim();
const PAYOUT_PER_ENGAGEMENT = ethers.parseUnits("0.001", 18); // 0.001 USDC per engagement

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
  const contract = await factory.deploy(REGISTRY_ADDRESS, PAYOUT_PER_ENGAGEMENT);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("PaymentTrigger deployed at:", address);
  fs.writeFileSync("trigger-address.txt", address);
}

main().catch(console.error);
