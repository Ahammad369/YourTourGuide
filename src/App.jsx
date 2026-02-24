import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCities, setSearchQuery } from './store/slices/citiesSlice'
import { fetchSpots, setSearchQuery as setSpotSearch, setFilterType, toggleSpotSelection, removeSpot, clearSelectedSpots } from './store/slices/spotsSlice'
import { setSource, setDestination, setStartDate, setEndDate, setPersons, setRoundTrip, setIncludeStay, setTransMode, setMileage, setFuelPrice, setTolls, setPubType, setPubPrice, setDistance, setBudget, setCurrentStep, resetTrip } from './store/slices/tripSlice'
import { sendMessage, addUserMessage, clearChat } from './store/slices/chatSlice'

// ─── UTILITY FUNCTIONS ───────────────────────────────────────────────────────
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1.25)
}

function getSeasonMult(d) {
  if (!d) return 1
  const m = new Date(d).getMonth() + 1
  if (m === 12 || m === 7) return 1.5
  if ([2, 3, 8, 9].includes(m)) return 0.8
  return 1.0
}

function formatINR(n) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

function useCountUp(target) {
  const [val, setVal] = useState(target)
  const prev = useRef(target)
  useEffect(() => {
    const diff = target - prev.current
    if (!diff) return
    const steps = 40
    const inc = diff / steps
    let s = 0
    const t = setInterval(() => {
      s++
      if (s >= steps) {
        setVal(target)
        prev.current = target
        clearInterval(t)
      } else {
        setVal(Math.round(prev.current + inc * s))
      }
    }, 15)
    return () => clearInterval(t)
  }, [target])
  return val
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const TIER_RATES = {
  1: { food: 400, stay: 2500 },
  2: { food: 280, stay: 1200 },
  3: { food: 180, stay: 700 },
}

const TRANSPORT_PRESETS = {
  bus: { label: 'State Bus', icon: '🚌', basePrice: 0.7 },
  train: { label: 'Train', icon: '🚂', basePrice: 0.5 },
  flight: { label: 'Flight', icon: '✈️', basePrice: 4.5 },
  cab: { label: 'Cab/Taxi', icon: '🚕', basePrice: 14 },
}

const SPOT_TYPE_ICONS = {
  'Heritage': '🏛️', 'Scenic': '🌄', 'Spiritual': '🙏', 'Culture': '🎭',
  'Nature': '🌿', 'Beach': '🏖️', 'Shopping': '🛍️', 'Adventure': '⛰️',
  'Food': '🍛', 'Science': '🔭',
}

// ─── CITY AUTOCOMPLETE COMPONENT ────────────────────────────────────────────
function CityAC({ label, value, onChange, cities, onSearchChange, loading }) {
  const [q, setQ] = useState(value?.name || '')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const TC = { 1: '#0B6E6E', 2: '#E8590C', 3: '#D97706' }
  const TL = { 1: 'Metro', 2: 'Urban', 3: 'Town' }
  const icon = c => {
    if (['temple', 'dham', 'puri', 'kashi', 'gaya', 'rameswaram', 'dwarka', 'badrinath', 'kedarnath'].some(k => c.name.toLowerCase().includes(k))) return '🙏'
    return c.tier === 1 ? '🏙️' : c.tier === 3 ? '🌿' : '🏘️'
  }

  const filteredCities = cities.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    (c.state && c.state.toLowerCase().includes(q.toLowerCase()))
  ).slice(0, 8)

  return (
    <div className="input-group ac-wrap" ref={ref}>
      <label className="input-label">{label}</label>
      <input
        className="inp"
        value={q}
        onChange={e => {
          setQ(e.target.value)
          setOpen(true)
          onSearchChange?.(e.target.value)
          if (!e.target.value) onChange(null)
        }}
        onFocus={() => setOpen(true)}
        placeholder={loading ? 'Loading cities...' : 'Search city, hill station, pilgrimage...'}
        autoComplete="off"
      />
      {loading && (
        <div style={{ position: 'absolute', right: 12, top: 38, fontSize: 12, color: 'var(--saffron)' }}>
          ⟳
        </div>
      )}
      {open && filteredCities.length > 0 && (
        <div className="ac-list">
          {filteredCities.map(c => (
            <div
              key={c.name + (c.state || '')}
              className="ac-item"
              onMouseDown={() => {
                setQ(c.name)
                onChange(c)
                setOpen(false)
              }}
            >
              <span>{icon(c)}</span>
              {c.name}
              <span className="ac-badge" style={{ color: TC[c.tier] }}>
                {c.state} · {TL[c.tier]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── SPOT CARD COMPONENT ─────────────────────────────────────────────────────
function SpotCard({ spot, selected, onToggle, onRemove }) {
  return (
    <div className={`spot-card${selected ? ' sel' : ''}`} onClick={onToggle}>
      <div className="s-icon">{SPOT_TYPE_ICONS[spot.type] || '📍'}</div>
      <div className="s-stars">{'★'.repeat(spot.rating)}{'☆'.repeat(5 - spot.rating)}</div>
      <div className="s-name">{spot.name}</div>
      <div className="s-meta">{spot.type} · ~{spot.visitTime}h · {spot.distance}km</div>
      {selected && (
        <button className="s-remove" onClick={e => { e.stopPropagation(); onRemove() }}>✕</button>
      )}
    </div>
  )
}

// ─── FOOTER COMPONENT ────────────────────────────────────────────────────────
function Footer({ budget, recalc }) {
  const total = useCountUp(budget.total)
  return (
    <div className="footer">
      <div className="footer-inner">
        <div className="f-item">
          <div className="f-label">⛽ Fuel</div>
          <div className="f-val">{formatINR(budget.fuel)}</div>
        </div>
        <div className="f-item">
          <div className="f-label">🍛 Food</div>
          <div className="f-val">{formatINR(budget.food)}</div>
        </div>
        <div className="f-item">
          <div className="f-label">🏨 Stay</div>
          <div className="f-val">{formatINR(budget.stay)}</div>
        </div>
        <div className="f-item">
          <div className="f-label">🛣️ Tolls</div>
          <div className="f-val">{formatINR(budget.tolls)}</div>
        </div>
        <div className={`f-item f-total${recalc ? ' recalc' : ''}`}>
          <div className="f-label">{recalc ? '⟳ Recalculating...' : '💰 Total Budget'}</div>
          <div className="f-val">{formatINR(total)}</div>
        </div>
      </div>
    </div>
  )
}

// ─── CHAT COMPONENT ──────────────────────────────────────────────────────────
function ChatWidget() {
  const dispatch = useDispatch()
  const { messages, loading } = useSelector(state => state.chat)
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const messagesEnd = useRef(null)

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || loading) return
    dispatch(addUserMessage(input))
    dispatch(sendMessage(input))
    setInput('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <button
        className={`chat-fab${isOpen ? ' hidden' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        💬
      </button>
      <div className={`chat-container${isOpen ? '' : ' collapsed'}`}>
        <div className="chat-header" onClick={() => setIsOpen(!isOpen)}>
          <div className="chat-title">
            <span>🤖</span> AI Assistant
          </div>
          <span className="chat-toggle">{isOpen ? '▼' : '▲'}</span>
        </div>
        {isOpen && (
          <>
            <div className="chat-messages">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`msg ${msg.role === 'user' ? 'msg-user' : msg.isError ? 'msg-error' : 'msg-ai'}`}
                >
                  {msg.content}
                  <div className="msg-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="chat-typing">
                  <span className="chat-dot"></span>
                  <span className="chat-dot"></span>
                  <span className="chat-dot"></span>
                </div>
              )}
              <div ref={messagesEnd} />
            </div>
            <div className="chat-input-row">
              <input
                type="text"
                className="chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about places..."
                disabled={loading}
              />
              <button className="chat-send" onClick={handleSend} disabled={loading || !input.trim()}>
                ➤
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

// ─── MAIN APP COMPONENT ───────────────────────────────────────────────────────
export default function App() {
  const dispatch = useDispatch()
  const { cities, loading: citiesLoading } = useSelector(state => state.cities)
  const { spots, selectedSpots, loading: spotsLoading, searchQuery, filterType } = useSelector(state => state.spots)
  const trip = useSelector(state => state.trip)
  const { source, destination, startDate, endDate, persons, roundTrip, includeStay, transMode, mileage, fuelPrice, tolls, pubType, pubPrice, distance, budget, currentStep } = trip

  const [recalc, setRecalc] = useState(false)

  const STEPS = ['Route', 'Dates', 'Transport', 'Itinerary', 'Summary']

  // Fetch cities on mount
  useEffect(() => {
    if (cities.length === 0) {
      dispatch(fetchCities())
    }
  }, [dispatch, cities.length])

  // Fetch spots when destination changes
  useEffect(() => {
    if (destination && destination.name) {
      dispatch(fetchSpots(destination))
    }
  }, [dispatch, destination])

  // Calculate distance
  useEffect(() => {
    if (!source || !destination) return
    const oneWay = haversine(source.lat, source.lng, destination.lat, destination.lng)
    const base = roundTrip ? oneWay * 2 : oneWay
    const extra = transMode === 'private' ? selectedSpots.reduce((s, x) => s + x.distance, 0) : 0
    dispatch(setDistance(Math.round(base + extra)))
  }, [source, destination, selectedSpots, transMode, roundTrip, dispatch])

  // Calculate budget
  useEffect(() => {
    setRecalc(true)
    const t = setTimeout(() => {
      const days = startDate && endDate ? Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000)) : 3
      const mult = getSeasonMult(startDate)
      const tier = destination?.tier || 2
      const rates = TIER_RATES[tier]
      let fuel = 0

      if (transMode === 'private') {
        fuel = Math.round((distance / mileage) * fuelPrice)
      } else {
        const preset = TRANSPORT_PRESETS[pubType]
        const price = pubPrice > 0 ? pubPrice : Math.round(distance * preset.basePrice)
        fuel = price * persons
      }

      const tollCost = transMode === 'private' ? (roundTrip ? tolls * 2 : tolls) : 0
      const food = Math.round(rates.food * persons * 3 * days * mult)
      const stay = includeStay ? Math.round(rates.stay * Math.ceil(persons / 2) * days * mult) : 0

      dispatch(setBudget({ fuel, food, stay, tolls: tollCost, total: fuel + food + stay + tollCost }))
      setRecalc(false)
    }, 500)

    return () => clearTimeout(t)
  }, [distance, mileage, fuelPrice, tolls, transMode, pubType, pubPrice, persons, startDate, endDate, destination, includeStay, roundTrip, dispatch])

  const resetAll = () => {
    dispatch(resetTrip())
    dispatch(clearChat())
  }

  const rmSpot = id => dispatch(removeSpot(id))

  const days = startDate && endDate ? Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000)) : 3
  const smult = getSeasonMult(startDate)
  const seasonLabel = smult === 1.5 ? '🔥 Peak Season (+50%)' : smult === 0.8 ? '❄️ Off-peak (-20%)' : '🌤️ Normal Season'
  const seasonClass = smult === 1.5 ? 's-peak' : smult === 0.8 ? 's-off' : 's-normal'

  const visSpots = spots.filter(s => {
    if (transMode === 'public' && s.withinCity === false) return false
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !s.type.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (filterType !== 'All' && s.type !== filterType) return false
    return true
  })

  const spotTypes = ['All', ...Array.from(new Set(spots.map(s => s.type)))]

  return (
    <>
      <div className="grid-bg" />
      <div className="app">
        {/* HEADER */}
        <div className="header">
          <div className="eyebrow">// Bharat Yatra AI · India Trip Planner</div>
          <div className="title">BHARAT<br />YATRA</div>
          <div className="subtitle">AI-Powered Trip Planner for Incredible India</div>
          {(source || destination || startDate) && (
            <div style={{ marginTop: 16 }}>
              <button className="btn btn-danger" onClick={resetAll}>↺ Reset All & Start Over</button>
            </div>
          )}
        </div>

        {/* STEPS */}
        <div className="steps">
          {STEPS.map((s, i) => (
            <div className="step-item" key={i}>
              <div
                className={`step-dot${currentStep === i + 1 ? ' active' : currentStep > i + 1 ? ' done' : ''}`}
                onClick={() => currentStep > i + 1 && dispatch(setCurrentStep(i + 1))}
              >
                {currentStep > i + 1 ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`step-line${currentStep > i + 1 ? ' done' : ''}`} />}
            </div>
          ))}
        </div>

        {/* STEP 1: ROUTE */}
        {currentStep === 1 && (
          <div className="fade-in">
            <div className="card">
              <div className="card-title"><span>🗺️</span> SOURCE & DESTINATION</div>
              <div className="api-notice">
                🤖 AI-powered city suggestions. Type any Indian city, hill station or pilgrimage.
              </div>
              <div className="input-row">
                <CityAC
                  label="📍 Source City"
                  value={source}
                  onChange={c => dispatch(setSource(c))}
                  cities={cities}
                  loading={citiesLoading}
                />
                <CityAC
                  label="🎯 Destination"
                  value={destination}
                  onChange={c => dispatch(setDestination(c))}
                  cities={cities}
                  loading={citiesLoading}
                />
              </div>
              {source && destination && (
                <div style={{ marginTop: 16 }}>
                  <div className="dist-badge">
                    {roundTrip ? '🔄 Round Trip' : '🛣️ One Way'}: <strong>{distance} km</strong>
                    {roundTrip && <span style={{ opacity: 0.6, fontSize: 10 }}> (×2)</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 6, fontFamily: "'Roboto Mono',monospace" }}>
                    Tier: <span style={{ color: destination.tier === 1 ? 'var(--teal-lt)' : destination.tier === 2 ? 'var(--saffron)' : 'var(--gold)' }}>
                      {[' ', 'Tier-1 Metro', 'Tier-2 Urban', 'Tier-3 Rural'][destination.tier]}
                    </span>
                  </div>
                  <div className="toggle-row" style={{ marginTop: 12 }}>
                    <div>
                      <div className="tgl-label">🔄 Round Trip</div>
                      <div className="tgl-sub">Include return journey in cost</div>
                    </div>
                    <label className="tgl-switch">
                      <input type="checkbox" checked={roundTrip} onChange={e => dispatch(setRoundTrip(e.target.checked))} />
                      <span className="tgl-slider" />
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className="nav-row">
              <div />
              <button
                className="btn btn-primary"
                onClick={() => dispatch(setCurrentStep(2))}
                disabled={!source || !destination}
              >
                Next: Dates →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DATES */}
        {currentStep === 2 && (
          <div className="fade-in">
            <div className="card">
              <div className="card-title"><span>📅</span> TRAVEL DATES & GROUP</div>
              <div className="input-row" style={{ marginBottom: 16 }}>
                <div className="input-group">
                  <label className="input-label">🗓️ Start Date</label>
                  <input type="date" className="inp" value={startDate} onChange={e => dispatch(setStartDate(e.target.value))} />
                </div>
                <div className="input-group">
                  <label className="input-label">🗓️ End Date</label>
                  <input type="date" className="inp" value={endDate} onChange={e => dispatch(setEndDate(e.target.value))} />
                </div>
              </div>
              <div className="input-group" style={{ marginBottom: 16 }}>
                <label className="input-label">👥 Number of Persons</label>
                <div className="range-wrap">
                  <input
                    type="range"
                    className="range"
                    min={1}
                    max={20}
                    value={persons}
                    onChange={e => dispatch(setPersons(+e.target.value))}
                  />
                  <div className="range-val">{persons}</div>
                </div>
              </div>
              {startDate && (
                <div>
                  <span className={`season-badge ${seasonClass}`}>{seasonLabel}</span>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 8, fontFamily: "'Roboto Mono',monospace" }}>
                    Trip: {days} day{days > 1 ? 's' : ''} · {Math.ceil(persons / 2)} room{Math.ceil(persons / 2) > 1 ? 's' : ''}
                  </div>
                </div>
              )}
              <div style={{ marginTop: 16 }}>
                <div className="toggle-row">
                  <div>
                    <div className="tgl-label">🏨 Include Stay / Accommodation</div>
                    <div className="tgl-sub">Turn off for day trips or own stay</div>
                  </div>
                  <label className="tgl-switch">
                    <input type="checkbox" checked={includeStay} onChange={e => dispatch(setIncludeStay(e.target.checked))} />
                    <span className="tgl-slider" />
                  </label>
                </div>
              </div>
            </div>
            <div className="nav-row">
              <button className="btn btn-secondary" onClick={() => dispatch(setCurrentStep(1))}>← Back</button>
              <button
                className="btn btn-primary"
                onClick={() => dispatch(setCurrentStep(3))}
                disabled={!startDate || !endDate}
              >
                Next: Transport →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: TRANSPORT */}
        {currentStep === 3 && (
          <div className="fade-in">
            <div className="card">
              <div className="card-title"><span>🚗</span> TRANSPORT MODE</div>
              <div className="tabs">
                <button
                  className={`tab${transMode === 'private' ? ' active' : ''}`}
                  onClick={() => dispatch(setTransMode('private'))}
                >
                  🚗 Private Vehicle
                </button>
                <button
                  className={`tab${transMode === 'public' ? ' active' : ''}`}
                  onClick={() => dispatch(setTransMode('public'))}
                >
                  🚌 Public Transport
                </button>
              </div>
              {transMode === 'private' && (
                <div>
                  <div className="input-group" style={{ marginBottom: 14 }}>
                    <label className="input-label">⛽ Mileage (KMPL)</label>
                    <div className="range-wrap">
                      <input
                        type="range"
                        className="range"
                        min={5}
                        max={35}
                        value={mileage}
                        onChange={e => dispatch(setMileage(+e.target.value))}
                      />
                      <div className="range-val">{mileage}</div>
                    </div>
                  </div>
                  <div className="input-row" style={{ marginBottom: 14 }}>
                    <div className="input-group">
                      <label className="input-label">💰 Fuel Price (₹/L)</label>
                      <input type="number" className="inp" value={fuelPrice} onChange={e => dispatch(setFuelPrice(+e.target.value))} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">🛣️ Toll Charges (₹)</label>
                      <input type="number" className="inp" value={tolls} onChange={e => dispatch(setTolls(+e.target.value))} />
                    </div>
                  </div>
                  <div style={{ padding: '10px 14px', background: 'var(--saffron-dim)', borderRadius: 10, fontSize: 13, fontFamily: "'Roboto Mono',monospace", color: 'var(--saffron)' }}>
                    Fuel: ({distance}km ÷ {mileage}KMPL) × ₹{fuelPrice} = <strong>{formatINR(Math.round(distance / mileage * fuelPrice))}</strong>
                    &nbsp;| Tolls: <strong>{formatINR(roundTrip ? tolls * 2 : tolls)}</strong>{roundTrip ? ' (×2 round trip)' : ''}
                  </div>
                </div>
              )}
              {transMode === 'public' && (
                <div>
                  <div className="pub-grid">
                    {Object.entries(TRANSPORT_PRESETS).map(([k, v]) => (
                      <div
                        key={k}
                        className={`t-card${pubType === k ? ' sel' : ''}`}
                        onClick={() => dispatch(setPubType(k))}
                      >
                        <span className="t-icon">{v.icon}</span>
                        <div className="t-name">{v.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <label className="input-label">💰 Ticket Price per Person (₹) — 0 = auto estimate</label>
                    <input
                      type="number"
                      className="inp"
                      value={pubPrice}
                      onChange={e => dispatch(setPubPrice(+e.target.value))}
                      placeholder={`Auto: ~₹${Math.round(distance * TRANSPORT_PRESETS[pubType].basePrice)}`}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="nav-row">
              <button className="btn btn-secondary" onClick={() => dispatch(setCurrentStep(2))}>← Back</button>
              <button className="btn btn-primary" onClick={() => dispatch(setCurrentStep(4))}>Next: Itinerary →</button>
            </div>
          </div>
        )}

        {/* STEP 4: ITINERARY */}
        {currentStep === 4 && (
          <div className="fade-in">
            <div className="card">
              <div className="card-title">
                <span>📍</span>
                {transMode === 'private'
                  ? `PLACES NEAR ${destination?.name?.toUpperCase()}`
                  : `PLACES IN ${destination?.name?.toUpperCase()}`}
                {spotsLoading && <span className="ai-badge">⟳ Loading AI data...</span>}
                {!spotsLoading && spots.length > 0 && <span className="ai-badge">✦ AI Powered</span>}
              </div>

              {spotsLoading && spots.length === 0 ? (
                <div className="spinner-wrap">
                  <div className="spinner" />
                  <div>
                    <div className="spinner-title">Fetching spots for {destination?.name}...</div>
                    <div className="spinner-sub">
                      🤖 AI is sourcing real places <div className="dots"><span /><span /><span /></div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      className="inp"
                      style={{ flex: 1, minWidth: 160 }}
                      placeholder="🔍 Search spots..."
                      value={searchQuery}
                      onChange={e => dispatch(setSpotSearch(e.target.value))}
                    />
                    <select
                      className="inp"
                      style={{ minWidth: 130 }}
                      value={filterType}
                      onChange={e => dispatch(setFilterType(e.target.value))}
                    >
                      {spotTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                    {selectedSpots.length > 0 && (
                      <button
                        className="btn btn-danger"
                        style={{ fontSize: 12, padding: '9px 14px' }}
                        onClick={() => dispatch(clearSelectedSpots())}
                      >
                        Clear All ({selectedSpots.length})
                      </button>
                    )}
                  </div>
                  <div className="spots-grid">
                    {visSpots.map(s => (
                      <SpotCard
                        key={s.id}
                        spot={s}
                        selected={!!selectedSpots.find(x => x.id === s.id)}
                        onToggle={() => dispatch(toggleSpotSelection(s))}
                        onRemove={() => rmSpot(s.id)}
                      />
                    ))}
                  </div>
                  {selectedSpots.length > 0 && (
                    <div style={{ marginTop: 24 }}>
                      <div style={{ fontFamily: "'Abril Fatface',cursive", fontSize: 17, marginBottom: 12, color: 'var(--text)' }}>
                        🗓️ Selected Itinerary ({selectedSpots.length} spots · ~{selectedSpots.reduce((a, s) => a + s.visitTime, 0)}h total)
                      </div>
                      <div className="itin-list">
                        {selectedSpots.map(s => (
                          <div key={s.id} className="itin-item">
                            <span className="drag-handle">⠿</span>
                            <span style={{ fontSize: 20 }}>{SPOT_TYPE_ICONS[s.type] || '📍'}</span>
                            <div className="itin-info">
                              <div className="itin-name">{s.name}</div>
                              <div className="itin-sub">{s.type} · {s.distance}km · ⏱ ~{s.visitTime}h</div>
                            </div>
                            <button className="itin-rm" onClick={() => rmSpot(s.id)}>Remove</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="nav-row">
              <button className="btn btn-secondary" onClick={() => dispatch(setCurrentStep(3))}>← Back</button>
              <button className="btn btn-primary" onClick={() => dispatch(setCurrentStep(5))}>Next: Summary →</button>
            </div>
          </div>
        )}

        {/* STEP 5: SUMMARY */}
        {currentStep === 5 && (
          <div className="fade-in">
            <div className="card">
              <div className="card-title"><span>💰</span> TRIP SUMMARY</div>
              <div className="results-grid">
                <div>
                  <div className="result-row"><span className="result-key">🗺️ Route</span><span className="result-val" style={{ fontSize: 13 }}>{source?.name} {roundTrip ? '⇄' : '→'} {destination?.name}</span></div>
                  <div className="result-row"><span className="result-key">🔄 Journey</span><span className="result-val">{roundTrip ? 'Round Trip' : 'One Way'}</span></div>
                  <div className="result-row"><span className="result-key">📐 Distance</span><span className="result-val">{distance} km</span></div>
                  <div className="result-row"><span className="result-key">📅 Duration</span><span className="result-val">{days} Day{days > 1 ? 's' : ''}</span></div>
                  <div className="result-row"><span className="result-key">👥 Persons</span><span className="result-val">{persons}</span></div>
                  <div className="result-row"><span className="result-key">🚗 Transport</span><span className="result-val" style={{ fontSize: 13 }}>{transMode === 'private' ? 'Private Vehicle' : TRANSPORT_PRESETS[pubType].label}</span></div>
                </div>
                <div>
                  <div className="result-row"><span className="result-key">⛽ Fuel / Tickets</span><span className="result-val">{formatINR(budget.fuel)}</span></div>
                  <div className="result-row"><span className="result-key">🍛 Food ({days}d)</span><span className="result-val">{formatINR(budget.food)}</span></div>
                  <div className="result-row">
                    <span className="result-key">🏨 Stay {includeStay ? `(${days}d × ${Math.ceil(persons / 2)} rooms)` : '(excluded)'}</span>
                    <span className="result-val" style={{ color: includeStay ? 'var(--saffron)' : 'var(--text-dim)' }}>{includeStay ? formatINR(budget.stay) : '—'}</span>
                  </div>
                  <div className="result-row"><span className="result-key">🛣️ Tolls</span><span className="result-val">{formatINR(budget.tolls)}</span></div>
                  <div className="result-row" style={{ borderTop: '2px solid var(--saffron-dim)', marginTop: 8, paddingTop: 12 }}>
                    <span className="result-key" style={{ fontWeight: 700, fontSize: 15 }}>💰 Total</span>
                    <span className="result-val" style={{ fontSize: 22 }}>{formatINR(budget.total)}</span>
                  </div>
                </div>
              </div>
              {selectedSpots.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontFamily: "'Abril Fatface',cursive", fontSize: 17, marginBottom: 10, color: 'var(--text)' }}>📍 Your Itinerary</div>
                  {selectedSpots.map((s, i) => (
                    <div key={s.id} className="result-row">
                      <span className="result-key">{i + 1}. {SPOT_TYPE_ICONS[s.type]} {s.name}</span>
                      <span className="result-val" style={{ color: 'var(--teal)', fontSize: 12 }}>{'★'.repeat(s.rating)} · ~{s.visitTime}h</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="nav-row">
              <button className="btn btn-secondary" onClick={() => dispatch(setCurrentStep(4))}>← Edit Itinerary</button>
              <button className="btn btn-primary" onClick={resetAll}>↺ Plan New Trip</button>
            </div>
          </div>
        )}
      </div>

      <Footer budget={budget} recalc={recalc} />
      <ChatWidget />
    </>
  )
}
