require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const SimulationEngine = require('./simulation');
const path = require('path');

const app = express();

// Security: Use Helmet for secure HTTP headers
app.use(helmet());

// Security: Rate limiting to prevent brute force/abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Middleware
app.use(cors());
app.use(express.json());

// SERVE FRONTEND
app.use(express.static(path.join(__dirname, 'frontend')));

// Simulation Instance
const simEngine = new SimulationEngine();
simEngine.start();

// Mock Firebase integration
simEngine.on('update', (state) => { });

// SSE Endpoint
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendUpdate = (state) => {
    res.write(`data: ${JSON.stringify(state)}\n\n`);
  };

  sendUpdate(simEngine.getState());
  simEngine.on('update', sendUpdate);

  req.on('close', () => {
    simEngine.removeListener('update', sendUpdate);
  });
});

// AI Routing Logic
const venueDetails = {
  'gate-north': { direction: 'North', near: 'Main Entrance' },
  'gate-south': { direction: 'South', near: 'Main Exit' },
  'gate-east': { direction: 'East', near: 'East Plaza' },
  'gate-west': { direction: 'West', near: 'West Plaza' },
  'parking': { direction: 'North-West', near: 'West Gate' },
  'merch': { direction: 'South-West', near: 'West Gate' },
  'first-aid': { direction: 'North-East', near: 'East Gate' },
  'food-1': { direction: 'South-West', near: 'West Gate' },
  'food-2': { direction: 'South-East', near: 'East Gate' },
  'fan-booth': { direction: 'South-East', near: 'South Gate' },
  'cab-pickup': { direction: 'North-West', near: 'North Gate' },
  'metro-station': { direction: 'North-East', near: 'North Gate' },
  'bus-station': { direction: 'South', near: 'South Gate' }
};

app.post('/api/recommend', (req, res) => {
  const { location, intent } = req.body;

  if (!location || !intent || typeof location !== 'string' || typeof intent !== 'string') {
    return res.status(400).json({ error: 'Invalid input data.' });
  }

  const currentState = simEngine.getState();
  const intentLower = intent.toLowerCase();

  let targetType = null;
  if (intentLower.match(/food|eat/)) targetType = ['food-1', 'food-2'];
  else if (intentLower.match(/exit|gate/)) targetType = ['gate-north', 'gate-south', 'gate-east', 'gate-west'];
  else if (intentLower.match(/cab|taxi/)) targetType = ['cab-pickup'];
  else if (intentLower.match(/metro/)) targetType = ['metro-station'];
  else if (intentLower.match(/bus/)) targetType = ['bus-station'];

  let recommendation = `No clear match found for "${intent}".`;

  if (targetType) {
    const availableVenues = currentState.venues.filter(v => targetType.includes(v.id));
    availableVenues.sort((a, b) => a.density - b.density);

    const best = availableVenues[0];
    const condition = best.density < 40 ? 'low' : best.density < 75 ? 'medium' : 'high';
    const details = venueDetails[best.id];

    recommendation = `The best option is ${best.name} towards ${details.direction} (near ${details.near}). It has ${condition} crowd (${best.density}%).`;
  }

  res.json({ recommendation });
});

// ROOT ROUTE
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// Server start
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, simEngine };