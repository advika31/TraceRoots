## System Diagram
+--------------------+
|      FARMER        |
| (Herbs / Fruits /  |
|  Vegetables)       |
+---------+----------+
          |
          | Register Batch
          | (images, quantity,
          |  geo-location)
          v
+--------------------+
|  AI VERIFICATION   |
|--------------------|
| • Herb Fingerprint |
| • Quality Check    |
| • Freshness Score  |
+---------+----------+
          |
          | Authenticity /
          | Quality Hash
          v
+--------------------+
|    BLOCKCHAIN      |
|--------------------|
| • Batch ID         |
| • Verification Hash|
| • Ownership Logs   |
| • Surplus Records  |
+----+--------+------+
     |        |
     |        |
     |        |
     v        v
+--------+  +---------+
|PROCESS |  | SURPLUS |
|OR      |  | TRACKING|
+---+----+  +----+----+
    |            |
    | Ownership  | Donation Proof
    | Transfer   |
    v            v
+---------+  +----------+
|DISTRIB |  |   NGO     |
|UTOR    |  | DASHBOARD |
+----+----+  +----+-----+
     |            |
     | Supply     | Confirm Receipt
     | Chain      |
     v            v
+--------------------+
|     CONSUMER       |
|--------------------|
| QR Scan → View     |
| Origin, AI Proof,  |
| Sustainability,    |
| Donation Impact    |
+--------------------+

## Batch Lifecycle Diagram
[ Registered ]
      ↓
[ Verified ]
      ↓
[ Processed ]
      ↓
[ Distributed ]
     ↙       ↘
[Consumed]  [Donated]


## 1. End-to-End System Flow :
Farmer registers on the TraceRoots platform.
Farmer creates a new batch (herbs, fruits, or vegetables).
Batch data (images, location, quantity, timestamps) is submitted.
AI verification engine processes the batch data.
AI generates an authenticity / quality score.
A verification hash is created from AI results.
Batch metadata and hash are recorded on the blockchain.
Batch moves through processors and distributors.
Ownership transfers are logged on-chain.
Consumer or NGO accesses batch data via QR or dashboard.

## 2. Farmer Batch Registration Flow

Farmer logs into Farmer Dashboard.

Clicks “Register New Batch”.

Enters:

Crop type (herb / fruit / vegetable)

Quantity (kg)

Harvest date

Geo-location

Uploads images / reports

System validates inputs.

Batch is created with a unique Batch ID.

Batch status is set to “Registered”.

## 3. AI Verification Flow
Purpose

To ensure authenticity for herbs and quality/freshness for fruits & vegetables.

Step-by-Step Flow

Input data is received:

Images

Sensor data (if available)

Lab / chemical data (optional)

Data preprocessing is applied:

Image normalization

Noise removal

Feature extraction using AI models:

Herb fingerprinting (species identification)

Produce quality models (freshness, defects)

Similarity matching against reference datasets.

Authenticity or quality score is generated.

AI output is converted into a cryptographic hash.

Hash is sent to the blockchain layer.

## 4. Blockchain Batch Lifecycle Flow

Each batch follows a fixed lifecycle enforced by smart contracts.

Registered

Batch created by farmer.

Verified

AI verification hash attached.

Batch marked authentic / quality-approved.

Processed

Batch processed (cleaning, packaging, drying, etc.).

Processing details logged.

Distributed

Batch transferred to distributors or retailers.

Ownership transfer recorded.

Final State

Consumed (sold to consumer)

Donated (marked as surplus and donated)

All transitions are immutable and timestamped on-chain.

## 5. Smart Contract Functional Flow
Core Smart Contract Functions

registerBatch():
Creates a new batch with metadata and ownership.

verifyBatch():
Attaches AI verification hash and marks batch as verified.

transferOwnership():
Records movement between farmer, processor, distributor.

markSurplus():
Flags excess quantity as surplus.

donateSurplus():
Records donation to NGO with quantity and proof.

## 6. On-Chain vs Off-Chain Data Flow
On-Chain Data (Blockchain)

Batch ID

Verification hash

Ownership history

Status changes

Donation records

Off-Chain Data (Database / IPFS)

Images

AI embeddings

Lab reports

Farmer stories

Consumer-friendly metadata

Blockchain stores only proofs and hashes, not heavy data.

## 7. Surplus Tracking & Donation Flow

Farmer or processor identifies surplus quantity.

Surplus is marked using the dashboard.

Surplus data is recorded on blockchain.

NGOs can view available surplus.

NGO claims surplus.

Delivery is completed.

NGO confirms receipt.

Blockchain records donation proof.

Impact tokens are issued to the donor.

## 8. Impact Token Flow

Smart contract evaluates:

Verified donation

Sustainable practices

Quality compliance

Impact tokens are minted.

Tokens are credited to farmer or processor.

Tokens are visible in the dashboard.

Tokens can be used for incentives, recognition, or future benefits.

## 9. Dashboard Data Flow
Farmer Dashboard

View registered batches

View verification status

View impact tokens

View surplus donated (kg)

Admin / Regulator Dashboard

Audit batch lifecycle

Verify certifications

Detect anomalies or violations

NGO Dashboard

View surplus availability

Claim donations

Upload proof of receipt

Consumer Interface

Scan QR code

View origin, authenticity, and impact

## 10. Consumer QR Code Flow

Consumer scans QR code on product.

QR links to batch ID.

System fetches:

Origin details

AI verification proof

Supply chain history

Sustainability metrics

Donation impact (if any)

Data is displayed in a transparent, story-driven format.

## 11. Security & Trust Flow

AI results are hashed before blockchain storage.

Smart contracts prevent unauthorized changes.

Immutable audit trail ensures traceability.

Role-based access controls dashboards.

No single actor can alter batch history.

## 12. Technology Stack (Text)

AI: Computer Vision models, embedding networks

Blockchain: Ethereum / Polygon / Hyperledger

Backend: Node.js / FastAPI

Frontend: React / Next.js

Storage: IPFS + Cloud Database