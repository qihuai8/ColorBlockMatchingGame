# Neon Pop - Color Matching Game with AI Integration

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)](https://ai.google.dev/)

</div>

## 🎮 Overview

**Neon Pop** is an engaging color-matching puzzle game built with React and TypeScript. Players pop groups of adjacent same-colored blocks to earn points and advance through levels. The game features AI-powered hints powered by Google's Gemini AI to help players strategize and improve their gameplay.

## 🌟 Features

- **Color Matching Gameplay**: Click groups of 2 or more adjacent same-colored blocks to pop them
- **AI-Powered Hints**: Get strategic advice from Gemini AI to improve your gameplay
- **Progressive Difficulty**: Levels increase as you reach target scores
- **Score Tracking**: High score saved in local storage
- **Responsive Design**: Works on various screen sizes
- **Visual Feedback**: Animated blocks with selection effects
- **Dynamic Board Generation**: New blocks fall from the top after groups are popped

## 🎯 How to Play

1. **Select**: Click a group of 2 or more same-colored blocks to select them
2. **Pop**: Click the selected group again to pop it and earn points
3. **Strategy**: Larger groups grant exponentially more points (group size² × 10)
4. **Progress**: Reach the target score to advance to the next level
5. **AI Tips**: Use the "Get AI Tip" button for strategic advice

### Scoring System
- Points = (Group Size)² × 10
- Example: Popping a group of 4 blocks = 4² × 10 = 160 points

## 🛠️ Tech Stack

- **Frontend**: React 19.2.3 with TypeScript
- **Build Tool**: Vite 6.2.0
- **AI Integration**: Google Gemini API
- **Styling**: Tailwind CSS (via utility classes)
- **State Management**: React Hooks (useState, useEffect)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)

### Installation

1. Clone or download the repository
2. Navigate to the project directory:
   ```bash
   cd neon-pop---color-matcher
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your Gemini API key:
   - Create a `.env.local` file in the root directory
   - Add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key for AI hints |

## 📁 Project Structure

```
neon-pop---color-matcher/
├── components/
│   └── Block.tsx          # Individual block component
├── services/
│   └── geminiService.ts   # AI hint generation service
├── App.tsx               # Main game component
├── constants.ts          # Game constants and color mappings
├── types.ts              # TypeScript type definitions
└── README.md             # Project documentation
```

## 🎨 Game Mechanics

### Board Structure
- 10×10 grid with 5 different colored blocks (red, blue, green, yellow, purple)
- When blocks are popped, remaining blocks fall down due to gravity
- New blocks generate from the top to fill empty spaces

### Level Progression
- Initial target score: 2000 points
- Each level increases the target score by (2000 × level)
- Example: Level 1 requires 2000 points, Level 2 requires 6000 points (2000 + 4000), etc.

### AI Integration
The game uses Google's Gemini AI to analyze the current board state and provide strategic hints to players. The AI considers:
- Current board configuration
- Player's score and level
- Potential moves and strategies

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Game Configuration

The game constants can be modified in `constants.ts`:
- `GRID_SIZE`: Size of the game board (default: 10)
- `COLORS`: Available block colors (default: 5 colors)
- `INITIAL_TARGET_SCORE`: Starting target score (default: 2000)
- `SCORE_MULTIPLIER`: Points multiplier (default: 10)

## 🤖 AI Hints

The game features an AI-powered hint system using Google's Gemini API. When players click "Get AI Tip":
1. The current board state is sent to the Gemini API
2. The AI analyzes the board and suggests strategic moves
3. A personalized tip is returned to help the player

## 📱 Responsive Design

The game is designed to work on various screen sizes:
- Desktop: Full gameplay experience with sidebar hints
- Mobile: Adapts to smaller screens while maintaining core functionality

## 📈 Scoring & Progression

- **High Score**: Saved in browser's local storage
- **Level System**: Increases when target score is reached
- **Progress Bar**: Visual indicator of progress toward the next level

## 🛡️ Privacy

- Game progress (high score) is stored locally in the browser
- No personal data is collected or transmitted
- AI hints only send the current board state to the Gemini API

## 🚀 Deployment

This application can be deployed to any static hosting service that supports React applications. For production builds, run:

```bash
npm run build
```

The built files will be available in the `dist` directory.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve the game.

## 📄 License

This project is open source and available under the MIT License.

## ⚡ Performance

- Built with React for efficient rendering
- Optimized animations and transitions
- Efficient algorithms for finding connected blocks
- Minimal re-renders through proper state management

---

<div align="center">

*Powered by Google Gemini AI*  
Made with ❤️ using React and TypeScript

</div>