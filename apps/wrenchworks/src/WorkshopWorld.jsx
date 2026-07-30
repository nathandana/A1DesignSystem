import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  Icon,
  MessageBadge,
  Paragraph,
  Stack,
} from '@gtivr4/a1-design-system-react'
import neighborhoodGarage from './assets/garage-neighborhood.jpg'
import performanceGarage from './assets/garage-performance.jpg'
import dealershipGarage from './assets/garage-dealership.jpg'
import mechanicPlayer from './assets/mechanic-player.png'
import { BUSINESSES } from './gameData.js'
import {
  getBusinessEconomy,
  getEmpireEconomy,
  getManualCooldown,
  getManualSecondsRemaining,
} from './gameEngine.js'
import { formatClock, formatMoney, formatRate } from './formatters.js'
import {
  PLAYER_START,
  WORLD_STATIONS,
  distanceBetween,
  getJobRoute,
  getNearbyStation,
  getWorldTier,
  stepPosition,
} from './workshopMovement.js'

const worldImages = {
  neighborhood: neighborhoodGarage,
  performance: performanceGarage,
  dealership: dealershipGarage,
}

function useCharacterMovement({ paused, businessId, onAction }) {
  const [position, setPosition] = useState(PLAYER_START)
  const [moving, setMoving] = useState(false)
  const [facing, setFacing] = useState('right')
  const [tapTarget, setTapTarget] = useState(null)
  const positionRef = useRef(position)
  const vectorRef = useRef({ x: 0, y: 0 })
  const keysRef = useRef(new Set())
  const targetRef = useRef(null)
  const actionRef = useRef(onAction)
  const pausedRef = useRef(paused)
  const movingRef = useRef(false)

  useEffect(() => {
    actionRef.current = onAction
  }, [onAction])

  useEffect(() => {
    pausedRef.current = paused
    if (paused) {
      keysRef.current.clear()
      vectorRef.current = { x: 0, y: 0 }
      targetRef.current = null
      setTapTarget(null)
      setMoving(false)
    }
  }, [paused])

  useEffect(() => {
    const nextPosition = businessId === BUSINESSES[0].id
      ? PLAYER_START
      : { x: 86, y: 82 }
    positionRef.current = nextPosition
    setPosition(nextPosition)
    targetRef.current = null
    setTapTarget(null)
  }, [businessId])

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

    function tick(now) {
      const elapsed = Math.min(0.05, Math.max(0, (now - previousTime) / 1000))
      previousTime = now

      if (!pausedRef.current) {
        const keys = keysRef.current
        let x = vectorRef.current.x
        let y = vectorRef.current.y
        if (keys.has('arrowleft') || keys.has('a')) x -= 1
        if (keys.has('arrowright') || keys.has('d')) x += 1
        if (keys.has('arrowup') || keys.has('w')) y -= 1
        if (keys.has('arrowdown') || keys.has('s')) y += 1

        if (!x && !y && targetRef.current) {
          const target = targetRef.current
          const xDistance = (target.x - positionRef.current.x) * 1.5
          const yDistance = target.y - positionRef.current.y
          const distance = Math.hypot(xDistance, yDistance)
          if (distance < 1.2) {
            targetRef.current = null
            setTapTarget(null)
          } else {
            x = xDistance / distance
            y = yDistance / distance
          }
        }

        const isMoving = Boolean(x || y)
        if (isMoving) {
          const next = stepPosition(positionRef.current, { x, y }, elapsed)
          positionRef.current = next
          setPosition(next)
          if (Math.abs(x) > 0.08) setFacing(x < 0 ? 'left' : 'right')
        }

        if (movingRef.current !== isMoving) {
          movingRef.current = isMoving
          setMoving(isMoving)
        }
      }

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
    moving,
    facing,
    tapTarget,
    setJoystick,
    walkTo,
  }
}

function VirtualJoystick({ onChange }) {
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
      aria-label="Movement joystick"
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
        <Icon name="open_with" />
      </span>
    </div>
  )
}

function TaskTracker({ business, objective, step, total, cooldown, reward }) {
  return (
    <div className="a1-wrenchworks-task">
      <Stack direction="row" gap="sm" align="center">
        <span className="a1-wrenchworks-task__icon" aria-hidden="true">
          <Icon name={cooldown > 0 ? 'schedule' : objective.icon} />
        </span>
        <span className="a1-wrenchworks-task__copy">
          <small>{business.shortName} · {cooldown > 0 ? 'Bay resetting' : `Step ${step + 1} of ${total}`}</small>
          <strong>
            {cooldown > 0
              ? `Next customer in ${formatClock(cooldown)}`
              : objective.instruction}
          </strong>
        </span>
        <MessageBadge status="success" subtle icon={null}>
          {formatMoney(reward)}
        </MessageBadge>
      </Stack>
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
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const [jobStep, setJobStep] = useState(0)
  const [cooldownUntil, setCooldownUntil] = useState(0)
  const [arrivalPulse, setArrivalPulse] = useState(0)
  const [rewardBurst, setRewardBurst] = useState(null)
  const arrivalKeyRef = useRef('')
  const business = BUSINESSES.find((item) => item.id === game.activeBusinessId) ?? BUSINESSES[0]
  const serviceState = game.businesses[business.id]
  const economy = getBusinessEconomy(game, business.id)
  const empireEconomy = getEmpireEconomy(game)
  const route = useMemo(() => getJobRoute(business.id), [business.id])
  const now = game.lastTickAt
  const engineCooldown = getManualSecondsRemaining(game, business.id, now)
  const localCooldown = Math.max(0, (cooldownUntil - Date.now()) / 1000)
  const cooldown = Math.max(engineCooldown, localCooldown)
  const objective = route[jobStep] ?? route[0]

  const onActionRef = useRef(null)
  const movement = useCharacterMovement({
    paused: panelOpen,
    businessId: business.id,
    onAction: () => onActionRef.current?.(),
  })
  const nearbyStation = getNearbyStation(movement.position)

  const openNearbyPanel = useCallback(() => {
    if (nearbyStation?.panel) onOpenPanel(nearbyStation.panel)
  }, [nearbyStation, onOpenPanel])

  useEffect(() => {
    onActionRef.current = openNearbyPanel
  }, [openNearbyPanel])

  useEffect(() => {
    const element = viewportRef.current
    if (!element) return undefined
    const observer = new ResizeObserver(([entry]) => {
      setViewport({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setJobStep(0)
    setCooldownUntil(0)
    arrivalKeyRef.current = ''
  }, [business.id])

  useEffect(() => {
    if (panelOpen || cooldown > 0) return
    const arrivalKey = `${business.id}-${jobStep}`
    if (arrivalKeyRef.current === arrivalKey) return
    if (distanceBetween(movement.position, objective) > 6.4) return

    arrivalKeyRef.current = arrivalKey
    setArrivalPulse((current) => current + 1)

    if (jobStep < route.length - 1) {
      setJobStep((current) => current + 1)
      return
    }

    actions.workJob(business.id)
    setRewardBurst({ id: Date.now(), value: economy.manualRevenue })
    setCooldownUntil(Date.now() + getManualCooldown(game, business.id) * 1000)
    setJobStep(0)
    window.setTimeout(() => setRewardBurst(null), 1500)
  }, [
    actions,
    business.id,
    cooldown,
    economy.manualRevenue,
    game,
    jobStep,
    movement.position,
    objective,
    panelOpen,
    route.length,
  ])

  useEffect(() => {
    arrivalKeyRef.current = ''
  }, [jobStep, cooldown > 0])

  const stageSize = useMemo(() => {
    if (!viewport.width || !viewport.height) {
      return { width: 0, height: 0, left: 0, top: 0 }
    }
    const viewportRatio = viewport.width / viewport.height
    const stageWidth = viewportRatio >= 1.5 ? viewport.width : viewport.height * 1.5
    const stageHeight = viewportRatio >= 1.5 ? viewport.width / 1.5 : viewport.height
    const overflowX = Math.max(0, stageWidth - viewport.width)
    const desiredLeft = viewport.width / 2 - movement.position.x / 100 * stageWidth
    return {
      width: stageWidth,
      height: stageHeight,
      left: Math.min(0, Math.max(-overflowX, desiredLeft)),
      top: Math.max(0, (viewport.height - stageHeight) / 2),
    }
  }, [movement.position.x, viewport])

  function handleWorldPointerDown(event) {
    if (panelOpen || event.button > 0) return
    if (event.target instanceof Element && event.target.closest('button, [role="button"]')) return
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    const target = {
      x: Math.min(93, Math.max(7, (event.clientX - rect.left) / rect.width * 100)),
      y: Math.min(89, Math.max(20, (event.clientY - rect.top) / rect.height * 100)),
    }
    movement.walkTo(target)
  }

  const worldTier = getWorldTier(business.id)
  const visibleCrew = Math.min(3, Math.max(0, serviceState.staff - 1))

  return (
    <section
      className={`a1-wrenchworks-world a1-wrenchworks-world--${worldTier}`}
      aria-label={`${business.name} interactive workshop`}
    >
      <TaskTracker
        business={business}
        objective={objective}
        step={jobStep}
        total={route.length}
        cooldown={cooldown}
        reward={economy.manualRevenue}
      />

      <div
        className="a1-wrenchworks-world__viewport"
        ref={viewportRef}
        onPointerDown={handleWorldPointerDown}
      >
        <div
          className="a1-wrenchworks-world__stage"
          ref={stageRef}
          style={{
            width: `${stageSize.width}px`,
            height: `${stageSize.height}px`,
            transform: `translate3d(${stageSize.left}px, ${stageSize.top}px, 0)`,
            backgroundImage: `url(${worldImages[worldTier]})`,
          }}
        >
          <div className="a1-wrenchworks-world__vignette" aria-hidden="true" />

          {WORLD_STATIONS.map((station) => {
            const isObjective = cooldown <= 0 && station.id === objective.id
            const isNearby = nearbyStation?.id === station.id
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
            className={[
              'a1-wrenchworks-player',
              movement.moving && 'a1-wrenchworks-player--moving',
              movement.facing === 'left' && 'a1-wrenchworks-player--left',
            ].filter(Boolean).join(' ')}
            style={{
              left: `${movement.position.x}%`,
              top: `${movement.position.y}%`,
              zIndex: Math.round(movement.position.y),
            }}
          >
            <span className="a1-wrenchworks-player__shadow" aria-hidden="true" />
            <img src={mechanicPlayer} alt="You, the Wrenchworks mechanic" draggable="false" />
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

      <div className="a1-wrenchworks-world__status">
        <span><Icon name="engineering" aria-hidden="true" /> {serviceState.staff} crew</span>
        <span><Icon name="analytics" aria-hidden="true" /> {formatRate(empireEconomy.incomeRate)}</span>
        <span><Icon name="star" aria-hidden="true" /> Level {serviceState.level}</span>
      </div>

      <VirtualJoystick onChange={movement.setJoystick} />

      <Paragraph className="a1-wrenchworks-world__hint" size="sm">
        Tap the floor or use WASD / arrows
      </Paragraph>

      {nearbyStation?.panel && !panelOpen && (
        <div className="a1-wrenchworks-world__action">
          <Button
            variant="primary"
            size="lg"
            icon={nearbyStation.icon}
            onClick={openNearbyPanel}
          >
            Open {nearbyStation.shortLabel}
          </Button>
          <small>or press E</small>
        </div>
      )}
    </section>
  )
}
