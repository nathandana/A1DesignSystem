import { useEffect, useMemo, useState } from 'react'
import {
  Banner,
  BarChart,
  Button,
  Card,
  DataTable,
  Divider,
  Grid,
  Heading,
  LineChart,
  MessageBadge,
  MessageEmptyState,
  Paragraph,
  Section,
  SelectField,
  Stack,
  Stat,
  TopHeader,
} from '@gtivr4/a1-design-system-react'
import { fetchVehicleOverview, getConnectUrl, getLogoutUrl, normalizeVehicle } from './teslaApi.js'

function formatValue(value, suffix = '') {
  if (value === null || value === undefined || value === '') return 'Unknown'
  return `${value}${suffix}`
}

function statusForState(state) {
  if (state === 'online') return 'success'
  if (state === 'asleep' || state === 'offline') return 'warn'
  return 'neutral'
}

function chargingStatusTone(state) {
  if (state === 'Charging') return 'success'
  if (state === 'Stopped' || state === 'Disconnected') return 'neutral'
  if (state === 'Complete') return 'info'
  return 'warn'
}

function percentDescription(vehicle) {
  if (vehicle.chargeLimit == null) return 'No charge limit reported'
  return `Limit set to ${vehicle.chargeLimit}%`
}

function chargingRows(history) {
  return history.map((item) => ({
    ...item,
    date: item.date ? new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Unknown',
    kwhLabel: item.kwh == null ? 'Unknown' : `${item.kwh.toFixed(1)} kWh`,
    costLabel: item.cost == null ? 'Unknown' : new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(item.cost),
    rangeLabel: item.rangeAdded == null ? 'Unknown' : `${Math.round(item.rangeAdded)} mi`,
  }))
}

export function App() {
  const [overview, setOverview] = useState(null)
  const [selectedVin, setSelectedVin] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadOverview() {
    setLoading(true)
    setError('')
    try {
      const nextOverview = await fetchVehicleOverview()
      setOverview(nextOverview)
      setSelectedVin((currentVin) => currentVin || nextOverview.selectedVehicle?.vin || '')
    } catch (nextError) {
      setError(nextError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOverview()
  }, [])

  const selectedVehicle = useMemo(() => {
    if (!overview) return null
    return overview.vehicles.find((vehicle) => vehicle.vin === selectedVin) || overview.selectedVehicle
  }, [overview, selectedVin])

  const vehicle = useMemo(
    () => normalizeVehicle(overview?.vehicleData, selectedVehicle),
    [overview?.vehicleData, selectedVehicle],
  )

  const rangeTrend = overview?.rangeTrend || []
  const chargeHistory = chargingRows(overview?.chargingHistory || [])
  const isDemo = overview?.mode !== 'live'

  return (
    <div className="tesla-a1-app a1-theme-light">
      <TopHeader
        logo={<span>Tesla A1</span>}
        navItems={[
          { id: 'overview', label: 'Overview', href: '#overview', active: true },
          { id: 'charging', label: 'Charging', href: '#charging' },
          { id: 'health', label: 'Health', href: '#health' },
        ]}
        actions={[
          {
            icon: 'refresh',
            label: 'Refresh',
            onClick: loadOverview,
          },
        ]}
        loginButton={overview?.config?.connected ? { label: 'Disconnect', onClick: () => { window.location.href = getLogoutUrl() } } : { label: 'Connect Tesla', onClick: () => { window.location.href = getConnectUrl() } }}
      />

      <main>
        <Section surface="page" padding={{ xs: 'md', lg: 'lg' }} contentWidth="2xl" gap="lg" id="overview">
          <Stack gap="lg">
            <Stack direction={{ xs: 'column', lg: 'row' }} gap="md" align="start" justify="between">
              <Stack gap="xs">
                <Paragraph size="sm" color="muted">
                  Private vehicle analytics for tesla.a1design.app
                </Paragraph>
                <Heading as="h1" size="xl">
                  {vehicle.displayName}
                </Heading>
                <Stack direction="row" gap="sm" wrap align="center">
                  <MessageBadge status={statusForState(vehicle.state)}>{vehicle.state}</MessageBadge>
                  <MessageBadge status={chargingStatusTone(vehicle.chargingState)} subtle>
                    {vehicle.chargingState}
                  </MessageBadge>
                  {isDemo && <MessageBadge status="info" subtle>Demo data</MessageBadge>}
                </Stack>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} gap="sm" align="end">
                <SelectField
                  label="Vehicle"
                  value={selectedVin}
                  onChange={(event) => setSelectedVin(event.target.value)}
                  disabled={!overview?.vehicles?.length}
                  size="compact"
                >
                  {(overview?.vehicles || []).map((item) => (
                    <option key={item.vin} value={item.vin}>
                      {item.display_name || item.vin}
                    </option>
                  ))}
                </SelectField>
                <Button variant="secondary" icon="refresh" onClick={loadOverview} loading={loading}>
                  Refresh data
                </Button>
              </Stack>
            </Stack>

            {error && (
              <Banner status="error" title="Tesla data could not be loaded">
                {error}
              </Banner>
            )}

            {isDemo && (
              <Banner status="info" title="Demo mode is active">
                Add Tesla Fleet API credentials to the proxy environment to connect the app to your car.
              </Banner>
            )}

            <Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="md">
              <Card>
                <Stat
                  title="Battery"
                  value={vehicle.batteryLevel ?? 0}
                  suffix="%"
                  format="number"
                  description={percentDescription(vehicle)}
                  icon="battery_charging_full"
                  size="lg"
                />
              </Card>
              <Card>
                <Stat
                  title="Estimated range"
                  value={vehicle.range ?? 0}
                  suffix=" mi"
                  format="number"
                  description="Fleet API estimate"
                  icon="route"
                  size="lg"
                />
              </Card>
              <Card>
                <Stat
                  title="Charge power"
                  value={vehicle.chargerPower ?? 0}
                  suffix=" kW"
                  format="number"
                  description={vehicle.chargeRate == null ? 'No active rate' : `${vehicle.chargeRate} mi per hour`}
                  icon="bolt"
                  size="lg"
                />
              </Card>
              <Card>
                <Stat
                  title="Odometer"
                  value={vehicle.odometer ?? 0}
                  suffix=" mi"
                  format="number"
                  description={`Firmware ${vehicle.firmware}`}
                  icon="speed"
                  size="lg"
                />
              </Card>
            </Grid>

            <Grid columns={{ xs: 1, lg: 3 }} gap="md">
              <Card className="tesla-a1-span-2">
                <Stack gap="md">
                  <Stack gap="xs">
                    <Heading as="h2" size="md">Range trend</Heading>
                    <Paragraph color="muted">
                      Current range and state of charge. Fleet Telemetry can expand this into a true history stream.
                    </Paragraph>
                  </Stack>
                  {rangeTrend.length ? (
                    <LineChart
                      data={rangeTrend}
                      xKey="date"
                      series={[
                        { key: 'soc', label: 'State of charge', tone: 'success' },
                        { key: 'range', label: 'Range', tone: 'info' },
                      ]}
                      height="sm"
                    />
                  ) : (
                    <MessageEmptyState
                      icon="query_stats"
                      title="No range history yet"
                      description="Connect Fleet Telemetry or refresh live vehicle data to start charting."
                    />
                  )}
                </Stack>
              </Card>

              <Card id="health">
                <Stack gap="md">
                  <Stack gap="xs">
                    <Heading as="h2" size="md">Status details</Heading>
                    <Paragraph color="muted">Live state reported by the vehicle data endpoint.</Paragraph>
                  </Stack>
                  <Divider />
                  <Stack gap="sm">
                    <Detail label="Lock status" value={vehicle.locked === true ? 'Locked' : vehicle.locked === false ? 'Unlocked' : 'Unknown'} />
                    <Detail label="Sentry mode" value={vehicle.sentryMode ? 'On' : 'Off'} />
                    <Detail label="Climate" value={vehicle.climateOn ? 'On' : 'Off'} />
                    <Detail label="Inside temp" value={formatValue(vehicle.insideTemp, ' deg F')} />
                    <Detail label="Outside temp" value={formatValue(vehicle.outsideTemp, ' deg F')} />
                    <Detail label="Cable" value={vehicle.cable} />
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Stack>
        </Section>

        <Section surface="panel" padding={{ xs: 'md', lg: 'lg' }} contentWidth="2xl" gap="lg" id="charging">
          <Grid columns={{ xs: 1, lg: 3 }} gap="md">
            <Card className="tesla-a1-span-2">
              <Stack gap="md">
                <Stack gap="xs">
                  <Heading as="h2" size="md">Charging sessions</Heading>
                  <Paragraph color="muted">
                    Session history from the charging history endpoint when available.
                  </Paragraph>
                </Stack>
                <DataTable
                  columns={[
                    { key: 'date', label: 'Date', type: 'date', sortable: true },
                    { key: 'site', label: 'Site', searchable: true },
                    { key: 'kwhLabel', label: 'Energy' },
                    { key: 'costLabel', label: 'Cost' },
                    { key: 'rangeLabel', label: 'Range added' },
                  ]}
                  rows={chargeHistory}
                  getRowId={(row) => row.id}
                  size="compact"
                />
              </Stack>
            </Card>

            <Card>
              <Stack gap="md">
                <Stack gap="xs">
                  <Heading as="h2" size="md">Energy mix</Heading>
                  <Paragraph color="muted">Recent kWh by session.</Paragraph>
                </Stack>
                {chargeHistory.length ? (
                  <BarChart
                    data={chargeHistory}
                    xKey="date"
                    series={[{ key: 'kwh', label: 'kWh', tone: 'success' }]}
                    height="sm"
                  />
                ) : (
                  <MessageEmptyState
                    icon="bolt"
                    title="No sessions found"
                    description="Charging history may require the vehicle charging scope."
                  />
                )}
              </Stack>
            </Card>
          </Grid>
        </Section>
      </main>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <Stack direction="row" gap="sm" justify="between" align="baseline" className="tesla-a1-detail">
      <Paragraph size="sm" color="muted">{label}</Paragraph>
      <Paragraph size="sm">{value}</Paragraph>
    </Stack>
  )
}
