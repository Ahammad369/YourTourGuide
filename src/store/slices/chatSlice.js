import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { sendMessageToAI } from '../../services/aiService'

const initialState = {
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Namaste! 🙏 I am your AI Travel Assistant for Bharat Yatra. I can help you plan your trip across India.\n\nYou can ask me about:\n• Popular cities and destinations in India\n• Tourist spots and attractions\n• Best time to visit places\n• Travel tips and recommendations\n\nHow can I help you plan your trip today?',
      timestamp: new Date().toISOString(),
    },
  ],
  loading: false,
  error: null,
}

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message, { rejectWithValue }) => {
    try {
      const response = await sendMessageToAI(message)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        id: Date.now().toString(),
        role: 'user',
        content: action.payload,
        timestamp: new Date().toISOString(),
      })
    },
    clearChat: (state) => {
      state.messages = initialState.messages
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false
        state.messages.push({
          id: Date.now().toString(),
          role: 'assistant',
          content: action.response,
          timestamp: new Date().toISOString(),
          data: action.data,
        })
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.messages.push({
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
          isError: true,
        })
      })
  },
})

export const { addUserMessage, clearChat } = chatSlice.actions
export default chatSlice.reducer
