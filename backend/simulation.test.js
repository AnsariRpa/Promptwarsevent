const test = require('node:test');
const assert = require('node:assert');
const SimulationEngine = require('./simulation');

test('SimulationEngine Edge Cases', (t) => {
  const sim = new SimulationEngine();

  // Test normal state
  const state = sim.getState();
  assert.strictEqual(state.venues.length, 13);

  // Fast-forward to Edge Case 1: Event Ending (tick 12)
  for (let i = 0; i < 12; i++) sim.tick();

  const spikedState = sim.getState();
  const spikeIncident = spikedState.incidents.find(i => i.type === 'spike');
  assert.ok(spikeIncident, 'Spike incident should be present');
  assert.ok(spikedState.venues[0].density > 40, 'Gate North density should have spiked');

  // Fast-forward to Edge Case 2: Empty Stadium (tick 20)
  for (let i = 0; i < 8; i++) sim.tick();

  const emptyState = sim.getState();
  const emptyIncident = emptyState.incidents.find(i => i.type === 'empty');
  assert.ok(emptyIncident, 'Empty incident should be present');
  assert.strictEqual(emptyState.venues[0].density, 2, 'Venue density should be set to near empty (2)');
});
