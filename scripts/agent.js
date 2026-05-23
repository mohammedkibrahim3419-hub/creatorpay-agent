const { ethers } = require("ethers");
const fs = require("fs");

const RPC_URL = "https://rpc.testnet.arc.network";
const REGISTRY_ADDRESS = fs.readFileSync("registry-address.txt", "utf8").trim();
const TRIGGER_ADDRESS = fs.readFileSync("trigger-address.txt", "utf8").trim();
const PRIVATE_KEY = fs.readFileSync(".owner.key", "utf8").trim();

const triggerAbi = JSON.parse(fs.readFileSync("build/contracts_PaymentTrigger_sol_PaymentTrigger.abi", "utf8"));
const registryAbi = JSON.parse(fs.readFileSync("build/contracts_CreatorRegistry_sol_CreatorRegistry.abi", "utf8"));

const MOCK_ENGAGEMENTS = [
  { creator: "0x8d1e9fcB6A6b056a1C12D84B04a12c84f4353B07", engagements: 10 },
];

async function runAgent() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const registry = new ethers.Contract(REGISTRY_ADDRESS, registryAbi, wallet);
  const trigger = new ethers.Contract(TRIGGER_ADDRESS, triggerAbi, wallet);

  console.log("🤖 CreatorPay Agent started...\n");
  console.log("Registry:", REGISTRY_ADDRESS);
  console.log("Trigger:", TRIGGER_ADDRESS);
  console.log("Owner:", wallet.address, "\n");

  for (const entry of MOCK_ENGAGEMENTS) {
    const normalized = ethers.getAddress(entry.creator);
    const isRegistered = await registry.isRegistered(normalized);
    console.log(`Checking ${normalized} — registered: ${isRegistered}`);

    if (!isRegistered) {
      console.log(`⚠️  Not registered — skipping`);
      continue;
    }

    console.log(`🔍 Processing — ${entry.engagements} engagements`);

    try {
      const tx = await trigger.triggerPayout(normalized, entry.engagements);
      console.log(`⏳ Tx sent: ${tx.hash}`);
      await tx.wait();
      console.log(`✅ Payout confirmed!\n`);
    } catch (err) {
      console.log(`❌ Payout failed: ${err.message}\n`);
    }
  }

  console.log("✅ Agent run complete");
}

runAgent().catch(console.error);
