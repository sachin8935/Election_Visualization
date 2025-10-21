# 🗳️ Indian Lok Sabha Election Analytics Dashboard

> A comprehensive full-stack AI-powered analytics platform for exploring Indian parliamentary election data (1991-2019) with interactive visualizations and natural language querying.

[![Production Ready](https://img.shields.io/badge/Production-Ready-brightgreen)]()
[![React](https://img.shields.io/badge/React-19.1.1-blue)]()
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)]()
[![AI Powered](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-purple)]()

---

## � Key Features

### 📊 **6 Interactive Visualizations**
1. **Party-wise Seat Share** - Track seat distribution across political parties over time
2. **State-wise Voter Turnout Map** - Geographic visualization of voter participation
3. **Gender Representation Timeline** - Analyze male/female candidate trends across elections
4. **Top Parties by Vote Share** - Donut chart showing vote percentage distribution
5. **Victory Margin Distribution** - Histogram revealing close races vs landslide victories
6. **Advanced Search** - Find candidates and constituencies with real-time filtering

### 🤖 **AI-Powered Natural Language Queries**
- Ask questions in plain English about election data
- **Powered by Google Gemini 2.5 Flash** with 200+ lines of schema context
- Multi-layer security validation (SQL injection prevention)
- Smart party classification (7 national parties vs regional parties)
- Example queries:
  - "Which state had the highest voter turnout in the latest general election?"
  - "Which party gained or lost the most seats between two consecutive elections?"
  - "How has the vote share of national vs regional parties changed over time?"

### 🎨 **Modern User Experience**
- Rainbow glowing "Ask AI" button with pulsing animation
- 4-step loading animation (Brain → Zap → Database → Sparkles)
- Responsive design for all screen sizes
- Real-time data fetching with error handling
- Dark-themed SQL query display

---

## 🏗️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI Library |
| **Vite** | 7.1.7 | Build Tool & Dev Server |
| **Tailwind CSS** | 4.1.14 | Styling Framework |
| **Recharts** | 3.3.0 | Data Visualization |
| **Axios** | 1.12.2 | HTTP Client |
| **React Router** | 7.9.4 | Navigation |
| **Lucide React** | 0.546.0 | Icon Library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime Environment |
| **Express** | 5.1.0 | Web Framework |
| **PostgreSQL** | Latest | Database (Neon) |
| **pg** | 8.16.3 | PostgreSQL Client |
| **Google Gemini AI** | 0.24.1 | Natural Language Processing |
| **dotenv** | 17.2.3 | Environment Configuration |
| **CORS** | 2.8.5 | Cross-Origin Support |

---

## 🚀 Quick Start


### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd election

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install
```

### Configuration

#### Backend Environment Variables
```bash
cd server
cp .env.example .env
# Edit .env with your credentials
```

**Required variables in `server/.env`:**
```env
PG_URI=postgresql://username:password@hostname.neon.tech/database_name?sslmode=require
GEMINI_API_KEY=your_gemini_api_key_here
PORT=4000
NODE_ENV=development
```

#### Frontend Environment Variables
```bash
cd client
cp .env.example .env
```

**Required variables in `client/.env`:**
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### Start Development Servers

```bash
# Terminal 1 - Backend Server
cd server
npm start
# Server runs on http://localhost:4000

# Terminal 2 - Frontend Dev Server
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

🎉 **Open http://localhost:5173 in your browser!**

---

## 📡 API Documentation

### Analytics Endpoints

| Endpoint | Method | Description | Query Params |
|----------|--------|-------------|--------------|
| `/api/analytics/party-seats` | GET | Party-wise seat distribution | `year`, `years`, `states`, `parties` |
| `/api/analytics/state-turnout` | GET | State-wise voter turnout | `year`, `years`, `states` |
| `/api/analytics/gender-representation` | GET | Gender-based candidate analysis | `years`, `states`, `parties` |
| `/api/analytics/top-parties` | GET | Top parties by vote share | `year`, `limit` |
| `/api/analytics/margin-distribution` | GET | Victory margin statistics | `year`, `states`, `parties` |
| `/api/search` | GET | Search candidates/constituencies | `query`, `years`, `states`, `limit` |
| `/api/filters/all` | GET | Get all available filter options | - |
| `/api/ai/query` | POST | AI-powered natural language queries | `{ query: "your question" }` |

---

## 🎯 AI Query System

### How It Works

1. **User Input**: Natural language question (e.g., "Which state had highest turnout?")
2. **AI Processing**: Gemini 2.5 Flash generates SQL query with 200+ lines of context
3. **Security Validation**: Multi-layer checks prevent SQL injection
4. **Query Execution**: Parameterized SQL runs on PostgreSQL
5. **AI Summary**: Gemini generates human-readable answer
6. **Display**: Results shown with data preview and SQL query



### Supported Query Types

- **Seat Analysis**: "Which party won the most seats in 2019?"
- **Turnout Queries**: "What was the voter turnout in Maharashtra?"
- **Temporal Comparisons**: "Which party gained/lost seats between elections?"
- **Gender Analysis**: "What percentage of women candidates ran?"
- **Margin Analysis**: "Which constituencies had narrowest margins?"
- **Party Classification**: "How did national vs regional parties perform?"
- **Education Correlation**: "Does education affect winning chances?"



## 📈 Performance Optimizations

- **Database**: Connection pooling (max 20 connections)
- **API**: Pagination (max 5000 rows per query)
- **Frontend**: Code splitting with Vite
- **Caching**: Browser caching for static assets
- **Query Limits**: Enforced on all endpoints
- **SSL**: Enabled for database connections

---

## 🎯 Feature Roadmap

### Completed ✅
- [x] 6 interactive visualizations
- [x] AI-powered natural language queries
- [x] Multi-layer security validation
- [x] National vs regional party classification
- [x] Window function error handling
- [x] Rainbow glow AI button animation
- [x] 4-step loading animation
- [x] Comprehensive error handling
- [x] Production-ready codebase

