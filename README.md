# Promptwarsevent
AI-powered Smart Stadium Assistant that improves crowd movement, reduces wait times, and provides real-time recommendations using Google Cloud and simulated data.

# Smart Stadium AI Assistant

## Problem Statement

In large events/summits/sports stadiums/venues, a lot of people often face issues and struggle with heavy crowd movement, long waiting times at food stalls and restrooms, and no real-time information at all. This creates hectic situation, confusion and reduces the overall event experience.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Solution Overview

Smart Stadium AI Assistant is a simple lightweight web application that improves the physical event experience using simulated real-time data and AI-based recommendations for smooth operations.

The system helps users:

* Avoid crowded areas and stay away from them
* Find quicker and faster routes inside and around the stadium
* Reduce waiting time at queues
* Get real-time alerts and suggestions

Even without live data, the system simulates real-world scenarios to demonstrate how such a solution would work in actual environments.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
## Architecture

The application follows a clean and modular structure:

Frontend: Mobile-first web UI using HTML, CSS, and JavaScript
Backend: Node.js (Express) API layer
Simulation Engine: Generates real-time crowd and queue data
AI Layer: Uses Vertex AI (Gemini) for intelligent recommendations
Data Layer: Firebase Firestore for storing and syncing data

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Google Services Used

Firebase (Firestore)
  Used for storing and syncing real-time simulation data across the system.

Google Maps Platform
  Used to visualize routes, crowd density, and navigation inside the stadium.

Vertex AI (Gemini)
  Used to generate smart, context-aware recommendations based on crowd conditions and user input.

Cloud Run (Design Consideration)
  Backend is designed to be deployed on Cloud Run for scalability and serverless execution.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Key Features

Real-time crowd density simulation
Queue wait-time estimation
AI-based route recommendations
Context-aware alerts (crowd surge, empty zones, etc.)
Mobile-friendly UI with futuristic design

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Security

Input validation on API endpoints
Rate limiting to prevent misuse
Secure handling of API keys using environment variables
Privacy-aware handling of user location data

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Testing

Unit tests for simulation engine
API endpoint testing
Edge case handling:

   Sudden crowd spike
   Empty stadium scenario

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Accessibility

ARIA labels for better screen reader support
Keyboard navigation support
High contrast UI for readability
Gender-neutral icons for inclusive design

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Tech Stack

Frontend: HTML, CSS, JavaScript (Vanilla)
Backend: Node.js (Express)
Deployment: Google Cloud Run
Containerization: Docker
Real-time Simulation: Custom Node.js event engine

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
## How to Run Locally

1. Go to backend folder:
   cd backend

2. Install dependencies:
   npm install

3. Start the server:
   npm start

4. Open in browser:
   http://localhost:3000

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Assumptions

Real-time data is simulated for demo purposes
Google services are integrated conceptually and can be configured with proper credentials
Designed for scalability but implemented as a lightweight demo

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Conclusion

This project demonstrates how AI and Google Cloud services can be used together to improve real-world stadium experiences. The focus is on simplicity, usability, and practical implementation.
