# DendriteLLM Interface - Project Context

## Project Overview

**DendriteLLM: Conversation Tree LLM Interface** is a web application that transforms linear AI chat conversations into navigable tree structures, solving the "context rot" problem where conversations become unfocused due to tangents and accumulated information.

## Problem Statement

Current LLM chat interfaces suffer from several limitations:
- **Context Rot**: Tangential discussions pollute the main conversation thread
- **Linear History**: No way to explore multiple conversation paths simultaneously
- **Lost Focus**: Difficult to return to earlier conversation states without carrying forward irrelevant context
- **Inefficient Exploration**: Users can't test different approaches while preserving successful paths

## Solution Architecture

### Core Concept
Transform conversations from linear chat logs into navigable tree structures where:
- Each user prompt + AI response pair = one node
- Users can branch from any previous node
- Multiple conversation paths can exist simultaneously
- Each path maintains clean, isolated context
- Simple for user to click and navigate UI nodes to bring up chat UI

### Key Innovations
1. **Branching Conversations**: Create new discussion threads from any historical point
2. **Context Isolation**: Each branch maintains its own clean context
3. **Visual Navigation**: Interactive tree diagram for conversation exploration
4. **State Preservation**: Jump between conversation states without data loss

## Technical Specifications

### Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite (fast HMR, optimized builds)
- **UI Framework**: Tailwind CSS
- **Icons**: Lucide React
- **Tree Visualization**: React Flow
- **State Management**: Zustand (lightweight, minimal boilerplate)
- **Storage**: 
  - Browser localStorage (simple data)
  - Dexie.js + IndexedDB (larger conversation trees)
- **API Integration**: Anthropic Claude API (direct fetch calls)
- **Hosting**: GitHub Pages with GitHub Actions CI/CD

### Architecture Patterns
- **Component-Based**: Modular React components for maintainability
- **State-First**: Zustand store manages all conversation state
- **Client-Side Only**: No backend server required - runs entirely in browser
- **API Key Management**: User-provided API keys stored locally and securely

## Core Features

### 1. Tree Visualization
- Interactive visual representation of conversation structure
- Clickable nodes for navigation
- Breadcrumb trails showing current path
- Zoom and pan capabilities for large trees

### 2. Conversation Navigation
- Jump to any previous conversation state
- View full conversation path from root to selected node
- Clear visual indicators of current position
- Seamless context switching

### 3. Branch Management
- Create branches from any historical node
- Multiple active conversation paths
- Branch labeling and organization
- Merge capabilities for combining insights

### 4. Context Preservation
- Each branch maintains isolated conversation history
- No context bleeding between branches
- Clean context for focused discussions
- Full conversation reconstruction from any node

### 5. Data Persistence
- Local storage of conversation trees
- No data leaves user's machine
- Import/export capabilities for backup
- Conversation history preservation across sessions

## User Interface Components

### Primary Views
1. **Chat Interface**: Traditional chat view showing current conversation path
2. **Tree View**: Visual representation of entire conversation structure
3. **Navigation Panel**: Controls for branching and node selection
4. **Settings Panel**: API key management and preferences

### Key Interactions
- **Send Message**: Creates new node in current branch
- **Navigate Node**: Click any node to switch conversation state
- **Create Branch**: Branch from any historical point
- **View Path**: See full conversation from root to current node

## Use Cases

### Development Workflows
- **Code Debugging**: Explore different bug fix approaches while maintaining working solutions
- **Architecture Decisions**: Test multiple technical approaches simultaneously
- **Code Review**: Discuss different implementation strategies in parallel branches

### Research & Learning
- **Deep Dives**: Investigate tangential topics without losing main research thread
- **Concept Exploration**: Explore related ideas while preserving primary learning path
- **Information Synthesis**: Combine insights from multiple conversation branches

### Creative Work
- **Writing**: Explore different narrative directions while preserving original storylines
- **Brainstorming**: Test multiple creative approaches simultaneously
- **Ideation**: Build upon different conceptual foundations in parallel

### Problem Solving
- **Strategy Testing**: Evaluate multiple solution approaches
- **Decision Making**: Explore consequences of different choices
- **Analysis**: Deep-dive into specific aspects while maintaining big picture

## Technical Implementation Details

### Data Structure
```typescript
interface ConversationNode {
  id: string;
  parentId: string | null;
  userMessage: string;
  aiResponse: string;
  timestamp: Date;
  children: string[];
  metadata: NodeMetadata;
}

interface ConversationTree {
  rootId: string;
  nodes: Map<string, ConversationNode>;
  currentNodeId: string;
  branches: Branch[];
}
```

### State Management
- **Zustand Store**: Central state management for conversation trees
- **Persistent Storage**: Automatic sync with localStorage/IndexedDB
- **Optimistic Updates**: Immediate UI feedback with background persistence

### API Integration
- **Claude API**: Direct fetch calls to Anthropic's API
- **Streaming Support**: Real-time response streaming for better UX
- **Error Handling**: Robust error recovery and user feedback
- **Rate Limiting**: Client-side rate limit management

## Development Approach

### Phase 1: Core Functionality
1. Basic conversation tree data structure
2. Simple chat interface with tree storage
3. Node navigation and branching
4. Local storage persistence

### Phase 2: Enhanced UX
1. React Flow tree visualization
2. Advanced navigation controls
3. Branch management features
4. Export/import capabilities

### Phase 3: Advanced Features
1. Conversation search and filtering
2. Branch comparison tools
3. Collaboration features
4. Advanced tree operations

## Security & Privacy

### Data Protection
- **Local-Only**: All data remains on user's machine
- **API Key Security**: Secure local storage of user credentials
- **No Telemetry**: No data collection or external tracking
- **Open Source**: Full transparency of code and data handling

### Best Practices
- **Input Sanitization**: Protection against XSS attacks
- **Secure Storage**: Encrypted storage of sensitive data
- **HTTPS Only**: Secure API communications
- **Error Boundaries**: Graceful error handling and recovery

## Project Goals

### Primary Objectives
1. **Eliminate Context Rot**: Enable focused, tangent-free conversations
2. **Enable Exploration**: Allow free idea exploration without losing progress
3. **Improve Productivity**: More efficient AI-assisted work through better organization
4. **Maintain Privacy**: Keep all user data local and secure

### Success Metrics
- Users can successfully navigate complex conversation trees
- Context switching feels natural and intuitive
- Conversation quality improves with reduced context pollution
- Users report increased productivity in AI-assisted tasks

## Development Environment

### Setup Requirements
- Node.js 18+ with npm/yarn
- Modern browser with ES2020+ support
- Anthropic API key for Claude access
- Git for version control

### Build & Deploy
- **Development**: `npm run dev` with Vite hot reload
- **Production**: `npm run build` generates optimized static files
- **Deployment**: GitHub Actions automatic deployment to GitHub Pages
- **Testing**: Vitest for unit tests, Playwright for E2E testing

This project represents a fundamental shift in how users interact with AI assistants, moving from linear conversations to structured, navigable knowledge trees that preserve context and enable efficient exploration of ideas.