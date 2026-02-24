# Bharat Yatra AI - India Trip Planner

An AI-powered trip planner for India using React, Redux, and local AI integration.

## Features

- **Dynamic City Data**: Cities fetched from AI (Ollama) instead of hardcoded
- **Dynamic Tourist Spots**: Real-time AI-powered tourist attractions
- **AI Chat Assistant**: Interactive chatbot for travel queries
- **Redux State Management**: Centralized store for all trip data
- **Budget Calculator**: Real-time cost estimation
- **5-Step Trip Planning**: Route → Dates → Transport → Itinerary → Summary

## Prerequisites

1. **Node.js** installed (v18+ recommended)
2. **Ollama** installed for local AI (optional - falls back to preset data if unavailable)

## Setup Instructions

### 1. Install Dependencies

```
bash
npm install
```

### 2. Start Ollama (Optional - for AI features)

If you want AI-powered features, install and run Ollama:

```
bash
# Install Ollama (from https://ollama.com)
# Then run:
ollama serve
ollama pull llama3.2
```

The app works without Ollama - it will use preset fallback data.

### 3. Run Development Server

```
bash
npm run dev
```

### 4. Open Browser

Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── App.jsx              # Main application component
├── index.css           # Global styles
├── main.jsx            # Entry point
├── store/
│   ├── index.js        # Redux store configuration
│   └── slices/
│       ├── citiesSlice.js   # Cities state management
│       ├── spotsSlice.js    # Tourist spots state
│       ├── tripSlice.js     # Trip details state
│       └── chatSlice.js     # Chat messages state
└── services/
    └── aiService.js    # AI API integration
```

## AI Configuration

The AI service is configured to use Ollama by default (free, local):
- **Provider**: Ollama (localhost:11434)
- **Model**: llama3.2
- **Fallback**: Preset data if AI unavailable

To change the AI provider, edit `src/services/aiService.js`.

## How It Works

1. **Source & Destination**: User selects cities via autocomplete (fetched from AI)
2. **Dates & Group**: Select travel dates and number of people
3. **Transport**: Choose private vehicle or public transport
4. **Itinerary**: AI fetches tourist spots for the destination
5. **Summary**: View complete trip cost breakdown

The AI chat assistant is available throughout for travel queries.

## Build for Production

```
bash
npm run build
```

## Tech Stack

- React 18
- Redux Toolkit
- Vite
- CSS (custom styling)
- Ollama (local AI)
