# 🗳️ Election Loksabha Data Analytics Dashboard

A comprehensive full-stack application for analyzing Indian Lok Sabha election data with interactive visualizations.

## 🎯 Features

### 📊 Visualizations

1. **Party-wise Seat Share** - Bar chart showing seats won by each party per year
2. **State-wise Turnout Analysis** - Color-coded map showing voter turnout by state
3. **Gender Representation Over Time** - Line chart tracking male/female winners across years
4. **Top Parties by Vote Share** - Donut chart displaying vote share percentage
5. **Margin of Victory Distribution** - Histogram showing victory margin ranges
6. **Search Functionality** - Search by candidate name or constituency

## 🏗️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL (Neon)** - Database
- **pg** - PostgreSQL client
- **CORS** - Cross-origin support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Neon)

### Installation

#### 1. Clone and Install Dependencies

```bash
# Clone the repository
cd election

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

#### 2. Configure Environment Variables

**Server (.env)**
```bash
cd server
# Create .env file
PG_URI=postgresql://neondb_owner:your_password@your-host.neon.tech/election_data?sslmode=require
PORT=4000
```

**Client (.env)**
```bash
cd client
# Create .env file
VITE_API_BASE_URL=http://localhost:4000/api
```

#### 3. Start the Servers

**Start Backend Server:**
```bash
cd server
npm start
```
Backend will run on: `http://localhost:4000`

**Start Frontend:**
```bash
cd client
npm run dev
```
Frontend will run on: `http://localhost:5173`

## 📡 API Endpoints

### Analytics Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analytics/party-seats` | GET | Party-wise seat share data |
| `/api/analytics/state-turnout` | GET | State-wise turnout statistics |
| `/api/analytics/gender-representation` | GET | Gender representation over time |
| `/api/analytics/top-parties` | GET | Top parties by vote share |
| `/api/analytics/margin-distribution` | GET | Victory margin distribution |
| `/api/search` | GET | Search candidates/constituencies |
| `/api/filters/all` | GET | Get all filter options |

### Query Parameters

- `year` - Single year filter
- `yearStart`, `yearEnd` - Year range filter
- `states` - Comma-separated states
- `parties` - Comma-separated parties
- `limit` - Result limit (default: 5000)
- `offset` - Pagination offset

### Example Requests

```bash
# Get party seats for 2019
GET /api/analytics/party-seats?year=2019

# Get turnout for specific states
GET /api/analytics/state-turnout?year=2019&states=Maharashtra,Gujarat

# Search for a candidate
GET /api/search?query=Modi&limit=50

# Get top 10 parties
GET /api/analytics/top-parties?year=2019&limit=10
```

## 📊 Dashboard Features

### Overview Tab
- Displays all 5 visualizations simultaneously
- Year selection dropdown for each chart
- Responsive grid layout
- Real-time data fetching

### Search Tab
- Live search by candidate name or constituency
- Detailed results table with:
  - Candidate information
  - Party affiliation
  - Constituency & State
  - Vote statistics
  - Winner indication

## 🎨 Components

### Frontend Components

```
src/components/
├── Dashboard.jsx              # Main dashboard layout
├── PartySeatsChart.jsx        # Bar chart component
├── StateTurnoutMap.jsx        # State turnout visualization
├── GenderRepresentationChart.jsx  # Line chart
├── TopPartiesDonut.jsx        # Donut chart
├── MarginDistributionChart.jsx    # Histogram
└── SearchTable.jsx            # Search functionality
```

### Backend Structure

```
server/
├── server.js          # Express server setup
├── db.js             # PostgreSQL connection
├── routes.js         # API routes
├── controller.js     # Basic CRUD controllers
└── analytics.js      # Analytics endpoints
```

## 🔧 Configuration

### Database Schema

The application expects a PostgreSQL table `election_loksabha_data` with columns:
- Year
- State_Name
- Constituency_Name
- Candidate
- Party
- Sex
- Votes
- Vote_Share_Percentage
- Is_Winner
- Margin
- Margin_Percentage
- Turnout_Percentage
- Valid_Votes
- Electors
- Position

## 📝 Usage Examples

### Fetching Data in Frontend

```javascript
import { getPartyWiseSeatShare } from './services/api';

// Fetch party seats data
const response = await getPartyWiseSeatShare({ year: '2019' });
console.log(response.data);
```

### Creating Custom Visualizations

```javascript
import { ResponsiveContainer, BarChart, Bar } from 'recharts';

<ResponsiveContainer width="100%" height={400}>
  <BarChart data={data}>
    <Bar dataKey="seats_won" fill="#3b82f6" />
  </BarChart>
</ResponsiveContainer>
```

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Error**
```
Error: connect ECONNREFUSED
```
- Check if PG_URI is correctly set in server/.env
- Verify database exists and is accessible

**2. CORS Error**
```
Access to fetch blocked by CORS policy
```
- Ensure backend server is running
- Check VITE_API_BASE_URL in client/.env

**3. Chart Not Rendering**
```
Module not found: recharts
```
- Run `npm install` in client folder
- Restart dev server

## 📦 Available Scripts

### Frontend (client/)
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend (server/)
```bash
npm start        # Start server (production)
npm run dev      # Start server with nodemon (development)
```

## 🌐 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variable: `VITE_API_BASE_URL`

### Backend (Render/Railway/Heroku)
1. Set environment variables: `PG_URI`, `PORT`
2. Deploy from `server` folder
3. Update frontend API URL

## 📚 Documentation

- [API Documentation](server/API_DOCUMENTATION.md)
- [Visualization Guide](server/VISUALIZATION_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License

## 👥 Authors

Built with ❤️ using React, Node.js, and PostgreSQL

---

## 🎉 Quick Start Commands

```bash
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend  
cd client && npm run dev

# Open browser
# http://localhost:5173
```

Enjoy exploring Indian election data! 🗳️📊
