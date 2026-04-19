document.addEventListener('DOMContentLoaded', () => {
  const connectionStatus = document.getElementById('connection-status');
  const incidentsList = document.getElementById('incidents-list');
  const aiResponse = document.getElementById('ai-response');
  const askAiBtn = document.getElementById('ask-ai-btn');
  const intentInput = document.getElementById('intent-input');

  // Backend URL (Mocking localhost for dev, would be deployed URL in prod)
  const API_BASE = window.location.origin + '/api';

  // State
  let currentState = { venues: [], incidents: [] };

  // Establish SSE Connection
  const eventSource = new EventSource(`${API_BASE}/stream`);

  eventSource.onopen = () => {
    connectionStatus.textContent = '● Connected';
    connectionStatus.style.color = 'var(--neon-green)';
  };

  eventSource.onerror = () => {
    connectionStatus.textContent = '● Reconnecting...';
    connectionStatus.style.color = 'var(--neon-yellow)';
  };

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      currentState = data;
      updateUI();
    } catch (e) {
      console.error('Error parsing SSE data', e);
    }
  };

  function updateUI() {
    // Update Map Nodes
    currentState.venues.forEach(venue => {
      const node = document.getElementById(`node-${venue.id}`);
      if (node) {
        const valSpan = node.querySelector('.density-val');
        if (valSpan) valSpan.textContent = venue.density;

        // Update classes based on density thresholds
        node.classList.remove('status-congested', 'status-warning');

        // Aria labels for screen readers
        let ariaStatus = "Clear";

        if (venue.density > 80) {
          node.classList.add('status-congested');
          ariaStatus = "Severely Congested";
        } else if (venue.density > 50) {
          node.classList.add('status-warning');
          ariaStatus = "Busy";
        }

        node.setAttribute('aria-label', `${venue.name}. Current status: ${ariaStatus}, ${venue.density}% capacity.`);
      }
    });

    // Update Incidents Panel
    if (currentState.incidents.length === 0) {
      incidentsList.innerHTML = '<li>No active incidents.</li>';
    } else {
      incidentsList.innerHTML = currentState.incidents.map(incident => {
        return `<li><strong>Alert:</strong> ${incident.message}</li>`;
      }).join('');
    }
  }

  // Handle AI Routing Request
  askAiBtn.addEventListener('click', async () => {
    const intent = intentInput.value.trim();
    if (!intent) return;

    aiResponse.textContent = 'Analyzing optimal route...';
    aiResponse.style.color = 'var(--neon-blue)';

    try {
      const res = await fetch(`${API_BASE}/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location: 'Current GPS (Mocked)',
          intent: intent
        })
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      aiResponse.textContent = data.recommendation;
      aiResponse.style.color = 'var(--neon-green)';
    } catch (error) {
      console.error(error);
      aiResponse.textContent = 'Error connecting to routing assistant. Please try again later.';
      aiResponse.style.color = 'var(--neon-red)';
    }
  });

  // Keyboard accessibility for the input
  intentInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      askAiBtn.click();
    }
  });
});
