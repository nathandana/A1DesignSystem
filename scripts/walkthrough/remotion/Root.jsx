import React from 'react'
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  OffthreadVideo,
  Sequence,
  getInputProps,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

const fps = 30

export function RemotionRoot() {
  const props = getInputProps()
  const input = props.input || props
  const composition = input.composition || {}
  const width = Number(composition.width || 1280)
  const height = Number(composition.height || 720)
  const durationInFrames = Math.max(1, Math.ceil((Number(composition.durationMs || 1000) / 1000) * fps))

  return (
    <Composition
      id="Walkthrough"
      component={WalkthroughVideo}
      durationInFrames={durationInFrames}
      fps={fps}
      width={width}
      height={height}
      defaultProps={{ input }}
    />
  )
}

function WalkthroughVideo({ input }) {
  const frame = useCurrentFrame()
  const { fps: videoFps } = useVideoConfig()
  const timeMs = (frame / videoFps) * 1000
  const timeline = input.timeline || []
  const activeStep = stepForTime(timeline, timeMs)
  const video = input.assets?.video
  const showVideo = input.renderMode === 'video' && video

  return (
    <AbsoluteFill style={styles.stage}>
      {showVideo ? (
        <OffthreadVideo src={staticFile(video)} style={styles.media} />
      ) : (
        <ScreenshotTimeline timeline={timeline} timeMs={timeMs} />
      )}
      {input.narration?.audio?.path && <Audio src={staticFile(input.narration.audio.path)} />}
      {timeline.map((step) => (
        <Sequence
          key={step.id}
          from={msToFrame(step.startMs, videoFps)}
          durationInFrames={Math.max(1, msToFrame(step.endMs - step.startMs, videoFps))}
        >
          {step.audio && <Audio src={staticFile(step.audio)} />}
          {(step.callouts || []).map((callout, index) => (
            <Callout key={`${step.id}-${index}`} callout={callout} index={index} />
          ))}
        </Sequence>
      ))}
      {input.showCaptions && activeStep && <CaptionCard step={activeStep} />}
    </AbsoluteFill>
  )
}

function ScreenshotTimeline({ timeline, timeMs }) {
  const { width, height } = useVideoConfig()
  const active = stepForTime(timeline, timeMs)
  const previous = timeline.filter((step) => timeMs >= step.startMs && step.id !== active?.id).at(-1)
  const fadeMs = 260
  const fadeProgress = active ? Math.min(1, Math.max(0, (timeMs - active.startMs) / fadeMs)) : 1
  const mediaRect = mediaBounds(width, height)
  if (!active?.screenshot) return <AbsoluteFill style={styles.blank} />
  return (
    <AbsoluteFill style={styles.screenshotFrame}>
      {previous?.screenshot && fadeProgress < 1 && (
        <Img src={staticFile(previous.screenshot)} style={{ ...styles.screenshot, ...styles.screenshotLayer, opacity: 1 - fadeProgress }} />
      )}
      <Img src={staticFile(active.screenshot)} style={{ ...styles.screenshot, ...styles.screenshotLayer, opacity: fadeProgress }} />
      {active.cursor && <Cursor cursor={active.cursor} mediaRect={mediaRect} />}
      {active.typedText && <TypedOverlay text={active.typedText} />}
    </AbsoluteFill>
  )
}

function stepForTime(timeline, timeMs) {
  return timeline.find((step) => timeMs >= step.startMs && timeMs <= step.endMs)
    || timeline.filter((step) => timeMs >= step.startMs).at(-1)
    || timeline[0]
}

function CaptionCard({ step }) {
  return (
    <div style={styles.caption}>
      <div style={styles.kicker}>{step.title}</div>
      <div style={styles.captionText}>{step.narration}</div>
    </div>
  )
}

function Callout({ callout, index }) {
  return (
    <div style={{ ...styles.callout, top: 96 + index * 76 }}>
      <div style={styles.calloutLabel}>{callout.label || 'Callout'}</div>
      {callout.description && <div style={styles.calloutDescription}>{callout.description}</div>}
    </div>
  )
}

function Cursor({ cursor, mediaRect }) {
  const left = mediaRect.left + cursor.x * mediaRect.scale
  const top = mediaRect.top + cursor.y * mediaRect.scale
  return (
    <div style={{ ...styles.cursor, left, top }} aria-hidden="true">
      <svg width="30" height="36" viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3 3L25.5 21.3H15.2L20.5 32.4L15.5 34.8L10.3 23.8L3 31V3Z"
          fill="white"
          stroke="#111827"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

function TypedOverlay({ text }) {
  return (
    <div style={styles.typedOverlay}>
      <span style={styles.typedLabel}>Typing</span>
      <span style={styles.typedValue}>{text}</span>
    </div>
  )
}

function msToFrame(ms, fpsValue) {
  return Math.max(0, Math.round((Number(ms) / 1000) * fpsValue))
}

function mediaBounds(width, height) {
  const padding = 28
  const mediaWidth = 1280
  const mediaHeight = 720
  const innerWidth = width - padding * 2
  const innerHeight = height - padding * 2
  const scale = Math.min(innerWidth / mediaWidth, innerHeight / mediaHeight)
  const renderedWidth = mediaWidth * scale
  const renderedHeight = mediaHeight * scale
  return {
    left: padding + (innerWidth - renderedWidth) / 2,
    top: padding + (innerHeight - renderedHeight) / 2,
    scale,
  }
}

const styles = {
  stage: {
    backgroundColor: '#06111f',
    color: '#f8fafc',
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  media: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  screenshotFrame: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
  },
  screenshot: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: 18,
    boxShadow: '0 30px 90px rgba(0, 0, 0, 0.42)',
  },
  screenshotLayer: {
    position: 'absolute',
    inset: 28,
    width: 'calc(100% - 56px)',
    height: 'calc(100% - 56px)',
  },
  blank: {
    backgroundColor: '#0f172a',
  },
  caption: {
    position: 'absolute',
    left: 40,
    right: 40,
    bottom: 34,
    padding: '18px 22px',
    borderRadius: 14,
    background: 'rgba(6, 17, 31, 0.9)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35)',
  },
  kicker: {
    marginBottom: 6,
    color: '#c4b5fd',
    fontSize: 22,
    fontWeight: 700,
  },
  captionText: {
    fontSize: 28,
    lineHeight: 1.25,
    fontWeight: 550,
  },
  callout: {
    position: 'absolute',
    right: 40,
    width: 320,
    padding: '14px 16px',
    borderRadius: 12,
    background: 'rgba(255, 255, 255, 0.94)',
    color: '#111827',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
  },
  calloutLabel: {
    fontSize: 22,
    fontWeight: 800,
  },
  calloutDescription: {
    marginTop: 4,
    fontSize: 18,
    lineHeight: 1.3,
    color: '#475569',
  },
  cursor: {
    position: 'absolute',
    width: 30,
    height: 36,
    filter: 'drop-shadow(0 3px 5px rgba(0, 0, 0, 0.45))',
  },
  typedOverlay: {
    position: 'absolute',
    left: '50%',
    bottom: 58,
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 18px',
    borderRadius: 14,
    background: 'rgba(15, 23, 42, 0.92)',
    color: '#f8fafc',
    boxShadow: '0 18px 50px rgba(0, 0, 0, 0.38)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  },
  typedLabel: {
    color: '#cbd5e1',
    fontSize: 20,
    fontWeight: 700,
  },
  typedValue: {
    minWidth: 96,
    padding: '6px 12px',
    borderRadius: 10,
    background: '#ffffff',
    color: '#111827',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    fontSize: 28,
    fontWeight: 800,
  },
}
