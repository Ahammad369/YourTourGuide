import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  source: null,
  destination: null,
  startDate: '',
  endDate: '',
  persons: 2,
  roundTrip: false,
  includeStay: true,
  transMode: 'private',
  mileage: 15,
  fuelPrice: 100,
  tolls: 500,
  pubType: 'bus',
  pubPrice: 0,
  distance: 0,
  budget: {
    fuel: 0,
    food: 0,
    stay: 0,
    tolls: 0,
    total: 0,
  },
  currentStep: 1,
}

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setSource: (state, action) => {
      state.source = action.payload
    },
    setDestination: (state, action) => {
      state.destination = action.payload
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload
    },
    setPersons: (state, action) => {
      state.persons = action.payload
    },
    setRoundTrip: (state, action) => {
      state.roundTrip = action.payload
    },
    setIncludeStay: (state, action) => {
      state.includeStay = action.payload
    },
    setTransMode: (state, action) => {
      state.transMode = action.payload
    },
    setMileage: (state, action) => {
      state.mileage = action.payload
    },
    setFuelPrice: (state, action) => {
      state.fuelPrice = action.payload
    },
    setTolls: (state, action) => {
      state.tolls = action.payload
    },
    setPubType: (state, action) => {
      state.pubType = action.payload
    },
    setPubPrice: (state, action) => {
      state.pubPrice = action.payload
    },
    setDistance: (state, action) => {
      state.distance = action.payload
    },
    setBudget: (state, action) => {
      state.budget = action.payload
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload
    },
    resetTrip: () => initialState,
  },
})

export const {
  setSource,
  setDestination,
  setStartDate,
  setEndDate,
  setPersons,
  setRoundTrip,
  setIncludeStay,
  setTransMode,
  setMileage,
  setFuelPrice,
  setTolls,
  setPubType,
  setPubPrice,
  setDistance,
  setBudget,
  setCurrentStep,
  resetTrip,
} = tripSlice.actions

export default tripSlice.reducer
