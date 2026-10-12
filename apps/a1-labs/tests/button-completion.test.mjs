import test from 'node:test'
import assert from 'node:assert/strict'
import {
  PUBLISH_LABELS, PUBLISH_STATUS_TEXT, SEND_LABELS, SEND_STATUS_TEXT, nextStatus, parseDuration,
} from '../src/button-completion/states.js'
import { DEFAULT_PLANE_TIMING, cruiseProgress, flightArc, planeScene, planeTimeline } from '../src/button-completion/paper-plane.js'

// Keep in sync with COMPLETION_STATUSES in CompletionButton.jsx (JSX is not
// loadable by the plain Node test runner).
const STATUSES = ['idle', 'working', 'success', 'failed', 'retry']
const { lead, aim, expected, finish, beat, mark } = DEFAULT_PLANE_TIMING
const settle = finish + beat + mark
const release = lead + aim

test('work resolves to the selected outcome', () => {
  assert.equal(nextStatus('working', 'success'), 'success')
  assert.equal(nextStatus('working', 'error'), 'failed')
})

test('a failure names itself before becoming a retry action', () => {
  assert.equal(nextStatus('failed', 'error'), 'retry')
  assert.equal(PUBLISH_LABELS.failed, 'Not published')
  assert.equal(SEND_LABELS.failed, 'Couldn’t send the email.')
  assert.match(SEND_LABELS.retry, /Try again/)
  assert.equal(SEND_LABELS.success, 'Email sent to 1,240 subscribers.')
})

test('idle, success and retry are resting statuses', () => {
  for (const status of ['idle', 'success', 'retry']) assert.equal(nextStatus(status, 'success'), null)
})

test('every status has a label and status text in both versions', () => {
  for (const [labels, text] of [[PUBLISH_LABELS, PUBLISH_STATUS_TEXT], [SEND_LABELS, SEND_STATUS_TEXT]]) {
    for (const status of STATUSES) assert.ok(labels[status] && text[status], status)
  }
})

test('parses CSS durations to milliseconds', () => {
  assert.equal(parseDuration('750ms'), 750)
  assert.equal(parseDuration(' 0.5s '), 500)
  assert.equal(parseDuration('', 1500), 1500)
})

test('the icon enters, the plane is drawn back, then cruises until sending resolves', () => {
  assert.equal(planeTimeline(lead / 2, null).stage, 'enter')
  assert.equal(planeTimeline(lead + aim / 2, null).stage, 'aim')
  assert.equal(planeTimeline(release + 10000, null).stage, 'cruise')
})

test('the plane slows the longer sending takes, and never finishes early', () => {
  const early = cruiseProgress(500, expected) - cruiseProgress(0, expected)
  const late = cruiseProgress(4500, expected) - cruiseProgress(4000, expected)
  assert.ok(late < early / 10, 'later half-seconds cover far less of the arc')
  assert.ok(cruiseProgress(60000, expected) < 0.86, 'cruising stops short of the end')
  // At the same moment, a slow send has not finished while a fast one has.
  const at = release + 2500
  assert.notEqual(planeTimeline(at, 1000).stage, 'cruise')
  assert.equal(planeTimeline(at, 6000).stage, 'cruise')
})

test('after launch the slingshot recoils out through the left edge', () => {
  const aiming = planeScene(planeTimeline(release - 1, null), 400, 120, null)
  assert.ok(aiming.sling.alpha > 0)
  assert.ok(Math.min(...aiming.sling.tips.map(([x]) => x)) > 0, 'in the button while aiming')
  const gone = planeScene(planeTimeline(release + 1000, null), 400, 120, null)
  assert.ok(Math.max(...gone.sling.tips.map(([x]) => x), gone.sling.junction[0], gone.sling.base[0]) < 0, 'out past the left edge')
  assert.equal(gone.sling.alpha, 0)
})

test('the trail is a short window that erases behind the plane', () => {
  const early = planeScene(planeTimeline(release + 100, null), 400, 120, null)
  const late = planeScene(planeTimeline(release + 4000, null), 400, 120, null)
  const [line] = late.trail.lines
  assert.ok(line.length > 2)
  assert.ok(late.points.every(([x]) => x > line[0][0]), 'trail is behind the plane')
  assert.ok(line[0][0] > early.trail.lines[0][0][0] + 40, 'the start of the arc has been erased')
})

test('once resolved, the plane finishes the rest of the arc', () => {
  const resolvedAt = release + 1500
  const resolving = planeTimeline(resolvedAt + 100, resolvedAt)
  assert.equal(resolving.stage, 'finish')
  assert.equal(planeTimeline(resolvedAt + settle, resolvedAt).stage, 'done')
})

test('there is a beat between the flight and the result mark', () => {
  const resolvedAt = release + 1500
  // A success flies the remaining arc at the full-arc pace.
  const flight = Math.max(finish * 0.3, finish * (1 - cruiseProgress(1500, expected)))
  const flown = planeTimeline(resolvedAt + flight + beat / 2, resolvedAt)
  assert.equal(flown.stage, 'beat')
  assert.equal(planeScene(flown, 400, 120, 'success').mark, null, 'no mark during the beat')
  const marking = planeTimeline(resolvedAt + flight + beat + mark / 2, resolvedAt)
  assert.equal(marking.stage, 'mark')
  assert.ok(planeScene(marking, 400, 120, 'success').mark.progress > 0)
})

test('the arc stays within the stage height and leaves through the right edge', () => {
  const arc = flightArc(400, 120, [60, 72])
  for (let u = 0; u <= 1; u += 0.05) {
    const [, y] = arc.at(u)
    assert.ok(y >= 0 && y <= 120, `u=${u.toFixed(2)} at y=${y}`)
  }
  assert.ok(arc.at(1)[0] > 400)
})

test('success flies out; failure crash-lands with a burst; a centred mark replaces the slingshot', () => {
  const resolvedAt = release + 1000
  const done = planeTimeline(resolvedAt + settle, resolvedAt)
  const flown = planeScene(done, 400, 120, 'success')
  assert.ok(Math.min(...flown.points.map(([x]) => x)) > 400, 'flew out through the right edge')
  assert.equal(flown.explosion, null)
  assert.equal(flown.trail.lines.length, 0, 'the trail followed the plane out')
  assert.equal(flown.trail.streaks, undefined)
  assert.equal(flown.mark.kind, 'check')
  assert.equal(flown.mark.progress, 1)
  assert.equal(flown.sling.alpha, 0, 'the slingshot is gone')
  const xs = flown.mark.strokes.flat().map(([x]) => x)
  assert.ok(Math.abs((Math.min(...xs) + Math.max(...xs)) / 2 - 200) < 20, 'checkmark centred')

  const crashing = planeScene(planeTimeline(resolvedAt + finish * 0.75, resolvedAt, undefined, 'failed'), 400, 120, 'failed')
  assert.ok(crashing.explosion && crashing.explosion.progress > 0 && crashing.explosion.progress < 1, 'burst in progress')
  const crashY = Math.max(...crashing.points.map(([, y]) => y))
  assert.ok(crashY > 105 && crashY <= 121, 'crashed on the floor of the artwork area, above the label row')
  const crashed = planeScene(planeTimeline(resolvedAt + settle, resolvedAt, undefined, 'failed'), 400, 120, 'failed')
  assert.equal(crashed.explosion.progress, 1, 'the burst has faded')
  assert.equal(crashed.alpha, 0, 'the plane vanished in the crash')
  assert.equal(crashed.mark.kind, 'cross')
  assert.equal(crashed.trail.lines.length, 0, 'the trail animates away after the crash')
})
