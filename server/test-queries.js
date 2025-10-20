import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

const testQueries = [
  "What was the voter turnout in Maharashtra in 2014?",
  "Which state had the highest voter turnout in 2019?",
  "Which party gained or lost the most seats between 2014 and 2019?",
  "Which party won the most seats in 2019?",
  "How many women candidates contested in 2019?"
];

const server = app.listen(PORT, async () => {
  console.log('🧪 Testing Enhanced AI Query System\n');
  console.log('=' .repeat(60));
  
  for (let i = 0; i < testQueries.length; i++) {
    const question = testQueries[i];
    console.log(`\n📝 Test ${i + 1}/${testQueries.length}: "${question}"`);
    console.log('-'.repeat(60));
    
    try {
      const response = await fetch(`http://localhost:${PORT}/api/ai/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: question })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ SUCCESS');
        console.log('\n🔍 Generated SQL:');
        console.log(data.sql);
        console.log('\n📊 Results:');
        console.log(JSON.stringify(data.result.slice(0, 3), null, 2));
        console.log(`\n💬 AI Answer:\n${data.answer}`);
      } else {
        console.log('❌ FAILED');
        console.log('Error:', data.error);
        console.log('Reason:', data.reason);
        if (data.sql) {
          console.log('Generated SQL:', data.sql);
        }
      }
    } catch (error) {
      console.log('❌ REQUEST FAILED:', error.message);
    }
    
    // Wait a bit between requests to avoid rate limiting
    if (i < testQueries.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 All tests complete!\n');
  server.close();
  process.exit(0);
});
