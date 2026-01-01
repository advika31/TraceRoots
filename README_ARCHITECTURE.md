# 🏗️ System Architecture – TraceRoots

## High-Level Architecture

Farmer → AI Verification → Blockchain → Supply Chain → Consumer
flowchart LR
    Farmer -->|Batch Data| AI
    AI -->|Authenticity Score| Blockchain
    Blockchain --> Processor
    Processor --> Distributor
    Distributor --> Consumer


### Data Flow Diagram (DFD – Level 1)

```md
```mermaid
flowchart TD
    Farmer --> AIEngine
    AIEngine --> Blockchain
    Blockchain --> Dashboard
    Dashboard --> Consumer
    Dashboard --> NGO
    Dashboard --> Admin


### Blockchain Design

**On-Chain**
- Batch ID
- Origin (Geo-tag)
- Verification Hash
- Ownership Transfers
- Surplus Donation Proof

**Off-Chain**
- Images
- AI embeddings
- Certificates
- Farmer stories (IPFS / DB)

---

## 4️⃣ Technical Flows README

📌 **Purpose:** Impress developers & evaluators

Create **README_TECHNICAL_FLOWS.md**

```md
# ⚙️ Technical Flows – TraceRoots

## 🤖 AI Verification Pipeline

```mermaid
flowchart LR
    Input --> Preprocessing
    Preprocessing --> Model
    Model --> SimilarityCheck
    SimilarityCheck --> AuthenticityScore
