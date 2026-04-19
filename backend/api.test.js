const test = require('node:test');
const assert = require('node:assert');
const { app, server, simEngine } = require('./server');

// A simple mock for supertest to keep dependencies lightweight
// We will use native fetch since we're in a Node environment (v18+)

test('API Endpoint Tests', async (t) => {
  const PORT = server.address().port;
  const baseUrl = `http://localhost:${PORT}`;

  await t.test('POST /api/recommend with valid data', async () => {
    const res = await fetch(`${baseUrl}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: 'Gate A', intent: 'Exit' })
    });

    assert.strictEqual(res.status, 200, 'Should return 200 OK');
    const data = await res.json();
    assert.ok(data.recommendation, 'Should contain a recommendation');
    assert.ok(data.timestamp, 'Should contain a timestamp');
  });

  await t.test('POST /api/recommend with invalid data (security check)', async () => {
    const res = await fetch(`${baseUrl}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: 123 }) // Invalid type
    });

    assert.strictEqual(res.status, 400, 'Should return 400 Bad Request');
    const data = await res.json();
    assert.strictEqual(data.error, 'Invalid input data. location and intent must be strings.');
  });

  // Cleanup
  server.close();
  simEngine.stop();
});
