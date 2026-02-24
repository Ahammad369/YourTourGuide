import { configureStore } from '@reduxjs/toolkit'
import citiesReducer from './slices/citiesSlice'
import spotsReducer from './slices/spotsSlice'
import tripReducer from './slices/tripSlice'
import chatReducer from './slices/chatSlice'

export const store = configureStore({
  reducer: {
    cities: citiesReducer,
    spots: spotsReducer,
    trip: tripReducer,
    chat: chatReducer,
  },
})
