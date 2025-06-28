# DendriteLLM Interface

Application for tree-based conversations with LLMs, solving the context rot problem where conversations become unfocused due to tangents and accumulated junk. Create branches, explore different conversation paths, and maintain clean context isolation throughout your AI interactions.

## Features

### Core Functionality
- **Tree Conversations**: Transform linear chats into navigable tree structures with visual branching
- **Smart Branching**: Create new discussion threads from any historical message point
- **Context Isolation**: Each branch maintains its own clean conversation context
- **Visual Navigation**: Interactive tree diagram with React Flow for conversation exploration
- **Persistent State**: All conversations and UI states preserved locally for privacy
- **Claude Integration**: Direct integration with Anthropic's Claude API

## Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with dark mode support
- **Tree Visualization**: React Flow for interactive node-based diagrams
- **State Management**: Zustand with persistence middleware
- **Storage**: localStorage with Map serialization/deserialization
- **Icons**: Lucide React icon library
- **API**: Direct Anthropic Claude API integration with CORS proxy

## Prerequisites

- **Node.js 18+** (tested with Node.js 20.3.0+)
- **npm or yarn** package manager
- **Anthropic API key** (for Claude integration)

## Quick Start

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd dendritellm
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to `http://localhost:5173`

### First Use

1. **Explore the Demo**: The app automatically loads a StarCraft conversation tree to demonstrate features
2. **Set Up API**: Go to Settings → Enter your Anthropic API key
3. **Start Chatting**: Create a new tree or continue from demo branches
4. **Explore Tree View**: Switch between Chat and Tree views to see your conversation structure

## Building & Deployment

### Development Build
```bash
npm run dev          # Start development server with hot reload
npm run build        # Create production build
npm run preview      # Preview production build locally
```

### Code Quality
```bash
npm run lint         # ESLint code quality check
npm run typecheck    # TypeScript type checking
```

### Production
The app builds to static files in `dist/` directory, suitable for any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## Usage Guide

### Creating Conversation Trees

1. **New Tree**: Click "+" in sidebar → Enter tree name → Start chatting
2. **Demo Exploration**: Use the pre-loaded StarCraft tree to understand features

### Branching Conversations

1. **From Chat**: Hover over any message → Click branch icon → Name your branch
2. **From Tree**: Right-click any node → Create branch
3. **Navigation**: Branches automatically switch when clicking different conversation paths

### View Navigation

- **Chat View**: Traditional linear chat showing current conversation path
- **Tree View**: Interactive visual map of your entire conversation structure  
- **⚙Settings**: API configuration and app preferences

### Tree Interaction

- **Click nodes**: Navigate and switch branches automatically
- **Double-click nodes**: Jump directly to chat view at that message
- **Drag nodes**: Reposition for better organization (positions are saved)
- **Zoom/Pan**: Navigate large conversation trees easily
- **Tree Navigation Buttons**: Click tree icons in chat bubbles to locate messages in tree view

## Architecture

### Data Structure
```typescript
ConversationTree {
  nodes: Map<string, ConversationNode>     // Message pairs with metadata
  branches: Branch[]                       // Branch definitions and state  
  nodePositions: Map<string, Position>     // Custom node positions
  treeViewport: { x, y, zoom }            // Saved viewport state
}

ConversationNode {
  userMessage: string                      // User input
  aiResponse: string                       // Claude response
  branchId: string                        // Branch association
  children: string[]                      // Child node references
}
```

### State Management
- **Zustand Store**: Centralized state with automatic persistence
- **Local Storage**: All data stored locally with Map serialization
- **Viewport State**: Pan/zoom positions preserved across sessions
- **Branch Context**: Clean context isolation per conversation path

## Configuration

### API Setup
1. **Settings Panel**: Click gear icon in sidebar
2. **API Key**: Enter your Anthropic API key
3. **Model Options**: Choose from Claude 3 models (Sonnet, Opus, Haiku)
4. **Parameters**: Adjust temperature, max tokens, etc.

### Available Models
- **Claude 3.5 Sonnet** (default) - Best balance of performance and speed
- **Claude 3 Opus** - Highest capability model
- **Claude 3 Haiku** - Fastest responses

### CORS Configuration
Development server includes automatic proxy configuration for Claude API calls, eliminating CORS issues during development.
