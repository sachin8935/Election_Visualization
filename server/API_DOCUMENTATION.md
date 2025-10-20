# 🗳️ Election Loksabha Data API Documentation

## Base URL
```
http://localhost:4000/api
```

---

## 📊 Endpoints

### 1️⃣ Get Filtered Election Data
**GET** `/elections`

Fetch election data with flexible filtering options.

#### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `year` | String | Single year | `?year=2019` |
| `yearStart` | String | Start of year range | `?yearStart=2014&yearEnd=2019` |
| `yearEnd` | String | End of year range | `?yearStart=2014&yearEnd=2019` |
| `states` | String | Comma-separated states | `?states=Maharashtra,Gujarat` |
| `parties` | String | Comma-separated parties | `?parties=BJP,INC` |
| `genders` | String | Comma-separated genders | `?genders=M,F` |
| `constituencies` | String | Comma-separated constituencies | `?constituencies=Mumbai North,Delhi South` |
| `limit` | Number | Max records (default: 5000) | `?limit=100` |
| `offset` | Number | Skip records (default: 0) | `?offset=100` |

#### Example Requests

```bash
# Single year
GET /api/elections?year=2019

# Year range
GET /api/elections?yearStart=2014&yearEnd=2019

# Multiple states
GET /api/elections?states=Maharashtra,Gujarat,Karnataka

# Multiple parties
GET /api/elections?parties=BJP,INC,AAP

# Gender filter
GET /api/elections?genders=F

# Multiple constituencies
GET /api/elections?constituencies=Mumbai North,Delhi South

# Combined filters
GET /api/elections?year=2019&states=Maharashtra&parties=BJP,INC&genders=M

# With pagination
GET /api/elections?year=2019&limit=50&offset=0
```

#### Response Format

```json
{
  "success": true,
  "data": [
    {
      "Year": 2019,
      "State_Name": "Maharashtra",
      "Constituency_Name": "Mumbai North",
      "Party": "BJP",
      "Sex": "M",
      // ... other fields
    }
  ],
  "pagination": {
    "total": 1500,
    "limit": 5000,
    "offset": 0,
    "returned": 1500
  }
}
```

---

### 2️⃣ Get Unique Values (For Dropdown Population)
**GET** `/unique/:field`

Get all unique values for a specific field to populate dropdowns.

#### Valid Fields
- `State_Name`
- `Year`
- `Sex`
- `Party`
- `Constituency_Name`

#### Example Requests

```bash
# Get all states
GET /api/unique/State_Name

# Get all years
GET /api/unique/Year

# Get all parties
GET /api/unique/Party

# Get all genders
GET /api/unique/Sex

# Get all constituencies
GET /api/unique/Constituency_Name
```

#### Response Format

```json
{
  "success": true,
  "field": "State_Name",
  "values": ["Andhra Pradesh", "Bihar", "Gujarat", "..."],
  "count": 35
}
```

---

### 3️⃣ Get All Filter Options (One Call)
**GET** `/filters/all`

Get all unique values for all filterable fields in a single API call.

#### Example Request

```bash
GET /api/filters/all
```

#### Response Format

```json
{
  "success": true,
  "filters": {
    "State_Name": ["Andhra Pradesh", "Bihar", "..."],
    "Year": [2009, 2014, 2019, 2024],
    "Sex": ["M", "F", "O"],
    "Party": ["BJP", "INC", "AAP", "..."],
    "Constituency_Name": ["Mumbai North", "Delhi South", "..."]
  }
}
```

---

### 4️⃣ Debug: List All Tables
**GET** `/debug/tables`

List all tables in the database (for debugging).

#### Response Format

```json
{
  "tables": ["election_loksabha_data"],
  "count": 1
}
```

---

## 🎯 Frontend Integration Examples

### React/Next.js Example

```javascript
// Fetch all filter options on component mount
const [filterOptions, setFilterOptions] = useState({});

useEffect(() => {
  fetch('http://localhost:4000/api/filters/all')
    .then(res => res.json())
    .then(data => setFilterOptions(data.filters));
}, []);

// Fetch filtered data
const fetchElectionData = async (filters) => {
  const params = new URLSearchParams();
  
  if (filters.year) params.append('year', filters.year);
  if (filters.yearStart) params.append('yearStart', filters.yearStart);
  if (filters.yearEnd) params.append('yearEnd', filters.yearEnd);
  if (filters.states?.length) params.append('states', filters.states.join(','));
  if (filters.parties?.length) params.append('parties', filters.parties.join(','));
  if (filters.genders?.length) params.append('genders', filters.genders.join(','));
  if (filters.constituencies?.length) params.append('constituencies', filters.constituencies.join(','));
  
  const response = await fetch(`http://localhost:4000/api/elections?${params}`);
  const data = await response.json();
  return data;
};
```

### JavaScript Fetch Example

```javascript
// Example: Get BJP candidates from Maharashtra in 2019
const filters = {
  year: '2019',
  states: ['Maharashtra'],
  parties: ['BJP']
};

const params = new URLSearchParams();
params.append('year', filters.year);
params.append('states', filters.states.join(','));
params.append('parties', filters.parties.join(','));

fetch(`http://localhost:4000/api/elections?${params}`)
  .then(res => res.json())
  .then(data => {
    console.log(`Total records: ${data.pagination.total}`);
    console.log('Data:', data.data);
  });
```

---

## ✅ Filter Combinations Supported

Your backend **fully supports** all these filter combinations:

✅ **Single Year** - `?year=2019`  
✅ **Year Range** - `?yearStart=2014&yearEnd=2019`  
✅ **Single State** - `?states=Maharashtra`  
✅ **Multiple States** - `?states=Maharashtra,Gujarat,Karnataka`  
✅ **Single Party** - `?parties=BJP`  
✅ **Multiple Parties** - `?parties=BJP,INC,AAP`  
✅ **Gender** - `?genders=M` or `?genders=F` or `?genders=M,F`  
✅ **Single Constituency** - `?constituencies=Mumbai North`  
✅ **Multiple Constituencies** - `?constituencies=Mumbai North,Delhi South`  
✅ **Any Combination** - All filters can be combined together  
✅ **Pagination** - `?limit=100&offset=0`

---

## 🚀 Performance Features

1. **SQL Injection Protection**: Uses parameterized queries
2. **Limit Safeguard**: Max 5000 records per request
3. **Pagination Support**: `limit` and `offset` parameters
4. **Total Count**: Returns total matching records
5. **Null Handling**: Filters out NULL values in dropdowns
6. **Sorted Results**: Ordered by Year DESC, State ASC

---

## 🔒 Security Features

- ✅ CORS enabled
- ✅ SQL injection prevention (parameterized queries)
- ✅ Input validation on field names
- ✅ Error handling with proper status codes
- ✅ Connection pooling for efficiency

---

## 🐛 Error Responses

All errors return:
```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

---

## 📝 Notes

- All filters are optional
- Filters work with AND logic (all conditions must match)
- Multiple values in same filter use OR logic (e.g., `states=A,B` means State A OR State B)
- Year and yearRange are mutually exclusive (yearRange takes precedence)
- Maximum 5000 records per request for performance
