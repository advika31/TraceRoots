## DFD Level 0
flowchart LR
    Farmer[Farmer]
    Collector[Collector]
    Processor[Processor]
    Regulator[Regulator]
    Consumer[Consumer]

    System[TraceRoots Platform]

    Farmer -->|Register batch data| System
    Collector -->|Update logistics & pickup| System
    Processor -->|Processing updates| System
    Regulator -->|Audit & compliance queries| System
    Consumer -->|QR Scan request| System

    System -->|Batch status & tokens| Farmer
    System -->|Traceability dashboard| Regulator
    System -->|Supply chain history| Processor
    System -->|AI-generated journey video| Consumer


## DFD Level 1
flowchart TD
    Farmer --> P1[1. Batch Registration Service]
    Collector --> P2[2. Collection Update Service]
    Processor --> P3[3. Processing Update Service]
    Regulator --> P4[4. Audit & Compliance Service]
    Consumer --> P5[5. QR Consumer Experience Service]

    P1 --> D1[(Off-chain Database)]
    P2 --> D1
    P3 --> D1

    P1 --> P6[6. AI Verification Engine]
    P6 --> D2[(Blockchain Ledger)]

    P2 --> D2
    P3 --> D2

    P4 --> D1
    P4 --> D2

    P5 --> P7[7. Journey Builder Engine]
    D1 --> P7
    D2 --> P7

    P7 --> P8[8. AI Video Generator]
    P8 --> Consumer

## DFD Level 2
# Consumer QR flow 
flowchart TD
    Consumer --> QR[Scan QR Code]

    QR --> P1[Fetch Batch ID]
    P1 --> D2[(Blockchain Ledger)]
    P1 --> D1[(Off-chain Database)]

    D2 --> P2[Extract Verified Journey Logs]
    D1 --> P3[Fetch Media, Locations, Metadata]

    P2 --> P4[Journey Story Builder]
    P3 --> P4

    P4 --> P5[Script Generation Engine]
    P5 --> P6[AI Video Synthesis Engine]

    P6 --> Consumer[Personalized Product Journey Video]
# AI verification flow
flowchart TD
    Farmer --> Input[Image + Batch Data Upload]

    Input --> P1[Preprocessing Layer]
    P1 --> P2[Computer Vision Models]

    P2 --> P3[Quality & Authenticity Scoring]
    P3 --> P4[Hash Generator]

    P4 --> D2[(Blockchain Ledger)]
    Input --> D1[(Off-chain Storage)]

# Regulator Audit Flow
flowchart TD
    Regulator --> Query[Request Batch History]

    Query --> P1[Audit Engine]
    P1 --> D2[(Blockchain Ledger)]
    P1 --> D1[(Off-chain Database)]

    D2 --> Report[Immutable Proof Report]
    D1 --> Report

    Report --> Regulator
