const { ethers } = require("ethers");
const fs = require("fs");

const RPC_URL = "https://rpc.testnet.arc.network";
const TRIGGER_ADDRESS = fs.readFileSync("trigger-address.txt", "utf8").trim();

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

  // Send 1 USDC directly to the PaymentTrigger contract
  const amount = ethers.parseUnits("1", 18);
  console.log("Funding pool...");

  const tx = await wallet.sendTransaction({
    to: TRIGGER_ADDRESS,
    value: amount
  });

  console.log("⏳ Tx sent:", tx.hash);
  await tx.wait();
  console.log("✅ Pool funded with 1 USDC");
}

main().catch(console.error);
