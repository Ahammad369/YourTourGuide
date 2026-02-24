import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchSpotsFromAI } from '../../services/aiService'

const initialState = {
  spots: [],
  selectedSpots: [],
  loading: false,
  error: null,
  searchQuery: '',
  filterType: 'All',
  lastFetched: null,
}

export const fetchSpots = createAsyncThunk(
  'spots/fetchSpots',
  async (destination, { rejectWithValue }) => {
    try {
      const spots = await fetchSpotsFromAI(destination)
      return spots
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const spotsSlice = createSlice({
  name: 'spots',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload
    },
    toggleSpotSelection: (state, action) => {
      const spot = action.payload
      const index = state.selectedSpots.findIndex(s => s.id === spot.id)
      if (index >= 0) {
        state.selectedSpots.splice(index, 1)
      } else {
        state.selectedSpots.push(spot)
      }
    },
    removeSpot: (state, action) => {
      state.selectedSpots = state.selectedSpots.filter(s => s.id !== action.payload)
    },
    clearSelectedSpots: (state) => {
      state.selectedSpots = []
    },
    clearSpots: (state) => {
      state.spots = []
      state.selectedSpots = []
      state.searchQuery = ''
      state.filterType = 'All'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpots.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSpots.fulfilled, (state, action) => {
        state.loading = false
        state.spots = action.payload
        state.lastFetched = new Date().toISOString()
      })
      .addCase(fetchSpots.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  setSearchQuery,
  setFilterType,
  toggleSpotSelection,
  removeSpot,
  clearSelectedSpots,
  clearSpots,
} = spotsSlice.actions

export default spotsSlice.reducer
