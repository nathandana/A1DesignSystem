import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  Card,
  Grid,
  Heading,
  Icon,
  MessageBadge,
  Paragraph,
  Stack,
} from '@gtivr4/a1-design-system-react'
import neighborhoodGarage from './assets/garage-neighborhood.jpg'
import performanceGarage from './assets/garage-performance.jpg'
import dealershipGarage from './assets/garage-dealership.jpg'
import roadCity from './assets/road-city.jpg'
import salvageYard from './assets/salvage-yard.jpg'
import mechanicPlayer from './assets/mechanic-player.png'
import serviceCar from './assets/service-car-player.png'
import { BUSINESSES } from './gameData.js'
import { getBusinessEconomy, getEmpireEconomy } from './gameEngine.js'
import { formatMoney, formatRate } from './formatters.js'
import {
  WORLD_STATIONS,
  distanceBetween,
  getNearbyStation,
  getWorldTier,
  stepPosition,
} from './workshopMovement.js'
import {
  CONTRACTS,
  ROAD_HAZARDS,
  SCENE_STARTS,
  getContract,
  getContractOffers,
  getPerformanceMultiplier,
} from './workshopContracts.js'

const workshopImages = {
  neighborhood: neighborhoodGarage,
  performance: performanceGarage,
  dealership: dealershipGarage,
}

const sceneNames = {
  workshop: 'Workshop',
  road: 'City test route',
  salvage: 'Salvage yard',
}

function useCharacterMovement({
  paused,
  resetKey,
  startPosition,
  speed,
  onAction,
  onFrame,
}) {
  const [position, setPosition] = useState(startPosition)
  const [tapTarget, setTapTarget] = useState(null)
  const positionRef = useRef(startPosition)
  const vectorRef = useRef({ x: 0, y: 0 })
  const keysRef = useRef(new Set())
  const targetRef = useRef(null)
  const actionRef = useRef(onAction)
  const frameRef = useRef(onFrame)
  const pausedRef = useRef(paused)
  const speedRef = useRef(speed)
  const facingRef = useRef('right')
  const headingRef = useRef(0)

  useEffect(() => {
    actionRef.current = onAction
    frameRef.current = onFrame
    pausedRef.current = paused
    speedRef.current = speed
  }, [onAction, onFrame, paused, speed])

  useEffect(() => {
    if (!paused) return
    keysRef.current.clear()
    vectorRef.current = { x: 0, y: 0 }
    targetRef.current = null
    setTapTarget(null)
  }, [paused])

  useEffect(() => {
    positionRef.current = startPosition
    setPosition(startPosition)
    targetRef.current = null
    setTapTarget(null)
    frameRef.current?.(startPosition, {
      moving: false,
      facing: facingRef.current,
      heading: headingRef.current,
      elapsed: 0,
    })
  }, [resetKey, startPosition])

  useEffect(() => {
    const movementKeys = new Set([
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'w',
      'a',
      's',
      'd',
      'W',
      'A',
      'S',
      'D',
    ])

    function isTypingTarget(target) {
      return target instanceof Element
        && Boolean(target.closest('input, textarea, select, button, a, [contenteditable="true"]'))
    }

    function handleKeyDown(event) {
      if (pausedRef.current || isTypingTarget(event.target)) return
      if (movementKeys.has(event.key)) {
        event.preventDefault()
        keysRef.current.add(event.key.toLowerCase())
        targetRef.current = null
        setTapTarget(null)
      } else if (event.key === 'e' || event.key === 'E' || event.key === 'Enter') {
        event.preventDefault()
        actionRef.current?.()
      }
    }

    function handleKeyUp(event) {
      if (!movementKeys.has(event.key)) return
      event.preventDefault()
      keysRef.current.delete(event.key.toLowerCase())
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    let animationFrame = 0
    let previousTime = performance.now()
    let lastPublishTime = 0

    function tick(now) {
      const elapsed = Math.min(0.05, Math.max(0, (now - previousTime) / 1000))
      previousTime = now
      let x = 0
      let y = 0

      if (!pausedRef.current) {
        const keys = keysRef.current
        x = vectorRef.current.x
        y = vectorRef.current.y
        if (keys.has('arrowleft') || keys.has('a')) x -= 1
        if (keys.has('arrowright') || keys.has('d')) x += 1
        if (keys.has('arrowup') || keys.has('w')) y -= 1
        if (keys.has('arrowdown') || keys.has('s')) y += 1

        if (!x && !y && targetRef.current) {
          const target = targetRef.current
          const xDistance = (target.x - positionRef.current.x) * 1.5
          const yDistance = target.y - positionRef.current.y
          const distance = Math.hypot(xDistance, yDistance)
          if (distance < 1.1) {
            targetRef.current = null
            setTapTarget(null)
          } else {
            x = xDistance / distance
            y = yDistance / distance
          }
        }

        if (x || y) {
          const next = stepPosition(
            positionRef.current,
            { x, y },
            elapsed,
            speedRef.current,
          )
          positionRef.current = next
          if (Math.abs(x) > 0.08) facingRef.current = x < 0 ? 'left' : 'right'
          headingRef.current = Math.atan2(y, x) * 180 / Math.PI - 135

          // Proximity UI does not need 60 React renders per second. The actual
          // player and camera are updated directly below on every animation frame.
          if (now - lastPublishTime >= 80) {
            lastPublishTime = now
            setPosition(next)
          }
        }
      }

      frameRef.current?.(positionRef.current, {
        moving: Boolean(x || y),
        facing: facingRef.current,
        heading: headingRef.current,
        elapsed,
      })
      animationFrame = window.requestAnimationFrame(tick)
    }

    animationFrame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [])

  const setJoystick = useCallback((vector) => {
    vectorRef.current = vector
    if (vector.x || vector.y) {
      targetRef.current = null
      setTapTarget(null)
    }
  }, [])

  const walkTo = useCallback((target) => {
    targetRef.current = target
    setTapTarget(target)
  }, [])

  return {
    position,
    tapTarget,
    setJoystick,
    walkTo,
    getPosition: () => positionRef.current,
  }
}

function VirtualJoystick({ onChange, driving }) {
  const baseRef = useRef(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })

  const updateFromPointer = useCallback((event) => {
    const rect = baseRef.current?.getBoundingClientRect()
    if (!rect) return
    const radius = rect.width / 2
    const rawX = event.clientX - (rect.left + radius)
    const rawY = event.clientY - (rect.top + radius)
    const magnitude = Math.hypot(rawX, rawY)
    const scale = magnitude > radius ? radius / magnitude : 1
    const x = rawX * scale
    const y = rawY * scale
    setKnob({ x, y })
    onChange({ x: x / radius, y: y / radius })
  }, [onChange])

  function handlePointerDown(event) {
    event.currentTarget.setPointerCapture(event.pointerId)
    updateFromPointer(event)
  }

  function handlePointerUp(event) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setKnob({ x: 0, y: 0 })
    onChange({ x: 0, y: 0 })
  }

  return (
    <div
      ref={baseRef}
      className="a1-wrenchworks-joystick"
      role="group"
      aria-label={driving ? 'Driving joystick' : 'Movement joystick'}
      onPointerDown={handlePointerDown}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) updateFromPointer(event)
      }}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <span
        className="a1-wrenchworks-joystick__knob"
        style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
        aria-hidden="true"
      >
        <Icon name={driving ? 'sports_motorsports' : 'open_with'} />
      </span>
    </div>
  )
}

function TaskTracker({
  contract,
  objective,
  stepIndex,
  elapsed,
  targetSeconds,
  payout,
  onDispatch,
}) {
  return (
    <div className="a1-wrenchworks-task">
      <Stack direction="row" gap="sm" align="center">
        <span className="a1-wrenchworks-task__icon" aria-hidden="true">
          <Icon name={objective.icon} />
        </span>
        <span className="a1-wrenchworks-task__copy">
          <small>
            {contract.title} · {sceneNames[objective.scene]} · {stepIndex + 1}/{contract.steps.length}
          </small>
          <strong>{objective.instruction}</strong>
        </span>
        <span className="a1-wrenchworks-task__timer">
          <small>Target {targetSeconds}s</small>
          <strong>{Math.floor(elapsed)}s</strong>
        </span>
        <MessageBadge status="success" subtle icon={null}>
          {formatMoney(payout)}
        </MessageBadge>
        <Button
          className="a1-wrenchworks-task__dispatch"
          variant="tertiary"
          size="sm"
          icon="assignment"
          onClick={onDispatch}
        >
          Dispatch
        </Button>
      </Stack>
    </div>
  )
}

function ContractPicker({
  offers,
  economy,
  streak,
  completion,
  onChoose,
  onClose,
}) {
  return (
    <div className="a1-wrenchworks-contract-layer">
      <button
        className="a1-wrenchworks-contract-layer__scrim"
        type="button"
        aria-label="Return to active contract"
        onClick={onClose}
      />
      <section className="a1-wrenchworks-contract-picker" aria-label="Dispatch board">
        <Stack gap="md">
          <Stack direction="row" gap="sm" justify="between" align="start">
            <Stack gap="xs">
              <Paragraph size="sm" color="muted">
                {completion
                  ? `${completion.title} finished in ${Math.floor(completion.elapsed)} seconds`
                  : 'Choose where the next shift takes you'}
              </Paragraph>
              <Heading as="h2" size="lg">Dispatch board</Heading>
              <Paragraph color="muted">
                Fast runs build a streak and pay up to 65% more.
              </Paragraph>
            </Stack>
            <MessageBadge status="warn" subtle icon="local_fire_department">
              {streak} streak
            </MessageBadge>
          </Stack>

          <Grid columns={{ xs: 1, md: 3 }} gap="sm">
            {offers.map((contract) => (
              <Card className="a1-wrenchworks-contract-card" key={contract.id}>
                <Stack gap="sm">
                  <span className="a1-wrenchworks-contract-card__icon" aria-hidden="true">
                    <Icon name={contract.icon} />
                  </span>
                  <Stack gap="xs">
                    <Heading as="h3" size="sm">{contract.title}</Heading>
                    <Paragraph size="sm" color="muted">{contract.summary}</Paragraph>
                  </Stack>
                  <Stack direction="row" gap="xs" wrap>
                    <MessageBadge status="info" subtle icon={null}>
                      {contract.steps.length} stops
                    </MessageBadge>
                    <MessageBadge status="success" subtle icon={null}>
                      {formatMoney(economy.manualRevenue * contract.rewardMultiplier)}
                    </MessageBadge>
                  </Stack>
                  <Button
                    variant="primary"
                    fullWidth
                    icon={contract.icon}
                    onClick={() => onChoose(contract.id)}
                  >
                    Take contract
                  </Button>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </section>
    </div>
  )
}

function CrewMember({ index }) {
  const positions = [
    { x: 34, y: 43 },
    { x: 56, y: 31 },
    { x: 76, y: 48 },
  ]
  const position = positions[index % positions.length]

  return (
    <img
      className={`a1-wrenchworks-crew-member a1-wrenchworks-crew-member--${index + 1}`}
      src={mechanicPlayer}
      alt=""
      aria-hidden="true"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    />
  )
}

export function WorkshopWorld({ game, actions, panelOpen, onOpenPanel }) {
  const viewportRef = useRef(null)
  const stageRef = useRef(null)
  const playerRef = useRef(null)
  const avatarRef = useRef(null)
  const stageMetricsRef = useRef({
    viewportWidth: 0,
    viewportHeight: 0,
    stageWidth: 0,
    stageHeight: 0,
    cameraX: 0,
    cameraY: 0,
  })
  const sceneRef = useRef('workshop')
  const arrivalKeyRef = useRef('')
  const hazardHitRef = useRef(0)

  const [contractId, setContractId] = useState(CONTRACTS[0].id)
  const [contractStep, setContractStep] = useState(0)
  const [contractSerial, setContractSerial] = useState(0)
  const [contractRun, setContractRun] = useState(1)
  const [startedAt, setStartedAt] = useState(Date.now())
  const [penaltySeconds, setPenaltySeconds] = useState(0)
  const [streak, setStreak] = useState(0)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [completion, setCompletion] = useState(null)
  const [arrivalPulse, setArrivalPulse] = useState(0)
  const [rewardBurst, setRewardBurst] = useState(null)
  const [hazardHit, setHazardHit] = useState(null)
  const [boosting, setBoosting] = useState(false)

  const business = BUSINESSES.find((item) => item.id === game.activeBusinessId) ?? BUSINESSES[0]
  const serviceState = game.businesses[business.id]
  const economy = getBusinessEconomy(game, business.id)
  const empireEconomy = getEmpireEconomy(game)
  const contract = getContract(contractId)
  const objective = contract.steps[contractStep] ?? contract.steps[0]
  const scene = objective.scene
  const elapsed = Math.max(0, (game.lastTickAt - startedAt) / 1000) + penaltySeconds
  const predictedPayout = economy.manualRevenue * contract.rewardMultiplier
  const offers = useMemo(
    () => getContractOffers(contractSerial, business.id),
    [business.id, contractSerial],
  )
  sceneRef.current = scene

  const renderFrame = useCallback((position, motion) => {
    const stage = stageRef.current
    const player = playerRef.current
    const avatar = avatarRef.current
    const metrics = stageMetricsRef.current
    if (!stage || !player || !avatar || !metrics.stageWidth) return

    const overflowX = Math.max(0, metrics.stageWidth - metrics.viewportWidth)
    const desiredX = Math.min(
      0,
      Math.max(
        -overflowX,
        metrics.viewportWidth / 2 - position.x / 100 * metrics.stageWidth,
      ),
    )
    const desiredY = Math.max(0, (metrics.viewportHeight - metrics.stageHeight) / 2)
    const smoothing = motion.elapsed > 0
      ? 1 - Math.exp(-16 * motion.elapsed)
      : 1
    metrics.cameraX += (desiredX - metrics.cameraX) * smoothing
    metrics.cameraY += (desiredY - metrics.cameraY) * smoothing

    const pixelRatio = Math.max(1, window.devicePixelRatio || 1)
    const cameraX = Math.round(metrics.cameraX * pixelRatio) / pixelRatio
    const cameraY = Math.round(metrics.cameraY * pixelRatio) / pixelRatio
    stage.style.transform = `translate3d(${cameraX}px, ${cameraY}px, 0)`
    player.style.left = `${position.x}%`
    player.style.top = `${position.y}%`
    player.style.zIndex = String(Math.round(position.y))
    player.classList.toggle('a1-wrenchworks-player--moving', motion.moving)

    if (sceneRef.current === 'road') {
      avatar.style.transform = `rotate(${motion.heading}deg)`
    } else {
      avatar.style.transform = motion.facing === 'left' ? 'scaleX(-1)' : ''
    }
  }, [])

  const onActionRef = useRef(null)
  const movement = useCharacterMovement({
    paused: panelOpen || pickerOpen,
    resetKey: `${business.id}-${contractRun}-${scene}`,
    startPosition: SCENE_STARTS[scene],
    speed: scene === 'road' ? (hazardHit ? 23 : boosting ? 52 : 38) : 25,
    onAction: () => onActionRef.current?.(),
    onFrame: renderFrame,
  })
  const currentNearbyStation = scene === 'workshop'
    ? getNearbyStation(movement.position)
    : null

  const openNearbyPanel = useCallback(() => {
    if (currentNearbyStation?.panel) onOpenPanel(currentNearbyStation.panel)
  }, [currentNearbyStation, onOpenPanel])

  useEffect(() => {
    onActionRef.current = openNearbyPanel
  }, [openNearbyPanel])

  useEffect(() => {
    const element = viewportRef.current
    const stage = stageRef.current
    if (!element || !stage) return undefined

    const observer = new ResizeObserver(([entry]) => {
      const viewportWidth = entry.contentRect.width
      const viewportHeight = entry.contentRect.height
      const viewportRatio = viewportWidth / Math.max(1, viewportHeight)
      const stageWidth = viewportRatio >= 1.5 ? viewportWidth : viewportHeight * 1.5
      const stageHeight = viewportRatio >= 1.5 ? viewportWidth / 1.5 : viewportHeight
      const metrics = stageMetricsRef.current
      metrics.viewportWidth = viewportWidth
      metrics.viewportHeight = viewportHeight
      metrics.stageWidth = stageWidth
      metrics.stageHeight = stageHeight
      metrics.cameraX = Math.min(
        0,
        Math.max(
          viewportWidth - stageWidth,
          viewportWidth / 2 - movement.getPosition().x / 100 * stageWidth,
        ),
      )
      metrics.cameraY = Math.max(0, (viewportHeight - stageHeight) / 2)
      stage.style.width = `${stageWidth}px`
      stage.style.height = `${stageHeight}px`
      renderFrame(movement.getPosition(), {
        moving: false,
        facing: 'right',
        heading: 0,
        elapsed: 0,
      })
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [renderFrame])

  useEffect(() => {
    const preloadFieldScenes = () => {
      for (const source of [roadCity, salvageYard, serviceCar]) {
        const image = new Image()
        image.decoding = 'async'
        image.src = source
      }
    }
    const idleId = 'requestIdleCallback' in window
      ? window.requestIdleCallback(preloadFieldScenes)
      : window.setTimeout(preloadFieldScenes, 600)

    return () => {
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleId)
      else window.clearTimeout(idleId)
    }
  }, [])

  useEffect(() => {
    setContractStep(0)
    setContractRun((current) => current + 1)
    setStartedAt(Date.now())
    setPenaltySeconds(0)
    setPickerOpen(false)
    arrivalKeyRef.current = ''
  }, [business.id])

  useEffect(() => {
    if (panelOpen || pickerOpen) return
    const arrivalKey = `${contractRun}-${contractStep}`
    if (arrivalKeyRef.current === arrivalKey) return
    if (distanceBetween(movement.position, objective) > 6.2) return

    arrivalKeyRef.current = arrivalKey
    setArrivalPulse((current) => current + 1)

    if (contractStep < contract.steps.length - 1) {
      setContractStep((current) => current + 1)
      return
    }

    const finishedElapsed = Math.max(1, (Date.now() - startedAt) / 1000 + penaltySeconds)
    const fastRun = finishedElapsed <= contract.targetSeconds
    const performanceMultiplier = getPerformanceMultiplier(
      finishedElapsed,
      contract.targetSeconds,
      streak,
    )
    const payout = predictedPayout * performanceMultiplier

    actions.completeContract(
      business.id,
      contract.rewardMultiplier * performanceMultiplier,
      contract.reputationMultiplier,
      contract.title,
    )
    setStreak((current) => fastRun ? current + 1 : 0)
    setCompletion({ title: contract.title, elapsed: finishedElapsed, payout })
    setRewardBurst({ id: Date.now(), value: payout })
    setContractSerial((current) => current + 1)
    setPickerOpen(true)
    window.setTimeout(() => setRewardBurst(null), 1600)
  }, [
    actions,
    business.id,
    contract,
    contractRun,
    contractStep,
    movement.position,
    objective,
    panelOpen,
    penaltySeconds,
    pickerOpen,
    predictedPayout,
    startedAt,
    streak,
  ])

  useEffect(() => {
    arrivalKeyRef.current = ''
    setBoosting(false)
  }, [contractStep, contractRun])

  useEffect(() => {
    if (scene !== 'road') return
    const hit = ROAD_HAZARDS.find(
      (hazard) => distanceBetween(movement.position, hazard) <= 5.4,
    )
    if (!hit || Date.now() - hazardHitRef.current < 2200) return
    hazardHitRef.current = Date.now()
    setPenaltySeconds((current) => current + 3)
    setHazardHit(hit)
    window.setTimeout(() => setHazardHit(null), 1300)
  }, [movement.position, scene])

  function chooseContract(nextContractId) {
    setContractId(nextContractId)
    setContractStep(0)
    setContractRun((current) => current + 1)
    setStartedAt(Date.now())
    setPenaltySeconds(0)
    setCompletion(null)
    setPickerOpen(false)
    arrivalKeyRef.current = ''
  }

  function handleWorldPointerDown(event) {
    if (panelOpen || pickerOpen || event.button > 0) return
    if (event.target instanceof Element && event.target.closest('button, [role="button"]')) return
    if (scene === 'road') return
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    movement.walkTo({
      x: Math.min(93, Math.max(7, (event.clientX - rect.left) / rect.width * 100)),
      y: Math.min(89, Math.max(20, (event.clientY - rect.top) / rect.height * 100)),
    })
  }

  const worldTier = getWorldTier(business.id)
  const backgroundImage = scene === 'road'
    ? roadCity
    : scene === 'salvage'
      ? salvageYard
      : workshopImages[worldTier]
  const visibleCrew = scene === 'workshop'
    ? Math.min(3, Math.max(0, serviceState.staff - 1))
    : 0
  const objectiveDistance = distanceBetween(movement.position, objective)
  const hideSalvageMarker = Boolean(objective.hidden && objectiveDistance > 21)
  const objectiveAngle = Math.atan2(
    objective.y - movement.position.y,
    (objective.x - movement.position.x) * 1.5,
  ) * 180 / Math.PI + 90

  return (
    <section
      className={`a1-wrenchworks-world a1-wrenchworks-world--${scene}`}
      aria-label={`${contract.title}: ${sceneNames[scene]}`}
    >
      <TaskTracker
        contract={contract}
        objective={objective}
        stepIndex={contractStep}
        elapsed={elapsed}
        targetSeconds={contract.targetSeconds}
        payout={predictedPayout}
        onDispatch={() => setPickerOpen(true)}
      />

      <div
        className="a1-wrenchworks-world__viewport"
        ref={viewportRef}
        onPointerDown={handleWorldPointerDown}
      >
        <div
          className="a1-wrenchworks-world__stage"
          ref={stageRef}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="a1-wrenchworks-world__vignette" aria-hidden="true" />

          {scene === 'workshop' && WORLD_STATIONS.map((station) => {
            const isObjective = station.id === objective.station
            const isNearby = currentNearbyStation?.id === station.id
            return (
              <div
                className={[
                  'a1-wrenchworks-station',
                  isObjective && 'a1-wrenchworks-station--objective',
                  isNearby && 'a1-wrenchworks-station--nearby',
                ].filter(Boolean).join(' ')}
                style={{ left: `${station.x}%`, top: `${station.y}%` }}
                key={station.id}
                aria-hidden="true"
              >
                <span className="a1-wrenchworks-station__ring">
                  <Icon name={station.icon} />
                </span>
                <span className="a1-wrenchworks-station__label">
                  {isObjective ? objective.instruction : station.shortLabel}
                </span>
              </div>
            )
          })}

          {scene === 'road' && ROAD_HAZARDS.map((hazard) => (
            <div
              className="a1-wrenchworks-hazard"
              style={{ left: `${hazard.x}%`, top: `${hazard.y}%` }}
              key={hazard.id}
              aria-hidden="true"
            >
              <Icon name={hazard.icon} />
            </div>
          ))}

          {scene !== 'workshop' && !hideSalvageMarker && (
            <div
              className={[
                'a1-wrenchworks-field-objective',
                objective.hidden && 'a1-wrenchworks-field-objective--hidden',
              ].filter(Boolean).join(' ')}
              style={{ left: `${objective.x}%`, top: `${objective.y}%` }}
              aria-hidden="true"
            >
              <span><Icon name={objective.icon} /></span>
              <strong>{objective.instruction}</strong>
            </div>
          )}

          {movement.tapTarget && (
            <span
              className="a1-wrenchworks-tap-target"
              style={{ left: `${movement.tapTarget.x}%`, top: `${movement.tapTarget.y}%` }}
              aria-hidden="true"
            />
          )}

          {Array.from({ length: visibleCrew }, (_, index) => (
            <CrewMember index={index} key={index} />
          ))}

          <div
            ref={playerRef}
            className={[
              'a1-wrenchworks-player',
              scene === 'road' && 'a1-wrenchworks-player--vehicle',
            ].filter(Boolean).join(' ')}
          >
            <span className="a1-wrenchworks-player__shadow" aria-hidden="true" />
            <img
              ref={avatarRef}
              src={scene === 'road' ? serviceCar : mechanicPlayer}
              alt={scene === 'road' ? 'Your Wrenchworks service car' : 'You, the Wrenchworks mechanic'}
              draggable="false"
            />
            {rewardBurst && (
              <span className="a1-wrenchworks-reward-burst" key={rewardBurst.id}>
                +{formatMoney(rewardBurst.value)}
              </span>
            )}
          </div>

          <span className="a1-sr-only" aria-live="polite" key={arrivalPulse}>
            {arrivalPulse > 0 ? `${objective.instruction} complete.` : ''}
          </span>
        </div>
      </div>

      <div className="a1-wrenchworks-scene-name" key={`${contractRun}-${scene}`}>
        <Icon name={scene === 'road' ? 'directions_car' : scene === 'salvage' ? 'search' : 'home_repair_service'} />
        <span>
          <small>Now entering</small>
          <strong>{sceneNames[scene]}</strong>
        </span>
      </div>

      {scene === 'salvage' && hideSalvageMarker && (
        <div className="a1-wrenchworks-radar">
          <Icon name="radar" aria-hidden="true" />
          <span>
            Signal {objectiveDistance < 32 ? 'getting warmer' : 'is faint'} · {Math.ceil(objectiveDistance)}m
          </span>
        </div>
      )}

      {scene !== 'workshop' && (
        <div className="a1-wrenchworks-compass" aria-hidden="true">
          <span style={{ transform: `rotate(${objectiveAngle}deg)` }}>
            <Icon name="navigation" />
          </span>
          <strong>{Math.ceil(objectiveDistance)}m</strong>
        </div>
      )}

      {hazardHit && (
        <div className="a1-wrenchworks-hazard-alert" role="status">
          <Icon name={hazardHit.icon} />
          {hazardHit.label} · +3 seconds
        </div>
      )}

      <div className="a1-wrenchworks-world__status">
        <span><Icon name="local_fire_department" aria-hidden="true" /> {streak} streak</span>
        <span><Icon name="analytics" aria-hidden="true" /> {formatRate(empireEconomy.incomeRate)}</span>
        <span><Icon name="star" aria-hidden="true" /> Level {serviceState.level}</span>
      </div>

      <VirtualJoystick onChange={movement.setJoystick} driving={scene === 'road'} />

      <Paragraph className="a1-wrenchworks-world__hint" size="sm">
        {scene === 'road' ? 'Steer with the joystick or WASD' : 'Move with the joystick, tap, or WASD'}
      </Paragraph>

      {scene === 'road' && (
        <div className="a1-wrenchworks-boost">
          <Button
            variant={boosting ? 'success' : 'secondary'}
            size="lg"
            icon="bolt"
            onPointerDown={() => setBoosting(true)}
            onPointerUp={() => setBoosting(false)}
            onPointerCancel={() => setBoosting(false)}
            onPointerLeave={() => setBoosting(false)}
          >
            Hold to boost
          </Button>
        </div>
      )}

      {currentNearbyStation?.panel && !panelOpen && !pickerOpen && (
        <div className="a1-wrenchworks-world__action">
          <Button
            variant="primary"
            size="lg"
            icon={currentNearbyStation.icon}
            onClick={openNearbyPanel}
          >
            Open {currentNearbyStation.shortLabel}
          </Button>
          <small>or press E</small>
        </div>
      )}

      {pickerOpen && (
        <ContractPicker
          offers={offers}
          economy={economy}
          streak={streak}
          completion={completion}
          onChoose={chooseContract}
          onClose={() => {
            if (!completion) setPickerOpen(false)
          }}
        />
      )}
    </section>
  )
}
