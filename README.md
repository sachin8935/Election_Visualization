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

### Prerequisites
- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **PostgreSQL Database** (Neon recommended) with election data
- **Google Gemini API Key** ([Get one](https://ai.google.dev/))

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

### Example API Requests

```bash
# Get party seats for 2019
curl "http://localhost:4000/api/analytics/party-seats?year=2019"

# Get turnout for Maharashtra and Gujarat in 2019
curl "http://localhost:4000/api/analytics/state-turnout?year=2019&states=Maharashtra,Gujarat"

# Search for Modi
curl "http://localhost:4000/api/search?query=Modi&limit=50"

# Ask AI a question
curl -X POST "http://localhost:4000/api/ai/query" \
  -H "Content-Type: application/json" \
  -d '{"query": "Which party won the most seats in 2019?"}'
```

### Response Format

All API responses follow this structure:
```json
{
  "success": true,
  "data": [...],
  "count": 10,
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

---

## 🎯 AI Query System

### How It Works

1. **User Input**: Natural language question (e.g., "Which state had highest turnout?")
2. **AI Processing**: Gemini 2.5 Flash generates SQL query with 200+ lines of context
3. **Security Validation**: Multi-layer checks prevent SQL injection
4. **Query Execution**: Parameterized SQL runs on PostgreSQL
5. **AI Summary**: Gemini generates human-readable answer
6. **Display**: Results shown with data preview and SQL query

### Security Features

- ✅ **SQL Injection Prevention**: Parameterized queries only
- ✅ **Query Validation**: `isSafeQuery()` blocks DELETE, UPDATE, DROP, etc.
- ✅ **Syntax Checking**: `validateSQL()` ensures proper SQL structure
- ✅ **Output Sanitization**: `cleanSQLResponse()` removes malicious code
- ✅ **Window Function Handling**: CTE-based queries prevent errors

### Supported Query Types

- **Seat Analysis**: "Which party won the most seats in 2019?"
- **Turnout Queries**: "What was the voter turnout in Maharashtra?"
- **Temporal Comparisons**: "Which party gained/lost seats between elections?"
- **Gender Analysis**: "What percentage of women candidates ran?"
- **Margin Analysis**: "Which constituencies had narrowest margins?"
- **Party Classification**: "How did national vs regional parties perform?"
- **Education Correlation**: "Does education affect winning chances?"

### National Party Classification

The system correctly identifies **7 national parties**:
- AAP (Aam Aadmi Party)
- BJP (Bharatiya Janata Party)
- INC (Indian National Congress)
- BSP (Bahujan Samaj Party)
- CPI (Communist Party of India)
- CPI-M (Communist Party of India - Marxist)
- NCP (Nationalist Congress Party)

All others are classified as **regional parties** (AITC, DMK, ADMK, SP, TDP, BJD, SHS, etc.)

---

## 📊 Dashboard Components

### Component Architecture

```
client/src/components/
├── Dashboard.jsx                    # Main layout with tabs
├── LandingPage.jsx                  # Home screen
├── Filter.jsx                       # Filter dropdown component
├── PartySeatsChart.jsx              # Bar chart visualization
├── StateTurnoutMap.jsx              # Geographic map visualization
├── GenderRepresentationChart.jsx    # Line chart for gender trends
├── TopPartiesDonut.jsx              # Donut chart for vote share
├── MarginDistributionChart.jsx      # Histogram for margins
├── SearchTable.jsx                  # Search functionality
├── AskAIModal.jsx                   # AI query modal
└── ServerLoadingModal.jsx           # Loading state component
```

### Backend Structure

```
server/
├── server.js           # Express server setup with CORS & error handling
├── db.js              # PostgreSQL connection pool with SSL
├── routes.js          # API route definitions
├── controller.js      # Basic CRUD operations
├── analytics.js       # Analytics endpoint logic
└── gemini.js          # AI query processing with security
```

---

## 📚 Database Schema

The application uses a PostgreSQL table `election_loksabha_data` with **63,100 records** covering **8 election years** (1991-2019):

### Key Columns

| Column | Type | Description |
|--------|------|-------------|
| `Year` | bigint | Election year (1991, 1996, 1998, 1999, 2004, 2009, 2014, 2019) |
| `State_Name` | text | State name (uses underscores: 'Uttar_Pradesh') |
| `Constituency_Name` | text | Parliamentary constituency |
| `Candidate` | text | Candidate full name |
| `Party` | text | Political party abbreviation |
| `Sex` | text | Gender ('Male', 'Female', 'Unknown', 'O') |
| `Votes` | bigint | Votes received by candidate |
| `Is_Winner` | bigint | 1 for winner, 0 for loser |
| `Turnout_Percentage` | bigint | Voter turnout percentage |
| `Vote_Share_Percentage` | double precision | Vote share percentage |
| `Margin` | bigint | Victory margin in votes |
| `Margin_Percentage` | double precision | Victory margin percentage |
| `Electors` | bigint | Total registered electors |
| `Valid_Votes` | bigint | Total valid votes cast |
| `Party_Type_TCPD` | text | Party classification |
| `MyNeta_education` | text | Education level |
| `Position` | bigint | Candidate rank (1=winner, 2=runner-up) |

**Important Notes:**
- Each row = ONE CANDIDATE (not constituency)
- Multiple rows per constituency (all candidates)
- State names use underscores
- 47 total columns, 36 states, 50+ parties

---

## 🎨 Usage Examples

### Fetching Data in Components

```javascript
import { getPartyWiseSeatShare } from './services/api';

// Fetch party seats for 2019
const fetchData = async () => {
  try {
    const response = await getPartyWiseSeatShare({ year: '2019' });
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Creating Custom Visualizations

```javascript
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

<ResponsiveContainer width="100%" height={400}>
  <BarChart data={data}>
    <XAxis dataKey="Party" />
    <YAxis />
    <Bar dataKey="seats_won" fill="#3b82f6" />
  </BarChart>
</ResponsiveContainer>
```

### Using AI Query Service

```javascript
import { askAIQuestion } from './services/api';

const answer = await askAIQuestion(
  "Which party won the most seats in 2019?"
);

console.log(answer.answer);    // Natural language answer
console.log(answer.sql);       // Generated SQL query
console.log(answer.result);    // Query results
```

---

## � Available Scripts

### Frontend (client/)
```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build
npm run lint     # Run ESLint for code quality
```

### Backend (server/)
```bash
npm start        # Start server in production mode
npm run dev      # Start server with nodemon (auto-restart)
npm test         # Run tests (to be implemented)
```

---

## 🚀 Production Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the project:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy `dist/` folder** to your hosting platform

3. **Set environment variable:**
   ```
   VITE_API_BASE_URL=https://api.yourdomain.com/api
   ```

4. **Vercel Example:**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

### Backend Deployment (Render/Railway/Heroku)

1. **Set environment variables:**
   - `PG_URI` - PostgreSQL connection string
   - `GEMINI_API_KEY` - Google AI API key
   - `PORT` - Server port (default: 4000)
   - `NODE_ENV` - Set to `production`
   - `ALLOWED_ORIGINS` - Frontend URL for CORS

2. **Deploy from `server/` directory**

3. **Railway Example:**
   ```bash
   railway login
   railway init
   railway up
   ```

### Database Setup (Neon)

1. Create a free PostgreSQL database at [Neon](https://neon.tech)
2. Import your election data CSV/SQL
3. Copy the connection string to `PG_URI`

### Security Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure `ALLOWED_ORIGINS` for CORS
- [ ] Enable database SSL
- [ ] Keep API keys secure
- [ ] Set up rate limiting (recommended)
- [ ] Configure monitoring and logging

---

## 🛡️ Security Features

### Multi-Layer Protection

1. **SQL Injection Prevention**
   - Parameterized queries throughout (`$1`, `$2` syntax)
   - No string concatenation in SQL
   - Input validation on all endpoints

2. **AI Query Security**
   - `isSafeQuery()` - Blocks DELETE, UPDATE, DROP, TRUNCATE, ALTER
   - `validateSQL()` - Checks query structure and syntax
   - `cleanSQLResponse()` - Sanitizes AI-generated output
   - Only SELECT and WITH (CTE) queries allowed

3. **Environment Protection**
   - Sensitive credentials in `.env` files
   - `.gitignore` configured to exclude secrets
   - `.env.example` files provided as templates

4. **Error Handling**
   - Try-catch blocks on all async operations
   - User-friendly error messages
   - No sensitive data leaked in errors

---

## 📈 Performance Optimizations

- **Database**: Connection pooling (max 20 connections)
- **API**: Pagination (max 5000 rows per query)
- **Frontend**: Code splitting with Vite
- **Caching**: Browser caching for static assets
- **Query Limits**: Enforced on all endpoints
- **SSL**: Enabled for database connections

---

## 🐛 Troubleshooting Guide

### Common Issues & Solutions

#### 1. Database Connection Error
```
Error: connect ECONNREFUSED ::1:5432
```
**Solution:**
- Verify `PG_URI` is correct in `server/.env`
- Check if database is accessible
- Ensure SSL is properly configured
- Test connection: `psql $PG_URI`

#### 2. CORS Error in Browser
```
Access to fetch blocked by CORS policy
```
**Solution:**
- Ensure backend server is running on port 4000
- Check `VITE_API_BASE_URL` in `client/.env`
- Verify CORS is enabled in `server.js`

#### 3. Gemini API Error
```
Error 404: Model not found
```
**Solution:**
- Verify `GEMINI_API_KEY` is set correctly
- Check API key has Gemini API access
- Ensure using model: `gemini-2.5-flash`

#### 4. Charts Not Rendering
```
Module not found: recharts
```
**Solution:**
- Run `npm install` in client folder
- Delete `node_modules` and reinstall
- Clear Vite cache: `rm -rf node_modules/.vite`

#### 5. AI Query Failing
```
Error: window functions are not allowed in WHERE
```
**Solution:**
- This was fixed in gemini.js with CTE patterns
- Update to latest code from repository
- Window functions now use CTE (WITH clause) approach

---

## 📚 Additional Documentation

- **[Production Readiness Report](PRODUCTION_READINESS_REPORT.md)** - Comprehensive production review (92% score)
- **[API Documentation](server/API_DOCUMENTATION.md)** - Detailed API endpoint guide
- **[Window Function Fix](server/WINDOW_FUNCTION_FIX.md)** - CTE-based query approach
- **[Party Classification](server/PARTY_CLASSIFICATION.md)** - National vs regional parties
- **[AI Query Enhancements](server/AI_QUERY_ENHANCEMENTS.md)** - AI system improvements
- **[AI Modal Enhancements](client/AI_MODAL_ENHANCEMENTS.md)** - UI/UX improvements

---

## 🧪 Testing

### Manual Testing Checklist

**Backend API:**
- [ ] Test all analytics endpoints with query params
- [ ] Verify error handling with invalid inputs
- [ ] Test AI query with various questions
- [ ] Check pagination works correctly
- [ ] Verify CORS with different origins

**Frontend:**
- [ ] Test all visualizations with different years
- [ ] Verify filters apply correctly
- [ ] Test search functionality
- [ ] Try all 6 AI example questions
- [ ] Check responsive design on mobile
- [ ] Test error states (disconnect backend)

**AI System:**
- [ ] Party seats query
- [ ] Voter turnout analysis
- [ ] Seat changes between years
- [ ] Women candidates percentage
- [ ] National vs regional parties
- [ ] Education correlation

---

## 📊 Project Statistics

- **Total Code Files**: 20+
- **Database Records**: 63,100
- **Election Years Covered**: 8 (1991-2019)
- **States**: 36
- **Political Parties**: 50+
- **API Endpoints**: 9
- **Frontend Components**: 12
- **Backend Controllers**: 3
- **AI Example Queries**: 6
- **Lines of Schema Context**: 200+

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

### Planned 🔜
- [ ] Unit and integration tests
- [ ] API rate limiting
- [ ] Request logging with Winston
- [ ] Error tracking with Sentry
- [ ] Swagger/OpenAPI documentation
- [ ] Redis caching for common queries
- [ ] Export charts to PNG/PDF
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)
- [ ] Real-time updates with WebSockets

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines
- Follow existing code style
- Add comments for complex logic
- Update documentation
- Test your changes thoroughly
- Ensure no ESLint errors

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👥 Authors & Acknowledgments

**Created by**: Sachin  
**AI Integration**: Google Gemini 2.5 Flash  
**Database**: Neon PostgreSQL  
**Inspiration**: Indian Election Commission Data

### Special Thanks
- Election Commission of India for open data
- Google AI for Gemini API
- Neon for PostgreSQL hosting
- Open source community for amazing tools

---

## 📞 Support & Contact

- **GitHub Issues**: [Report a bug or request a feature](https://github.com/sachin8935/Election_Visualization/issues)
- **Documentation**: Check the docs folder for detailed guides

---

## 🎉 Quick Start Commands

```bash
# Clone and setup
git clone <repo-url>
cd election

# Setup backend
cd server
cp .env.example .env
# Edit .env with your credentials
npm install
npm start

# Setup frontend (new terminal)
cd client
cp .env.example .env
# Edit .env with API URL
npm install
npm run dev

# Open http://localhost:5173 in your browser! 🚀
```

---

## ⭐ Star This Project

If you find this project useful, please consider giving it a star on GitHub! ⭐

---

**Built with ❤️ by Sachin using React, Node.js, PostgreSQL, and Google Gemini AI**

*Enjoy exploring 30 years of Indian election data! 🗳️📊🇮🇳*
