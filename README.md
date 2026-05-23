# CreatorPay Agent ⚡

> Autonomous AI agent that distributes USDC micropayments to content creators based on onchain engagement triggers — built on Arc Testnet (Circle)

**Hackathon:** Stablecoins Commerce Stack Challenge — Track 4: Agentic Economy  
**Live dApp:** https://mohammedkibrahim3419-hub.github.io/creatorpay-agent/

---

## The Problem

Content creators get paid last. Platforms hold the money, decide the rules, and pay weeks later — if at all. No transparent, programmable system pays creators the moment they earn it.

## The Solution

CreatorPay Agent is an autonomous payment system where:
- Creators register their wallet onchain
- An AI agent monitors engagement triggers
- USDC micropayments are distributed automatically — no human input, no delay

---

## Architecture



![Architecture](architecture.svg)



**3 layers:**
1. **Frontend dApp** — Creator registration, admin panel, activity log
2. **Smart Contracts** — CreatorRegistry + PaymentTrigger on Arc Testnet
3. **Autonomous Agent** — Node.js script that monitors and fires payouts

---

## Circle Products Used

| Product | Usage |
|---------|-------|
| **USDC** | Native settlement token for all payouts |
| **Arc Testnet** | L1 blockchain for contract deployment |

---

## Contract Addresses (Arc Testnet)

| Contract | Address |
|----------|---------|
| CreatorRegistry | 0x0727cE415814C23E74B59D754C4020dB2E28651c |
| PaymentTrigger | 0xD4992Fbff51f3E75432569D7F1a808BD02bf0f04 |

---

## Setup

### Requirements
- Node.js
- Termux (Android) or any terminal
- MetaMask with Arc Testnet configured

### Install
```bash
git clone https://github.com/mohammedkibrahim3419-hub/creatorpay-agent.git
cd creatorpay-agent
npm install
```

### Compile Contracts
```bash
npm install -g solc
solcjs --abi --bin contracts/CreatorRegistry.sol -o build/
solcjs --abi --bin contracts/PaymentTrigger.sol -o build/
```

### Deploy
```bash
node scripts/deployRegistry.js
node scripts/deployTrigger.js
node scripts/setup.js
```

### Run
```bash
node scripts/registerCreator.js
node scripts/fundPool.js
node scripts/agent.js
```

---

## How It Works

1. Creator connects wallet to dApp and registers with their content ID
2. Admin funds the USDC pool via PaymentTrigger contract
3. Agent runs, checks registered creators against engagement data
4. Agent calls triggerPayout(creator, engagements) automatically
5. USDC transfers directly to creator wallet onchain
6. PaymentTrigger updates earnings in CreatorRegistry

---

## Circle Product Feedback

**Why I chose these products:**
Arc's native USDC token made micropayments simple — no wrapping, no bridging, just programmable money. Deterministic finality meant the agent could confirm payouts reliably without complex retry logic.

**What worked well:**
- Native USDC as gas token eliminates the two-token UX problem
- Fast finality made the agent loop clean and predictable
- RPC endpoint stable for read operations

**What could be improved:**
- Arc Testnet RPC occasionally times out on write operations — a retry-aware SDK would help
- A Circle Wallets integration guide for Node.js on mobile environments would lower the barrier for mobile-first builders
- Nanopayments documentation needs more end-to-end examples

**Recommendations:**
- Add an Arc Testnet block explorer for easier transaction verification during development
- Provide a dedicated mobile builder guide — a significant portion of Web3 builders in emerging markets build entirely on Android

---

## Built By

**Kebs** — Web3 builder, ambassador, content creator  
- GitHub: https://github.com/mohammedkibrahim3419-hub  
- X: https://x.com/kibrahimD70212  
- Built entirely on Android (Redmi) using Termux
