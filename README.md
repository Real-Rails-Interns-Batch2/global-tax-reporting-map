# 🏛️ Global Tax Reporting Map
### Real Rails Intelligence Library · Governance & Trust Rail

A production-style full-stack intelligence dashboard for monitoring global tax reporting participation, CRS compliance, and financial transparency across 24+ countries — built as part of the Real Rails Internship Program at Boston Institute of Analytics.

---

## 📸 Preview

> Live dark dashboard showing 24 countries with participation status, reporting flows, timeline of adoption, and AI-powered tax intelligence.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🗺️ Country Network Map | Interactive world map with colored participation status markers |
| 🌐 Participation Status | Real-time view of which countries are Active, Partial or Pending |
| 🔄 Reporting Flows | Visualized lines showing tax reporting connections between countries |
| 📅 Timeline of Adoption | Year-by-year view of when countries joined CRS |
| ⚖️ Compare Countries | Side-by-side comparison of transparency scores and risk levels |
| 📊 Analytics | Risk distribution, transparency scores, adoption trends |
| 🤖 AI Tax Intelligence | Ask questions about CRS, OECD, FATCA powered by FastAPI |
| 🔍 Smart Search | Search countries by name in real time |
| 🎯 Filters | Filter by region, status and risk level |
| ❓ Why This Matters | Explanation panel for everyday viewers |
| 🚂 Who Controls The Rail | Key organizations — OECD, CRS, FATCA, EU DAC |
| 📥 Download Sample Data | Export country data as CSV |

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** — React framework with App Router
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first styling
- **Leaflet.js** — Interactive map rendering

### Backend
- **Python FastAPI** — High-performance REST API
- **Uvicorn** — ASGI server
- **Pandas** — Data analysis

### AI & Retrieval
- **FAISS** — Vector database for semantic search
- **HuggingFace Embeddings** — Text embeddings
- **Groq API** — LLM integration
- **LangChain** — RAG architecture
- **Multi-Agent Orchestration** — Specialized AI agents

---

## 🏗️ Architecture

```
User Query
    ↓
Semantic Retrieval (FAISS Vector DB)
    ↓
Multi-Agent Reasoning (LangChain)
    ↓
Groq LLM Response Generation
    ↓
Interactive Dashboard (Next.js)
```

---

## 📂 Project Structure

```
golbaltaxreportingmap/
├── backend/
│   ├── main.py                  # FastAPI app with all endpoints
│   ├── database.py              # Database configuration
│   ├── build_vector_store.py    # FAISS vector store builder
│   ├── docs/                    # CRS and tax documents
│   │   ├── crs_notes.txt
│   │   ├── germany_crs.txt
│   │   ├── oecd_crs.pdf
│   │   └── tax_havens.txt
│   ├── faiss_index/             # Vector embeddings index
│   └── requirements.txt
├── app/
│   ├── components/
│   │   └── WorldMap.tsx         # Interactive Leaflet map
│   ├── data/
│   │   ├── countries.ts         # Country data with coordinates
│   │   └── flows.ts             # Reporting flow connections
│   ├── page.tsx                 # Main dashboard
│   └── layout.tsx
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/Real-Rails-Interns-Batch2/GOLBALTAXREPORTINGMAP.git
cd GOLBALTAXREPORTINGMAP
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Add your GROQ_API_KEY
```

### 3. Start the backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend runs on: `http://localhost:8000`

### 4. Start the frontend
```bash
npm install
npm run dev
```
Frontend runs on: `http://localhost:3000`

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/countries` | GET | All countries with CRS data |
| `/metrics` | GET | Aggregate statistics |
| `/countries/{name}` | GET | Single country details |
| `/countries/risk/{level}` | GET | Filter by risk level |
| `/countries/status/{status}` | GET | Filter by CRS status |
| `/ask` | POST | AI tax intelligence Q&A |
| `/health` | GET | API health check |

---

## 📊 Data Sources

| Source | Status | Description |
|--------|--------|-------------|
| OECD CRS Network | Synthetic | Country participation data |
| World Bank Data | Synthetic | Transparency scores |
| Country Flows | Synthetic | Reporting flow connections |
| Map Tiles | Live | OpenStreetMap via CartoDB |

> **Note:** Synthetic data is clearly labelled per Real Rails manifesto guidelines.

---

## 🎨 Dashboard Panels

### Why This Matters
Automatic exchange of financial information between tax authorities closes loopholes used to hide wealth offshore. Every reporting connection added to the network reduces the shadow financial system and increases fiscal transparency for governments worldwide.

### Who Controls The Rail
- **OECD** — Global Standards Body
- **CRS** — Common Reporting Standard
- **FATCA** — US Tax Compliance Act
- **HMRC (UK)** — Revenue & Customs
- **EU DAC** — EU Directive on Administrative Cooperation

---

## 🔮 Future Improvements

- Real-time OECD data integration
- Live compliance monitoring
- Docker & cloud deployment
- Advanced multi-agent workflows
- Source citation tracing
- Autonomous AI agent system

---

## 👩‍💻 Built By

**Arathy Rajeev**


---

