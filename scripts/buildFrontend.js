const fs = require("fs");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>CreatorPay Agent</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap" rel="stylesheet"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.umd.min.js"><\/script>
<style>
:root{--bg:#0a0a0f;--surface:#111118;--border:#1e1e2e;--accent:#00ff88;--text:#e8e8f0;--muted:#5a5a7a;--error:#ff4466;--card:#13131e;}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);color:var(--text);font-family:'Syne',sans-serif;min-height:100vh;}
body::before{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(0,255,136,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.03) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;z-index:0;}
.glow{position:fixed;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(0,255,136,0.06) 0%,transparent 70%);top:-200px;right:-200px;pointer-events:none;z-index:0;}
.container{max-width:900px;margin:0 auto;padding:24px 16px;position:relative;z-index:1;}
header{display:flex;align-items:center;justify-content:space-between;margin-bottom:40px;padding-bottom:20px;border-bottom:1px solid var(--border);}
.logo{display:flex;align-items:center;gap:12px;}
.logo-icon{width:36px;height:36px;background:var(--accent);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;}
.logo-text{font-size:20px;font-weight:800;}
.logo-text span{color:var(--accent);}
.connect-btn{background:transparent;border:1px solid var(--accent);color:var(--accent);padding:8px 20px;border-radius:6px;font-family:'Space Mono',monospace;font-size:12px;cursor:pointer;transition:all 0.2s;}
.connect-btn:hover{background:var(--accent);color:var(--bg);}
.connect-btn.connected{background:rgba(0,255,136,0.1);}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:32px;}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;position:relative;overflow:hidden;}
.stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--accent);opacity:0.5;}
.stat-label{font-family:'Space Mono',monospace;font-size:10px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;}
.stat-value{font-size:22px;font-weight:800;color:var(--accent);}
.tabs{display:flex;gap:4px;margin-bottom:24px;background:var(--surface);padding:4px;border-radius:10px;border:1px solid var(--border);}
.tab{flex:1;padding:10px;text-align:center;border-radius:7px;cursor:pointer;font-size:13px;font-weight:700;color:var(--muted);transition:all 0.2s;border:none;background:transparent;font-family:'Syne',sans-serif;}
.tab.active{background:var(--card);color:var(--accent);border:1px solid var(--border);}
.panel{display:none;}
.panel.active{display:block;}
.card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:24px;margin-bottom:16px;}
.card-title{font-size:14px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:20px;display:flex;align-items:center;gap:8px;}
.card-title::before{content:'';width:3px;height:14px;background:var(--accent);border-radius:2px;display:inline-block;}
.field{margin-bottom:16px;}
label{display:block;font-family:'Space Mono',monospace;font-size:11px;color:var(--muted);margin-bottom:6px;}
input{width:100%;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px 14px;color:var(--text);font-family:'Space Mono',monospace;font-size:13px;outline:none;transition:border-color 0.2s;}
input:focus{border-color:var(--accent);}
input::placeholder{color:var(--muted);}
.btn{width:100%;padding:14px;border-radius:8px;border:none;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s;}
.btn-primary{background:var(--accent);color:var(--bg);}
.btn-primary:hover{opacity:0.9;transform:translateY(-1px);}
.btn-outline{background:transparent;border:1px solid var(--accent);color:var(--accent);}
.btn-outline:hover{background:rgba(0,255,136,0.1);}
.status{padding:12px 16px;border-radius:8px;font-family:'Space Mono',monospace;font-size:12px;margin-top:12px;display:none;}
.status.success{background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);color:var(--accent);display:block;}
.status.error{background:rgba(255,68,102,0.1);border:1px solid rgba(255,68,102,0.3);color:var(--error);display:block;}
.status.loading{background:rgba(123,94,167,0.1);border:1px solid rgba(123,94,167,0.3);color:#b39ddb;display:block;}
.log{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:16px;height:180px;overflow-y:auto;font-family:'Space Mono',monospace;font-size:11px;line-height:1.8;}
.log-entry{color:var(--muted);}
.log-entry.success{color:var(--accent);}
.log-entry.error{color:var(--error);}
.log-entry.info{color:#b39ddb;}
.address{font-family:'Space Mono',monospace;font-size:11px;color:var(--muted);background:var(--surface);padding:8px 12px;border-radius:6px;border:1px solid var(--border);word-break:break-all;margin-top:8px;}
.creator-item{display:flex;align-items:center;justify-content:space-between;padding:12px;background:var(--surface);border:1px solid var(--border);border-radius:8px;margin-bottom:8px;font-family:'Space Mono',monospace;font-size:11px;}
.creator-badge{background:rgba(0,255,136,0.1);color:var(--accent);padding:3px 8px;border-radius:4px;font-size:10px;}
.network-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.2);padding:4px 10px;border-radius:20px;font-family:'Space Mono',monospace;font-size:10px;color:var(--accent);}
.dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:pulse 2s infinite;}
.wallet-info{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.3;}}
@media(max-width:600px){.stats{grid-template-columns:1fr;}header{flex-direction:column;gap:12px;}}
</style>
</head>
<body>
<div class="glow"></div>
<div class="container">
<header>
<div class="logo"><div class="logo-icon">⚡</div><div class="logo-text">Creator<span>Pay</span></div></div>
<div class="wallet-info">
<div class="network-badge"><div class="dot"></div>Arc Testnet</div>
<button class="connect-btn" id="connectBtn" onclick="connectWallet()">Connect Wallet</button>
</div>
</header>
<div class="stats">
<div class="stat-card"><div class="stat-label">Pool Balance</div><div class="stat-value" id="poolBalance">—</div></div>
<div class="stat-card"><div class="stat-label">Total Creators</div><div class="stat-value" id="totalCreators">—</div></div>
<div class="stat-card"><div class="stat-label">Your Earnings</div><div class="stat-value" id="myEarnings">—</div></div>
</div>
<div class="tabs">
<button class="tab active" onclick="switchTab('creator')">🎨 Creator</button>
<button class="tab" onclick="switchTab('admin')">⚙️ Admin</button>
<button class="tab" onclick="switchTab('activity')">📋 Activity</button>
</div>
<div class="panel active" id="panel-creator">
<div class="card">
<div class="card-title">Register as Creator</div>
<div class="field"><label>CONTENT ID</label><input type="text" id="contentId" placeholder="@yourhandle"/></div>
<button class="btn btn-primary" onclick="registerCreator()">Register</button>
<div class="status" id="registerStatus"></div>
</div>
<div class="card">
<div class="card-title">Your Profile</div>
<button class="btn btn-outline" onclick="loadProfile()" style="margin-bottom:12px;">Load Profile</button>
<div id="profileData"></div>
</div>
</div>
<div class="panel" id="panel-admin">
<div class="card">
<div class="card-title">Fund Pool</div>
<div class="field"><label>AMOUNT (USDC)</label><input type="number" id="fundAmount" placeholder="1.0" step="0.1"/></div>
<button class="btn btn-primary" onclick="fundPool()">Fund Pool</button>
<div class="status" id="fundStatus"></div>
</div>
<div class="card">
<div class="card-title">Trigger Payout</div>
<div class="field"><label>CREATOR WALLET</label><input type="text" id="payoutCreator" placeholder="0x..."/></div>
<div class="field"><label>ENGAGEMENTS</label><input type="number" id="payoutEngagements" placeholder="10"/></div>
<button class="btn btn-primary" onclick="triggerPayout()">Trigger Payout</button>
<div class="status" id="payoutStatus"></div>
</div>
<div class="card">
<div class="card-title">Contract Addresses</div>
<label>REGISTRY</label><div class="address">0x0727cE415814C23E74B59D754C4020dB2E28651c</div>
<label style="margin-top:12px;">TRIGGER</label><div class="address">0xD4992Fbff51f3E75432569D7F1a808BD02bf0f04</div>
</div>
</div>
<div class="panel" id="panel-activity">
<div class="card">
<div class="card-title">Activity Log</div>
<div class="log" id="activityLog">
<div class="log-entry info">> CreatorPay Agent initialized</div>
</div>
<button class="btn btn-outline" style="margin-top:12px;" onclick="clearLog()">Clear Log</button>
</div>
</div>
</div>
<script>
const REGISTRY_ADDRESS="0x0727cE415814C23E74B59D754C4020dB2E28651c";
const TRIGGER_ADDRESS="0xD4992Fbff51f3E75432569D7F1a808BD02bf0f04";
const RPC_URL="https://rpc.testnet.arc.network";
const REGISTRY_ABI=["function register(string calldata contentId) external","function isRegistered(address wallet) external view returns (bool)","function getCreator(address wallet) external view returns (tuple(address wallet,string contentId,bool isRegistered,uint256 totalEarned))","function getCreatorCount() external view returns (uint256)"];
const TRIGGER_ABI=["function triggerPayout(address creator,uint256 engagements) external","function getPoolBalance() external view returns (uint256)"];
let provider,signer,userAddress;
function log(msg,type="info"){const l=document.getElementById("activityLog");const e=document.createElement("div");e.className="log-entry "+type;e.textContent="["+new Date().toLocaleTimeString()+"] "+msg;l.appendChild(e);l.scrollTop=l.scrollHeight;}
function clearLog(){document.getElementById("activityLog").innerHTML="";}
function setStatus(id,msg,type){const e=document.getElementById(id);e.textContent=msg;e.className="status "+type;}
function switchTab(tab){document.querySelectorAll(".tab").forEach((t,i)=>{t.classList.toggle("active",["creator","admin","activity"][i]===tab);});document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));document.getElementById("panel-"+tab).classList.add("active");}
async function connectWallet(){if(!window.ethereum){alert("Install MetaMask");return;}try{provider=new ethers.BrowserProvider(window.ethereum);await provider.send("eth_requestAccounts",[]);signer=await provider.getSigner();userAddress=await signer.getAddress();const btn=document.getElementById("connectBtn");btn.textContent=userAddress.slice(0,6)+"..."+userAddress.slice(-4);btn.classList.add("connected");log("Wallet connected: "+userAddress,"success");await loadStats();}catch(e){log("Connection failed: "+e.message,"error");}}
async function loadStats(){try{const rp=new ethers.JsonRpcProvider(RPC_URL);const reg=new ethers.Contract(REGISTRY_ADDRESS,REGISTRY_ABI,rp);const trig=new ethers.Contract(TRIGGER_ADDRESS,TRIGGER_ABI,rp);const count=await reg.getCreatorCount();document.getElementById("totalCreators").textContent=count.toString();try{const bal=await trig.getPoolBalance();document.getElementById("poolBalance").textContent=ethers.formatUnits(bal,18).slice(0,6)+" USDC";}catch{document.getElementById("poolBalance").textContent="N/A";}if(userAddress){const c=await reg.getCreator(userAddress);document.getElementById("myEarnings").textContent=ethers.formatUnits(c.totalEarned,18).slice(0,6)+" USDC";}log("Stats loaded","success");}catch(e){log("Stats failed: "+e.message,"error");}}
async function registerCreator(){if(!signer){alert("Connect wallet first");return;}const cid=document.getElementById("contentId").value.trim();if(!cid){setStatus("registerStatus","Content ID required","error");return;}setStatus("registerStatus","Registering...","loading");try{const reg=new ethers.Contract(REGISTRY_ADDRESS,REGISTRY_ABI,signer);const tx=await reg.register(cid);await tx.wait();setStatus("registerStatus","Registered!","success");log("Creator registered","success");await loadStats();}catch(e){const m=e.reason||e.message;setStatus("registerStatus","Error: "+m,"error");log("Failed: "+m,"error");}}
async function loadProfile(){if(!signer){alert("Connect wallet first");return;}try{const rp=new ethers.JsonRpcProvider(RPC_URL);const reg=new ethers.Contract(REGISTRY_ADDRESS,REGISTRY_ABI,rp);const c=await reg.getCreator(userAddress);const el=document.getElementById("profileData");if(!c.isRegistered){el.innerHTML='<div class="status error" style="display:block;">Not registered.</div>';return;}el.innerHTML='<div class="creator-item"><span>Content ID</span><span class="creator-badge">'+c.contentId+'</span></div><div class="creator-item"><span>Earned</span><span style="color:var(--accent)">'+ethers.formatUnits(c.totalEarned,18).slice(0,8)+' USDC</span></div><div class="creator-item"><span>Status</span><span class="creator-badge">Active</span></div>';log("Profile loaded","success");}catch(e){log("Profile failed: "+e.message,"error");}}
async function fundPool(){if(!signer){alert("Connect wallet first");return;}const amt=document.getElementById("fundAmount").value;if(!amt){setStatus("fundStatus","Enter amount","error");return;}setStatus("fundStatus","Funding...","loading");try{const tx=await signer.sendTransaction({to:TRIGGER_ADDRESS,value:ethers.parseUnits(amt,18)});await tx.wait();setStatus("fundStatus","Pool funded!","success");log("Pool funded: "+amt+" USDC","success");await loadStats();}catch(e){const m=e.reason||e.message;setStatus("fundStatus","Error: "+m,"error");log("Fund failed: "+m,"error");}}
async function triggerPayout(){if(!signer){alert("Connect wallet first");return;}const cr=document.getElementById("payoutCreator").value.trim();const eng=document.getElementById("payoutEngagements").value;if(!cr||!eng){setStatus("payoutStatus","Fill all fields","error");return;}setStatus("payoutStatus","Triggering...","loading");try{const trig=new ethers.Contract(TRIGGER_ADDRESS,TRIGGER_ABI,signer);const tx=await trig.triggerPayout(cr,eng);await tx.wait();setStatus("payoutStatus","Payout confirmed!","success");log("Payout confirmed for "+cr,"success");await loadStats();}catch(e){const m=e.reason||e.message;setStatus("payoutStatus","Error: "+m,"error");log("Payout failed: "+m,"error");}}
window.addEventListener("load",async()=>{try{await loadStats();}catch(e){}});
<\/script>
</body>
</html>`;

fs.writeFileSync("index.html", html);
console.log("index.html created successfully");
