import assert from 'node:assert/strict'
import test from 'node:test'
import { sampleVisitAnalytics } from '../src/admin/sampleVisitAnalytics.js'
import { buildVisitAnalyticsSummary } from '../src/admin/visitAnalyticsSummary.js'

test('builds chart, metric and map data from visit sessions', () => {
  const summary = buildVisitAnalyticsSummary(sampleVisitAnalytics, {
    endDate: '2026-08-01T23:59:59Z',
  })

  assert.equal(summary.visits, 12)
  assert.equal(summary.uniqueIps, 12)
  assert.equal(summary.visitsByDay.length, 14)
  assert.equal(summary.visitsByDay.at(-1).visits, 1)
  assert.equal(summary.locations.length, 7)
  assert.equal(summary.locations.find((entry) => entry.name === 'New York, United States').value, 2)
  assert.equal(summary.devices.reduce((total, entry) => total + entry.value, 0), 12)
  assert.equal(summary.topPages[0].name, '/')
  assert.ok(summary.pageViews > summary.visits)
  assert.ok(summary.averageDurationSeconds > 0)
})

test('sample analytics stays local and uses documentation-only IP ranges', () => {
  const documentationIp = /^(192\.0\.2\.|198\.51\.100\.|203\.0\.113\.)/

  for (const visit of sampleVisitAnalytics) {
    assert.equal(visit.sample, true)
    assert.ok(visit.ip_addresses.every((ip) => documentationIp.test(ip)))
    assert.deepEqual(visit.sampleIpLookups.map((entry) => entry.ip), visit.ip_addresses)
    assert.equal(visit.visitor_context.netlify.deployContext, 'production')
  }
})
