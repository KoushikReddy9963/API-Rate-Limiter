// Author: Y sai koushik reddy
import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

// Sliding window rate limiter middleware
const WINDOW_SIZE = 60 * 1000; // 1 minute in ms
const MAX_REQUESTS = 10;
const ipLogs = new Map(); // { ip: [timestamps] }

function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  if (!ipLogs.has(ip)) {
    ipLogs.set(ip, []);
  }
  // Remove timestamps older than window
  let ts = ipLogs.get(ip).filter(t => now - t < WINDOW_SIZE);
  ts.push(now);
  ipLogs.set(ip, ts);
  if (ts.length > MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }
  next();
}

app.use(rateLimiter);

// Test endpoints
app.get('/api/test1', (req, res) => {
  res.json({ message: 'Test1 endpoint success!' });
});

app.get('/api/test2', (req, res) => {
  res.json({ message: 'Test2 endpoint success!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
