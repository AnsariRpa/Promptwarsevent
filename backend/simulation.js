// backend/simulation.js
const EventEmitter = require('events');

class SimulationEngine extends EventEmitter {
  constructor() {
    super();
    this.state = {
      venues: [
        { id: 'gate-north', name: 'North Gate', density: 10, queueTime: 5 },
        { id: 'gate-south', name: 'South Gate', density: 20, queueTime: 10 },
        { id: 'gate-east', name: 'East Gate', density: 15, queueTime: 5 },
        { id: 'gate-west', name: 'West Gate', density: 12, queueTime: 5 },
        { id: 'parking', name: 'Parking Area', density: 30, queueTime: 0 },
        { id: 'merch', name: 'Merch Store', density: 25, queueTime: 5 },
        { id: 'first-aid', name: 'First Aid Center', density: 2, queueTime: 0 },
        { id: 'food-1', name: 'Food Stall 1', density: 40, queueTime: 15 },
        { id: 'food-2', name: 'Food Stall 2', density: 35, queueTime: 10 },
        { id: 'fan-booth', name: 'Fan Booth', density: 50, queueTime: 10 },
        { id: 'cab-pickup', name: 'Cab Pick Up', density: 15, queueTime: 5 },
        { id: 'metro-station', name: 'Metro Station', density: 45, queueTime: 10 },
        { id: 'bus-station', name: 'Bus Station', density: 25, queueTime: 8 }
      ],
      incidents: []
    };
    this.intervalId = null;
    this.scenarioTimer = 0;
  }

  start() {
    // Run simulation loop every 5 seconds
    this.intervalId = setInterval(() => this.tick(), 5000);
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  tick() {
    this.scenarioTimer++;

    // Phase 1: Initial Stable State (First 15 seconds, ticks 1-3)
    if (this.scenarioTimer <= 3) {
      this.state.venues.forEach(v => {
        const change = Math.floor(Math.random() * 3) - 1; // -1 to +1
        v.density = Math.max(0, Math.min(100, v.density + change));
        v.queueTime = Math.max(0, Math.floor(v.density * 0.5));
      });
    }
    // Phase 2: Normal fluctuations (20s to 40s, ticks 4-8)
    else if (this.scenarioTimer > 3 && this.scenarioTimer <= 8) {
      this.state.venues.forEach(v => {
        const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
        v.density = Math.max(0, Math.min(100, v.density + change));
        v.queueTime = Math.max(0, Math.floor(v.density * 0.5));
      });
    }
    // Phase 3: Gradual Crowd Build-up before spike (45s to 55s, ticks 9-11)
    else if (this.scenarioTimer >= 9 && this.scenarioTimer <= 11) {
      this.state.venues.forEach(v => {
        if (v.id.startsWith('gate') || v.id.includes('station') || v.id.includes('pickup')) {
          const change = Math.floor(Math.random() * 10) + 5; // +5 to +14
          v.density = Math.min(100, v.density + change);
        } else {
          const change = Math.floor(Math.random() * 5) - 4; // -4 to 0
          v.density = Math.max(0, v.density + change);
        }
        v.queueTime = Math.max(0, Math.floor(v.density * 0.5));
      });
    }
    // Phase 4: Event Ends - Alert Triggered (60s, tick 12)
    else if (this.scenarioTimer === 12) {
      this.state.incidents.push({ type: 'spike', message: 'Main event ended. High traffic at exits and transport hubs.' });
      this.state.venues.forEach(v => {
        if (v.id.startsWith('gate') || v.id.includes('station') || v.id.includes('pickup')) {
          v.density = Math.min(100, v.density + 20);
          v.queueTime += 15;
        }
      });
    }
    // Phase 5: Post-event drain (65s to 95s, ticks 13-19)
    else if (this.scenarioTimer > 12 && this.scenarioTimer < 20) {
      this.state.venues.forEach(v => {
        const change = Math.floor(Math.random() * 10) - 15; // -15 to -6
        v.density = Math.max(2, v.density + change);
        v.queueTime = Math.max(0, Math.floor(v.density * 0.5));
      });
    }
    // Phase 6: Empty Stadium (100s, tick 20)
    else if (this.scenarioTimer === 20) {
      this.state.incidents.push({ type: 'empty', message: 'Venue closing. Stadium is nearly empty.' });
      this.state.venues.forEach(v => {
        v.density = 2;
        v.queueTime = 0;
      });
    }
    // Phase 7: Reset loop (105s, tick 21)
    else if (this.scenarioTimer > 20) {
      this.scenarioTimer = 0;
      this.state.incidents = [];
    }

    // Emit event with new state
    this.emit('update', this.state);
  }

  getState() {
    return this.state;
  }
}

module.exports = SimulationEngine;
