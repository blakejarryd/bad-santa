import { useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'

const FESTIVE_ICONS = [
  '🎅', '🎄', '🎁', '⛄', '🦌', '🔔', '❄️', '🎪', 
  '🍪', '🥛', '🧦', '🕯️', '🎉', '🤶', '🛷', '🌟'
]

// Add these CSS variables to your global styles or tailwind config
// Colors based on Honest Fox's website
const HONEST_FOX_COLORS = {
  red: '#DC3B2C', // Their brand red
  green: '#1B4332', // A complementary dark green for secondary actions
  gray: '#4B5563', // For text
  lightGray: '#F3F4F6', // For backgrounds
}

function App() {
  const [gameState, setGameState] = useState({
    phase: 'setup', // setup, playing, ended
    players: [],
    currentTurn: null,
    gifts: [],
  })

  // Add new state for player name input
  const [newPlayerName, setNewPlayerName] = useState('')

  // Add new state for animation
  const [isRevealing, setIsRevealing] = useState(false)
  const [revealedPlayers, setRevealedPlayers] = useState([])

  // Add new state for gift actions
  const [giftAction, setGiftAction] = useState(null) // 'pile' or 'steal'
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  // Add state to track who has had their first turn and who was just stolen from
  const [playersWhoHaveHadTurn, setPlayersWhoHaveHadTurn] = useState(new Set())
  const [justStolenFrom, setJustStolenFrom] = useState(null)

  // Add to your state declarations
  const [stealStats, setStealStats] = useState({})

  // Add new state for turn reveal
  const [isRevealingNextTurn, setIsRevealingNextTurn] = useState(false)
  const [showNextTurnButton, setShowNextTurnButton] = useState(false)

  // Add this helper function at the component level
  const checkGameEnd = (players) => {
    return players.every(player => player.hasGift)
  }

  // Add player handler
  const handleAddPlayer = (e) => {
    e.preventDefault()
    if (!newPlayerName.trim()) return

    const randomIcon = FESTIVE_ICONS[Math.floor(Math.random() * FESTIVE_ICONS.length)]
    const newPlayer = {
      id: Date.now(),
      name: newPlayerName.trim(),
      number: null,
      hasGift: false,
      icon: randomIcon
    }

    setGameState(prev => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }))
    setNewPlayerName('')
  }

  // Start game handler
  const handleStartGame = async () => {
    if (gameState.players.length < 2) return

    setIsRevealing(true)
    setRevealedPlayers([])
    setPlayersWhoHaveHadTurn(new Set())
    setJustStolenFrom(null)
    setStealStats({}) // Reset steal statistics
    
    // Initial pause for suspense
    await new Promise(resolve => setTimeout(resolve, 1000))

    const shuffledPlayers = gameState.players.map(player => ({
      ...player,
      number: Math.random()
    }))
    .sort((a, b) => a.number - b.number)
    .map((player, index) => ({
      ...player,
      number: index + 1
    }))

    setGameState(prev => ({
      ...prev,
      phase: 'playing',
      players: shuffledPlayers.map(p => ({ ...p, number: null })),
      currentTurn: null
    }))

    // Reveal each player's number with a delay
    for (let i = 0; i < shuffledPlayers.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setRevealedPlayers(prev => [...prev, shuffledPlayers[i].id])
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(p => 
          p.id === shuffledPlayers[i].id 
            ? { ...p, number: shuffledPlayers[i].number }
            : p
        )
      }))
    }

    // Final pause before starting
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRevealing(false)
    setGameState(prev => ({
      ...prev,
      currentTurn: shuffledPlayers[0].id,
      players: shuffledPlayers
    }))
  }

  // Keep these functions at the component level, but pass currentPlayer as a parameter
  const handleNextTurn = () => {
    setGameState(prev => {
      let currentIndex = prev.players.findIndex(p => p.id === prev.currentTurn)
      let nextIndex = (currentIndex + 1) % prev.players.length
      
      // Skip players who already have gifts
      while (prev.players[nextIndex].hasGift && 
             !prev.players.every(p => p.hasGift)) {
        nextIndex = (nextIndex + 1) % prev.players.length
      }
      
      return {
        ...prev,
        currentTurn: prev.players[nextIndex].id
      }
    })
  }

  const handleGiftFromPile = (currentPlayer) => {
    setPlayersWhoHaveHadTurn(prev => new Set([...prev, currentPlayer.id]))
    
    setGameState(prev => {
      const updatedPlayers = prev.players.map(p =>
        p.id === currentPlayer.id ? { ...p, hasGift: true } : p
      )
      
      if (checkGameEnd(updatedPlayers)) {
        return {
          ...prev,
          phase: 'ended',
          players: updatedPlayers
        }
      }

      return {
        ...prev,
        players: updatedPlayers,
        currentTurn: null // Clear current turn
      }
    })
    
    setJustStolenFrom(null)
    setShowNextTurnButton(true) // Show the "Reveal Next Player" button
  }

  const handleSteal = (currentPlayer, stolenFromId) => {
    setPlayersWhoHaveHadTurn(prev => new Set([...prev, currentPlayer.id]))
    setJustStolenFrom(stolenFromId)
    
    setStealStats(prev => ({
      ...prev,
      [stolenFromId]: (prev[stolenFromId] || 0) + 1
    }))
    
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p =>
        p.id === currentPlayer.id ? { ...p, hasGift: true } :
        p.id === stolenFromId ? { ...p, hasGift: false } : p
      ),
      currentTurn: stolenFromId
    }))
  }

  const handleRevealNextTurn = () => {
    setIsRevealingNextTurn(true)
    setShowNextTurnButton(false)
    
    // Dramatic pause before revealing next player
    setTimeout(() => {
      setGameState(prev => {
        const currentIndex = prev.players.findIndex(p => p.id === prev.currentTurn)
        let nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % prev.players.length
        
        // Skip players who already have gifts
        while (prev.players[nextIndex].hasGift && 
               !prev.players.every(p => p.hasGift)) {
          nextIndex = (nextIndex + 1) % prev.players.length
        }
        
        return {
          ...prev,
          currentTurn: prev.players[nextIndex].id
        }
      })
      setIsRevealingNextTurn(false)
    }, 3000) // 3 second reveal animation
  }

  const renderTurnReveal = () => {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.2, 1.2, 0.5],
            rotateY: [0, 360, 720, 1080]
          }}
          transition={{ 
            duration: 3,
            times: [0, 0.3, 0.7, 1],
            repeat: Infinity
          }}
          className="text-6xl mb-8"
        >
          🎁
        </motion.div>
        <motion.h2
          className="text-3xl font-bold mb-4"
          style={{ color: HONEST_FOX_COLORS.red }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Next Player Coming Up...
        </motion.h2>
        <p className="text-lg text-gray-600">Get ready for the next turn!</p>
      </div>
    )
  }

  const renderGamePhase = () => {
    const currentPlayer = gameState.players.find(p => p.id === gameState.currentTurn)
    const isPlayerFirstAction = !playersWhoHaveHadTurn.has(currentPlayer?.id)
    const otherPlayersWithGifts = gameState.players.filter(p => 
      p.id !== gameState.currentTurn && p.hasGift
    )

    if (isRevealing) {
      return (
        <div className="text-center">
          <motion.h2 
            className="text-2xl font-semibold mb-8"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎲 Drawing Turn Order 
          </motion.h2>
          
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-4">
              {gameState.players.map((player, index) => (
                <motion.div
                  key={player.id}
                  className="relative w-[140px] h-[200px] perspective-1000"
                >
                  <div
                    className={`
                      p-6 rounded-xl shadow-lg
                      flex flex-col items-center justify-center
                      text-white
                    `}
                    style={{ backgroundColor: HONEST_FOX_COLORS.red }}
                  >
                    <div className="text-4xl mb-4">🎁</div>
                    <div className="text-lg font-medium">Mystery</div>
                    <div className="text-lg font-medium">Player</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-lg text-gray-600"
          >
            {revealedPlayers.length === 0 ? (
              "🎅 Santa is mixing up the order..."
            ) : revealedPlayers.length === gameState.players.length ? (
              "✨ All positions drawn! Game starting..."
            ) : (
              `🎯 Drawing position ${revealedPlayers.length + 1} of ${gameState.players.length}`
            )}
          </motion.div>
        </div>
      );
    }

    if (isRevealingNextTurn) {
      return renderTurnReveal()
    }

    return (
      <div className="min-h-screen p-4 bg-white">
        <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          {/* Action buttons and turn indicator */}
          <div className="flex-shrink-0 w-full lg:w-1/3 space-y-6 lg:pr-16">
            {currentPlayer && (
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold mb-6" style={{ color: HONEST_FOX_COLORS.red }}>
                  {currentPlayer.name}'s Turn
                </div>
                <div className="space-y-4">
                  <button 
                    onClick={() => handleGiftFromPile(currentPlayer)}
                    className="btn-primary w-full text-lg px-6 py-3"
                  >
                    {justStolenFrom ? "Your gift was stolen! Take from Pile 🎁" : "Take Gift from Pile 🎁"}
                  </button>

                  {!justStolenFrom && otherPlayersWithGifts.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xl font-medium">Or Steal From:</h4>
                      <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                        {otherPlayersWithGifts.map(player => (
                          <button
                            key={player.id}
                            onClick={() => handleSteal(currentPlayer, player.id)}
                            className="btn-secondary px-4 py-2 text-base"
                          >
                            <div className="text-xl mb-1">{player.icon}</div>
                            {player.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!currentPlayer && showNextTurnButton && (
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold mb-4" style={{ color: HONEST_FOX_COLORS.red }}>
                  Ready for the next player?
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRevealNextTurn}
                  className="px-6 py-3 rounded-lg text-white font-medium transition-all text-lg"
                  style={{ backgroundColor: HONEST_FOX_COLORS.red }}
                >
                  Reveal Next Player
                </motion.button>
              </div>
            )}
          </div>

          {/* Player cards section */}
          <div className="flex-grow lg:pl-16">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-[1400px]">
              {gameState.players.map(player => {
                const hasHadTurn = playersWhoHaveHadTurn.has(player.id)
                const isCurrentTurn = player.id === gameState.currentTurn
                const isFirstPlayer = player.number === 1
                const shouldReveal = hasHadTurn || isCurrentTurn || isFirstPlayer

                return (
                  <motion.div
                    key={player.id}
                    className={`
                      relative w-full h-[180px]
                      perspective-1000
                      ${isCurrentTurn ? 'ring-2 ring-green-500' : ''}
                    `}
                  >
                    {shouldReveal ? (
                      <div
                        className={`
                          p-4 rounded-lg shadow-lg
                          ${isCurrentTurn ? 'bg-green-50' : 'bg-white'}
                          flex flex-col items-center justify-center
                          h-full
                        `}
                      >
                        <div className="text-4xl mb-2">{player.icon}</div>
                        <div className="text-base font-medium">{player.name}</div>
                        {player.hasGift && (
                          <div className="text-sm text-gray-600 mt-2">
                            Has Gift 🎁
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`
                          p-4 rounded-lg shadow-lg
                          flex flex-col items-center justify-center
                          text-white h-full
                        `}
                        style={{ backgroundColor: HONEST_FOX_COLORS.red }}
                      >
                        <div className="text-4xl mb-3">🎁</div>
                        <div className="text-base font-medium">Mystery</div>
                        <div className="text-base font-medium">Player</div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Add a new render function for the end game state
  const renderEndGame = () => {
    // Find the player(s) who were stolen from the most
    const maxSteals = Math.max(...Object.values(stealStats).concat(0))
    const winners = gameState.players.filter(player => 
      (stealStats[player.id] || 0) === maxSteals
    )
    
    return (
      <div className="text-center">
        <motion.h2 
          className="text-4xl font-bold text-santa-red mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          🎄 Game Over! 🎄
        </motion.h2>
        
        {maxSteals > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 p-6 bg-green-100 rounded-xl"
          >
            <h3 className="text-2xl mb-2">
              {winners.length > 1 ? "🏆 Winners 🏆" : "🏆 Winner 🏆"}
            </h3>
            <div className="text-xl text-green-700 mb-2">
              Most Popular ({maxSteals} steals)
            </div>
            <div className="flex justify-center gap-2">
              {winners.map(winner => (
                <span key={winner.id} className="font-bold">
                  {winner.icon} {winner.name}
                </span>
              ))}
            </div>
          </motion.div>
        )}
        
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl mb-4">Final Results:</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {gameState.players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                className={`
                  p-6 rounded-xl shadow-lg bg-white min-w-[140px]
                  ${winners.some(w => w.id === player.id) ? 'ring-4 ring-green-400' : ''}
                `}
              >
                <div className="text-4xl mb-2">{player.icon}</div>
                <div className="font-bold text-3xl text-santa-red mb-1">
                  {player.number}
                </div>
                <div className="text-lg font-medium">{player.name}</div>
                <div className="text-sm mt-2 space-y-1">
                  <div className="text-green-600">
                    🎁 Got their gift!
                  </div>
                  <div className={`
                    ${(stealStats[player.id] || 0) > 0 ? 'text-blue-600' : 'text-gray-400'}
                  `}>
                    🎯 Stolen from: {stealStats[player.id] || 0} times
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => window.location.reload()}
          className="btn-primary bg-green-600 hover:bg-green-700"
        >
          Play Again
        </motion.button>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 bg-white">
      <header className="text-center mb-12">
        <div className="flex items-center justify-center gap-4">
          <motion.div
            animate={{
              rotate: [-5, 5, -5],
              y: [0, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-4xl"
          >
            🦊
          </motion.div>
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-bold"
            style={{ color: HONEST_FOX_COLORS.red }}
          >
            Bad Santa
          </motion.h1>
        </div>
        <p className="text-lg" style={{ color: HONEST_FOX_COLORS.gray }}>
          An Honest Fox Gift Exchange Game
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        {gameState.phase === 'setup' && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Setup Game</h2>
            
            {/* Add player form */}
            <form onSubmit={handleAddPlayer} className="mb-4">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name"
                className="px-4 py-2 border rounded mr-2"
              />
              <button type="submit" className="btn-primary">
                Add Player
              </button>
            </form>

            {/* Player list */}
            <div className="mb-6">
              <h3 className="text-xl mb-2">Players:</h3>
              <ul className="space-y-2">
                {gameState.players.map(player => (
                  <li key={player.id} className="text-lg flex items-center justify-center gap-2">
                    <span>{player.icon}</span>
                    <span>{player.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Start game button */}
            {gameState.players.length >= 2 && (
              <button 
                onClick={handleStartGame}
                className="btn-primary bg-green-600 hover:bg-green-700"
              >
                Start Game
              </button>
            )}
          </div>
        )}
        
        {gameState.phase === 'playing' && renderGamePhase()}
        {gameState.phase === 'ended' && renderEndGame()}
      </main>
    </div>
  )
}

export default App