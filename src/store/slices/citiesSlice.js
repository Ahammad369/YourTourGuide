import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchCitiesFromAI } from '../../services/aiService'

const initialState = {
  cities: [],
  loading: false,
  error: null,
  searchQuery: '',
  lastFetched: null,
}

export const fetchCities = createAsyncThunk(
  'cities/fetchCities',
  async (_, { rejectWithValue }) => {
    try {
      const cities = await fetchCitiesFromAI()
      return cities
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    clearCities: (state) => {
      state.cities = []
      state.searchQuery = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false
        state.cities = action.payload
        state.lastFetched = new Date().toISOString()
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setSearchQuery, clearCities } = citiesSlice.actions
export default citiesSlice.reducer
