import { createContext, useContext, useReducer } from 'react'

const GameContext = createContext()

const initialState = {
  phase: 'setup',
  players: [],
  currentTurn: null,
  gifts: [],
  history: [],
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'ADD_PLAYER':
      return {
        ...state,
        players: [...state.players, action.payload],
      }
    case 'START_GAME':
      return {
        ...state,
        phase: 'playing',
        currentTurn: 0,
      }
    // Add more cases as needed
    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}