const hre = require("hardhat");

async function main() {
  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const TraceRoots = await hre.ethers.getContractFactory("TraceRoots");
  const traceRoots = TraceRoots.attach(CONTRACT_ADDRESS);

  console.log("Connected to TraceRoots contract");

  // Store batch
  const tx = await traceRoots.addBatch(
    "BATCH_001",
    "Organic Wheat",
    "QmX9...OriginHash", // pretend IPFS / GPS hash
    1735689600 // expiry date (Unix timestamp)
  );

  console.log("Transaction hash:", tx.hash);
  await tx.wait();

  // Fetch batch
  const batch = await traceRoots.getBatch("BATCH_001");

  console.log("Batch fetched from blockchain:");
  console.log("Batch ID:", batch[0]);
  console.log("Crop Type:", batch[1]);
  console.log("Origin Hash:", batch[2]);
  console.log("Expiry Date:", batch[3].toString());
  console.log("Blockchain Timestamp:", batch[4].toString());
}

main().catch(console.error);
