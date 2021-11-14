import * as actions from './actions'
import { themes } from './color-theme'
import { randomInterger } from './helpers'
//import { getCookie } from '../utils/browserCookieHandler'
//import sortArray from '../utils/sortArray'

/*
const getHighscore = () => {
  const setHighScore = getCookie('high-score') || 0
  const setHighScoreLevel = getCookie('high-score-level') || 0
  return {
    score: parseInt(setHighScore) || 0,
    level: parseInt(setHighScoreLevel) || 0,
    name: 'ABC',
  }
}
const HighScoreListCookie = getCookie('high-score-list')
const getHighscoreList = () => HighScoreListCookie ? JSON.parse(HighScoreListCookie) : []
*/
const initialState = {
  gameStatus: 'MOUNTING',
  score: 0,
  lives: 3,
  newPresentStatus: 'IDLE',
  newUfoStatus: 'IDLE',
  level: 0,
  numAsteroids: 3,
  shield: false,
  shieldFuel: 0,
  upgradeFuel: 0,
  upgradeFuelTotal: 0,
  updateUpgradeStatus: 0,
  selectedColorTheme: randomInterger(0, themes.length - 1 ),
  highscore: 0,
  highscoreList: [],
  rank: 5,
  resultsCalculated: false,
}

interface IsomeActions {
  type: string,
  payload:any
}

export const Asteroids = (state = initialState, { type, payload }:{type: string, payload:any}) => {

    switch (type) {
      case actions.UPDATE_GAME_STATUS:
        return {
          ...state,
          gameStatus: payload,
        }
        break
      case actions.UPDATE_GAME_LEVEL:
        let newLevel
        if (String(payload).indexOf('+') < 0 && String(payload).indexOf('-') < 0) {
          newLevel = Number(payload)
        } else {
          newLevel = Math.ceil(Number(state.level) + Number(payload))
        }
        return {
          ...state,
          level: newLevel,
        }
        break
      case actions.UPDATE_NUM_ASTEROIDS:
        let numAsteroids
        if (String(payload).indexOf('+') < 0 && String(payload).indexOf('-') < 0) {
          numAsteroids = Number(payload)
        } else {
          numAsteroids = Math.ceil(Number(state.numAsteroids) + Number(payload))
        }
        return {
          ...state,
          numAsteroids,
        }
        break
      case actions.UPDATE_NEW_PRESENTS_STATUS:
        return {
          ...state,
          newPresentStatus: payload,
        }
        break
      case actions.UPDATE_NEW_UFO_STATUS:
        return {
          ...state,
          newUfoStatus: payload,
        }
        break
      case actions.UPDATE_UPGRADE_STATUS:
        return {
          ...state,
          updateUpgradeStatus: payload,
        }
        break
      case actions.UPDATE_SHIELD_FUEL:
        return {
          ...state,
          shieldFuel: Number(payload),
        }
        break
      case actions.UPDATE_UPGRADE_FUEL:
        return {
          ...state,
          upgradeFuel: Number(payload.data),
          upgradeFuelTotal: Number(payload.total),
        }
        break
      case actions.UPDATE_LIVES:
        let newLives
        if (String(payload).indexOf('+') < 0 && String(payload).indexOf('-') < 0) {
          newLives = Number(payload)
        } else {
          newLives = Math.ceil(Number(state.lives) + Number(payload))
        }
        return {
          ...state,
          lives: newLives < 0 ? 0 : newLives,
        }
        break
      case actions.ADD_SCORE:
        return {
          ...state,
          score: Math.ceil(Number(state.score) + Number(payload)),
        }
        break
      case actions.RESET_SCORE:
        return {
          ...state,
          score: 0,
        }
        break
      case actions.UPDATE_COLOR_THEME:
        return {
          ...state,
          selectedColorTheme: payload,
        }
        break
      case actions.UPDATE_HIGHSCORE:
        return {
          ...state,
          highscore: payload,
        }
        break
      case actions.UPDATE_HIGHSCORE_LIST:
        return {
          ...state,
          highscoreList: payload,
        }
        break
        case actions.UPDATE_RESULTS_CALCULATED:
          return {
            ...state,
            resultsCalculated: payload,
          }
          break
        case actions.UPDATE_RANK:
          return {
            ...state,
            rank: payload,
          }
          break
      default:
        return state
        break
    }
  }
export default Asteroids