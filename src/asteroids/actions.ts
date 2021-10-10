import { createAction } from 'redux-actions'
import { randomNumBetween } from './helpers'
import { addInterval, removeInterval } from './gameIntervalHandler'

export const EXAMPLE_ACTION = 'EXAMPLE_ACTION'
const _updateExample = createAction(EXAMPLE_ACTION)
const updateExample = (data:string) => (dispatch:Function) => dispatch(_updateExample(data))

export const UPDATE_GAME_STATUS = 'UPDATE_GAME_STATUS'
const _updateGameStatus = createAction(UPDATE_GAME_STATUS)
const updateGameStatus = (data:string) => (dispatch:Function) => dispatch(_updateGameStatus(data))

export const UPDATE_GAME_LEVEL = 'UPDATE_GAME_LEVEL'
const _updateGameLevel = createAction(UPDATE_GAME_LEVEL)
const updateGameLevel = (data:number) => (dispatch:Function) => {dispatch(_updateGameLevel(data))}

export const UPDATE_NUM_ASTEROIDS = 'UPDATE_NUM_ASTEROIDS'
const _updateNumAsteroids = createAction(UPDATE_NUM_ASTEROIDS)
const updateNumAsteroids = (data:number) => (dispatch:Function) => dispatch(_updateNumAsteroids(data))

export const ADD_SCORE = 'ADD_SCORE'
const _addScore = createAction(ADD_SCORE)
const addScore = (data:number) => (dispatch:Function) => dispatch(_addScore(data))

export const RESET_SCORE = 'RESET_SCORE'
const resetScore = createAction(RESET_SCORE)

export const UPDATE_LIVES = 'UPDATE_LIVES'
const _updateLives = createAction(UPDATE_LIVES)
const updateLives = (data:number) => (dispatch:Function) => dispatch(_updateLives(data))

export const UPDATE_SHIELD_FUEL = 'UPDATE_SHIELD_FUEL'
const _updateShieldFuel = createAction(UPDATE_SHIELD_FUEL)
const updateShieldFuel = (data:number) => (dispatch:Function) => dispatch(_updateShieldFuel(data))

export const UPDATE_UPGRADE_FUEL = 'UPDATE_UPGRADE_FUEL'
const _updateUpgradeFuel = createAction(UPDATE_UPGRADE_FUEL)
const updateUpgradeFuel = (data:number) => (dispatch:Function) => dispatch(_updateUpgradeFuel(data))

export const UPDATE_HIGHSCORE = 'UPDATE_HIGHSCORE'
const _updateHighscore = createAction(UPDATE_HIGHSCORE)
const updateHighscore = (data:number) => (dispatch:Function) => dispatch(_updateHighscore(data))

export const UPDATE_HIGHSCORE_LIST = 'UPDATE_HIGHSCORE_LIST'
const _updateHighscoreList = createAction(UPDATE_HIGHSCORE_LIST)
const updateHighscoreList = (data:Array<number>) => (dispatch:Function) => dispatch(_updateHighscoreList(data))

export const UPDATE_RESULTS_CALCULATED = 'UPDATE_RESULTS_CALCULATED'
const _updateResultsCalculated = createAction(UPDATE_RESULTS_CALCULATED)
const updateResultsCalculated = (data:number) => (dispatch:Function) => dispatch(_updateResultsCalculated(data))

export const UPDATE_RANK = 'UPDATE_RANK'
const _updateRank = createAction(UPDATE_RANK)
const updateRank = (data:number) => (dispatch:Function) => dispatch(_updateRank(data))




// New present handler
// GENERATING, DELIVER, IDLE,
export const UPDATE_NEW_PRESENTS_STATUS = 'UPDATE_NEW_PRESENTS_STATUS'
const _updateNewPresentStatus = createAction(UPDATE_NEW_PRESENTS_STATUS)
const updateNewPresentStatus = (forceTo:string) => (dispatch:Function, getState:Function) => {
  const state = getState()
  if (state.asteroids.gameStatus !== 'GAME_ON' || forceTo === 'IDLE') {
    dispatch(_updateNewPresentStatus('IDLE'))
    return null
  }
  dispatch(_updateNewPresentStatus('GENERATING'))
  addInterval('newPresentsInterval', randomNumBetween(5000, 10000), () => {
    removeInterval('newPresentsInterval')
    dispatch(_updateNewPresentStatus('DELIVER'))
  })
}

// New ufo handler
// GENERATING, DELIVER, IDLE,
export const UPDATE_NEW_UFO_STATUS = 'UPDATE_NEW_UFO_STATUS'
const _updateNewUfoStatus = createAction(UPDATE_NEW_UFO_STATUS)
const updateNewUfoStatus = (forceTo:string) => (dispatch:Function, getState:Function) => {
  const state = getState()
  if (state.asteroids.gameStatus !== 'GAME_ON' || forceTo === 'IDLE') {
    dispatch(_updateNewUfoStatus('IDLE'))
    return null
  }

  let max = 20000
  let min = 10000
  if (state.asteroids.level === 2) {
    max = 15000
    min = 10000
  }
  if (state.asteroids.level === 3) {
    max = 12000
    min = 7000
  }
  if (state.asteroids.level > 3) {
    max = 12000
    min = 5000
  }
  dispatch(_updateNewUfoStatus('GENERATING'))
  removeInterval('newUfoInterval')
  addInterval('newUfoInterval', randomNumBetween(min, max), () => {
    removeInterval('newUfoInterval')
    dispatch(_updateNewUfoStatus('DELIVER'))
  })
}

const updateShieldStatus = (data:number) => (dispatch:Function, getState:Function) => {
  
}

export const UPDATE_UPGRADE_STATUS = 'UPDATE_UPGRADE_STATUS'
const _updateUpgradeStatus = createAction(UPDATE_UPGRADE_STATUS)
const updateUpgradeStatus = (data:number) => (dispatch:Function) => dispatch(_updateUpgradeStatus(data))

export const UPDATE_COLOR_THEME = 'UPDATE_COLOR_THEME'
const _updateColorTheme = createAction(UPDATE_COLOR_THEME)
const updateColorTheme = (data:number) => (dispatch:Function) => dispatch(_updateColorTheme(data))


export const actionCreators = {
  updateGameStatus,
  addScore,
  updateLives,
  updateNewPresentStatus,
  updateNewUfoStatus,
  updateGameLevel,
  updateNumAsteroids,
  resetScore,
  updateShieldStatus,
  updateUpgradeStatus,
  updateShieldFuel,
  updateUpgradeFuel,
  updateColorTheme,
  updateHighscore,
  updateHighscoreList,
  updateResultsCalculated,
  updateRank,
}