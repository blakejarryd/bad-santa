# 🎅 Bad Santa Gift Exchange App

A fun and interactive web application to facilitate Bad Santa (White Elephant) gift exchanges during holiday parties! Created with ❤️ by Honest Fox.

## 🎯 Features

- **Player Management**
  - Easy player registration
  - Random number assignment
  - Player status tracking
  - Hidden player order reveal system

- **Game Flow Control**
  - Suspenseful turn reveals
  - Gift tracking (wrapped/unwrapped)
  - Steal history tracking
  - Game state persistence
  - Automatic winner determination

- **Interactive UI**
  - Real-time game updates
  - Gift animation effects
  - Turn notifications
  - Mystery player cards
  - Dramatic turn reveals
  - Game history display

## 🎮 Game Rules

1. **Setup Phase**
   - Players register their names
   - Each player brings one wrapped gift
   - System randomly assigns numbers to players
   - Turn order is revealed one player at a time

2. **Game Phase**
   - Players take turns based on their hidden numbers
   - Next player is revealed only after current turn
   - On their turn, a player can:
     - Choose a wrapped gift
     - Steal an unwrapped gift (max 3 steals per gift)
   - If a player's gift is stolen, they must either:
     - Choose a new wrapped gift
     - Steal from someone else

3. **End Game**
   - Game ends when all gifts are unwrapped
   - Winner is determined by most stolen gift
   - Final statistics shown for all players

## 🛠 Technical Stack

- **Frontend Only**
  - React.js
  - TailwindCSS
  - Framer Motion (for animations)
  - Local Storage (for game state persistence)

## 📱 Responsive Design

- Mobile-first approach
- Tablet & desktop friendly
- Optimized for party settings

## 🚀 Installation & Running

1. **Prerequisites**
   - Node.js (v14 or higher)
   - npm or yarn

2. **Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/your-repo/bad-santa.git

   # Navigate to project directory
   cd bad-santa

   # Install dependencies
   npm install
   # or
   yarn install
   ```

3. **Running the App**
   ```bash
   # Start development server
   npm run dev
   # or
   yarn dev
   ```

4. **Access the App**
   - Open your browser
   - Navigate to `http://localhost:5174`
   - Start adding players!

## 🎯 How to Play

1. **Start Game**
   - Add all players' names
   - Click "Start Game"
   - Watch the dramatic turn order reveal

2. **During Game**
   - Current player's card is highlighted
   - Previous players remain visible
   - Future players stay mysterious
   - Follow prompts for gift actions

3. **End Game**
   - View final gift distribution
   - See who had the most stolen gift
   - Check individual player statistics

## 🔒 Security Considerations

- Secure player sessions
- Game state protection
- Rate limiting for actions
- Input validation

## 📦 Future Enhancements

- Virtual gift wrapping
- Custom game rules
- Remote play support
- Gift suggestion integration
- Party music integration
- Multi-room support

## 📝 Development Guidelines

1. Follow component-based architecture
2. Implement responsive design patterns
3. Maintain real-time game state
4. Include engaging animations
5. Ensure mobile-first development

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
