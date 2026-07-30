import { useCallback, useEffect, useRef, useState } from 'react'
import {
  advanceGame,
  chooseDecision,
  claimMilestone,
  clearSavedGame,
  createNewGame,
  hireManager,
  hireStaff,
  loadGame,
  saveGame,
  selectBusiness,
  startFranchise,
  unlockBusiness,
  upgradeBusiness,
  workJob,
} from './gameEngine.js'

export function useWrenchworks() {
  const initialLoad = useRef(null)
  if (!initialLoad.current) initialLoad.current = loadGame()

  const [game, setGame] = useState(initialLoad.current.game)
  const [offlineSummary, setOfflineSummary] = useState(initialLoad.current.offlineSummary)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setGame((current) => advanceGame(current, Date.now()))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveGame(game)
    }, 250)
    return () => window.clearTimeout(timer)
  }, [game])

  useEffect(() => {
    const saveCurrentProgress = () => {
      setGame((current) => {
        const progressed = advanceGame(current, Date.now())
        saveGame(progressed)
        return progressed
      })
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') saveCurrentProgress()
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('pagehide', saveCurrentProgress)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('pagehide', saveCurrentProgress)
    }
  }, [])

  const runCommand = useCallback((command) => {
    setGame((current) => command(advanceGame(current, Date.now())))
  }, [])

  const actions = {
    selectBusiness: useCallback(
      (businessId) => runCommand((current) => selectBusiness(current, businessId)),
      [runCommand],
    ),
    workJob: useCallback(
      (businessId) => runCommand((current) => workJob(current, businessId, Date.now())),
      [runCommand],
    ),
    upgradeBusiness: useCallback(
      (businessId) => runCommand((current) => upgradeBusiness(current, businessId)),
      [runCommand],
    ),
    hireStaff: useCallback(
      (businessId) => runCommand((current) => hireStaff(current, businessId)),
      [runCommand],
    ),
    hireManager: useCallback(
      (businessId) => runCommand((current) => hireManager(current, businessId)),
      [runCommand],
    ),
    unlockBusiness: useCallback(
      (businessId) => runCommand((current) => unlockBusiness(current, businessId)),
      [runCommand],
    ),
    chooseDecision: useCallback(
      (decisionId, choiceId) =>
        runCommand((current) => chooseDecision(current, decisionId, choiceId)),
      [runCommand],
    ),
    claimMilestone: useCallback(
      (milestoneId) => runCommand((current) => claimMilestone(current, milestoneId)),
      [runCommand],
    ),
    startFranchise: useCallback(
      () => runCommand((current) => startFranchise(current, Date.now())),
      [runCommand],
    ),
    resetGame: useCallback(() => {
      clearSavedGame()
      const newGame = createNewGame(Date.now())
      saveGame(newGame)
      setOfflineSummary(null)
      setGame(newGame)
    }, []),
  }

  return {
    game,
    actions,
    offlineSummary,
    dismissOfflineSummary: () => setOfflineSummary(null),
  }
}
