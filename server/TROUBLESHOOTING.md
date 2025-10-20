# 🔧 AI Query Setup & Troubleshooting Guide

## Problem: "Failed to process query" Error

The error occurs because the Gemini API key is either:
1. **Invalid or expired**
2. **Not set correctly in `.env` file**
3. **Using wrong model names**

## ✅ Solution: Update Your Gemini API Key

### Step 1: Get a New Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Copy the generated API key

### Step 2: Update Your `.env` File

1. Open `/server/.env` file
2. Update or add the `GEMINI_API_KEY` line:

```env
GEMINI_API_KEY=your_actual_api_key_here
PG_URI=your_postgres_connection_string
```

**Example:**
```env
GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PG_URI=postgresql://user:password@host:5432/database
```

### Step 3: Verify the Setup

Run this test to verify everything works:

```bash
cd server
node find-model.js
```

You should see:
```
Testing: gemini-pro...
   ✅ gemini-pro works!
   Response: Hello!

🎉 Use this model: "gemini-pro"
```

### Step 4: Restart Your Server

After updating the `.env` file:

```bash
cd server
npm start
# or
node server.js
```

## 🔍 Current Status

Based on the test results:

- ✅ **Database**: Connected and working
- ✅ **Table Access**: 63,100 records available
- ❌ **Gemini API**: Not working (API key issue)

## 📋 Model Names to Use

Once you have a valid API key, the system will use:
- **SQL Generation**: `gemini-pro` (more accurate for SQL)
- **Summary Generation**: `gemini-pro` (natural language)

## 🧪 Testing the Complete Flow

After fixing the API key, test the complete AI query:

### Option 1: Use the Dashboard
1. Start the server: `cd server && npm start`
2. Start the client: `cd client && npm run dev`
3. Open dashboard and click **"Ask AI"** button
4. Try: "Which party won the most seats in 2019?"

### Option 2: Use cURL
```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d '{"query": "How many total records are in the database?"}'
```

Expected response:
```json
{
  "success": true,
  "question": "How many total records are in the database?",
  "sql": "SELECT COUNT(*) FROM election_loksabha_data",
  "result": [{"count": "63100"}],
  "totalRows": 1,
  "answer": "According to the database, there are 63,100 total records..."
}
```

## 🚨 Common Issues & Fixes

### Issue 1: "GEMINI_API_KEY not found"
**Fix**: Make sure `.env` file exists in `/server/` directory with the API key

### Issue 2: "Error fetching from generativelanguage.googleapis.com"
**Fix**: 
- Check internet connection
- Verify API key is valid (not expired)
- Ensure no firewall blocking googleapis.com

### Issue 3: "404 Not Found - models/gemini-pro is not found"
**Fix**: 
- Get a new API key from Google AI Studio
- Some API keys have access to different models
- Try using a freshly generated key

### Issue 4: "Database connection error"
**Fix**: Verify `PG_URI` in `.env` is correct

## 📝 Quick Checklist

Before reporting issues, verify:

- [ ] `.env` file exists in `/server/` directory
- [ ] `GEMINI_API_KEY` is set and not empty
- [ ] API key copied correctly (no extra spaces)
- [ ] Server restarted after updating `.env`
- [ ] Internet connection is working
- [ ] Database connection works (`node test-ai.js` shows DB connected)

## 🎯 Next Steps

1. **Get valid Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Update `.env` file** with the new key
3. **Test setup** with `node find-model.js`
4. **Restart server** and try the AI query again

## 💡 Alternative: Use Different AI Model

If Gemini continues to have issues, you can modify the code to use:
- OpenAI GPT (requires OpenAI API key)
- Anthropic Claude (requires Anthropic API key)
- Local LLM (Ollama, LM Studio)

Let me know if you need help setting up an alternative!

## 📧 Support

If you're still having issues after following these steps:
1. Verify your API key works on [Google AI Studio](https://aistudio.google.com)
2. Check the server console logs for detailed error messages
3. Share the complete error message for further help

---

**Remember**: The Gemini API is free but has rate limits. For production use, consider upgrading to a paid tier.
