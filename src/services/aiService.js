// AI Service for fetching cities, spots, and handling chat
// Uses free AI providers for dynamic data

const AI_CONFIG = {
  provider: 'ollama', // Options: 'ollama', 'deepseek', 'lmstudio'
  baseUrl: 'http://localhost:11434',
  model: 'llama3.2',
  timeout: 30000,
}

// Fallback data in case AI is unavailable
const FALLBACK_CITIES = [
  { name: 'Mumbai', state: 'Maharashtra', tier: 1, lat: 19.076, lng: 72.877 },
  { name: 'Delhi', state: 'Delhi', tier: 1, lat: 28.704, lng: 77.102 },
  { name: 'Bengaluru', state: 'Karnataka', tier: 1, lat: 12.971, lng: 77.594 },
  { name: 'Chennai', state: 'Tamil Nadu', tier: 1, lat: 13.083, lng: 80.27 },
  { name: 'Kolkata', state: 'West Bengal', tier: 1, lat: 22.572, lng: 88.363 },
  { name: 'Hyderabad', state: 'Telangana', tier: 1, lat: 17.385, lng: 78.487 },
  { name: 'Pune', state: 'Maharashtra', tier: 1, lat: 18.52, lng: 73.856 },
  { name: 'Jaipur', state: 'Rajasthan', tier: 1, lat: 26.912, lng: 75.787 },
  { name: 'Goa', state: 'Goa', tier: 1, lat: 15.299, lng: 74.124 },
  { name: 'Kochi', state: 'Kerala', tier: 1, lat: 9.931, lng: 76.267 },
  { name: 'Varanasi', state: 'Uttar Pradesh', tier: 2, lat: 25.317, lng: 83.013 },
  { name: 'Agra', state: 'Uttar Pradesh', tier: 2, lat: 27.176, lng: 78.008 },
  { name: 'Shimla', state: 'Himachal Pradesh', tier: 2, lat: 31.104, lng: 77.167 },
  { name: 'Manali', state: 'Himachal Pradesh', tier: 2, lat: 32.239, lng: 77.189 },
  { name: 'Leh', state: 'Ladakh', tier: 2, lat: 34.166, lng: 77.584 },
  { name: 'Srinagar', state: 'Jammu & Kashmir', tier: 2, lat: 34.083, lng: 74.797 },
  { name: 'Udaipur', state: 'Rajasthan', tier: 2, lat: 24.585, lng: 73.712 },
  { name: 'Jodhpur', state: 'Rajasthan', tier: 2, lat: 26.292, lng: 73.017 },
  { name: 'Mysuru', state: 'Karnataka', tier: 2, lat: 12.296, lng: 76.639 },
  { name: 'Amritsar', state: 'Punjab', tier: 2, lat: 31.634, lng: 74.872 },
]

const FALLBACK_SPOTS = [
  { id: 'd1', name: 'City Heritage Fort / Palace', rating: 4, type: 'Heritage', distance: 8, visitTime: 2, withinCity: true },
  { id: 'd2', name: 'Main Temple / Shrine', rating: 5, type: 'Spiritual', distance: 5, visitTime: 2, withinCity: true },
  { id: 'd3', name: 'Local Bazaar / Market', rating: 4, type: 'Shopping', distance: 3, visitTime: 2, withinCity: true },
  { id: 'd4', name: 'Botanical Garden / Park', rating: 3, type: 'Nature', distance: 4, visitTime: 2, withinCity: true },
  { id: 'd5', name: 'Scenic Viewpoint', rating: 4, type: 'Scenic', distance: 10, visitTime: 2, withinCity: true },
  { id: 'd6', name: 'Local Food Street', rating: 4, type: 'Food', distance: 2, visitTime: 2, withinCity: true },
  { id: 'd7', name: 'Museum / Cultural Centre', rating: 4, type: 'Culture', distance: 5, visitTime: 2, withinCity: true },
]

// Check if AI service is available
async function checkAIAvailability() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch(`${AI_CONFIG.baseUrl}/api/tags`, {
      signal: controller.signal,
    })
    clearTimeout(timeout)
    return response.ok
  } catch {
    return false
  }
}

// Make request to AI with timeout
async function makeAIRequest(prompt, systemPrompt) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), AI_CONFIG.timeout)

  try {
    const response = await fetch(`${AI_CONFIG.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        prompt: prompt,
        system: systemPrompt,
        stream: false,
        format: 'json',
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error(`AI request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.response
  } catch (error) {
    clearTimeout(timeout)
    throw error
  }
}

// Parse AI JSON response safely
function parseJSONResponse(response) {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/m)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return JSON.parse(response)
  } catch {
    return null
  }
}

// Fetch cities from AI
export async function fetchCitiesFromAI() {
  const isAvailable = await checkAIAvailability()
  
  if (!isAvailable) {
    console.log('AI not available, using fallback cities')
    return FALLBACK_CITIES
  }

  const systemPrompt = `You are a knowledgeable travel expert for India. Respond ONLY with valid JSON array.`
  
  const prompt = `List 30 most popular tourist cities in India with the most accurate information.
Return ONLY a valid JSON array with this exact schema:
[{"name":"CityName","state":"StateName","tier":1,"lat":latitude,"lng":longitude}]
tier: 1 for major metros, 2 for popular cities, 3 for hill stations/small towns
lat/lng: approximate coordinates
No markdown, no explanations, just the JSON array.`

  try {
    const response = await makeAIRequest(prompt, systemPrompt)
    const cities = parseJSONResponse(response)
    
    if (Array.isArray(cities) && cities.length > 0) {
      return cities
    }
    
    return FALLBACK_CITIES
  } catch (error) {
    console.error('Error fetching cities from AI:', error)
    return FALLBACK_CITIES
  }
}

// Fetch tourist spots from AI
export async function fetchSpotsFromAI(destination) {
  if (!destination || !destination.name) {
    return FALLBACK_SPOTS
  }

  const isAvailable = await checkAIAvailability()
  
  if (!isAvailable) {
    console.log('AI not available, using fallback spots')
    return FALLBACK_SPOTS
  }

  const systemPrompt = `You are a knowledgeable travel expert for India. Respond ONLY with valid JSON array.`
  
  const prompt = `List the 14 best tourist attractions in ${destination.name}, ${destination.state || 'India'}.
Return ONLY a valid JSON array with this exact schema:
[{"id":"spot_N","name":"SpotName","rating":1-5,"type":"Heritage|Scenic|Spiritual|Culture|Nature|Beach|Shopping|Adventure|Food|Science","distance":<km from city centre>,"visitTime":<hours>,"withinCity":<true if distance<=50>}]
No markdown, no explanations, just the JSON array.`

  try {
    const response = await makeAIRequest(prompt, systemPrompt)
    const spots = parseJSONResponse(response)
    
    if (Array.isArray(spots) && spots.length > 0) {
      return spots
    }
    
    return FALLBACK_SPOTS
  } catch (error) {
    console.error('Error fetching spots from AI:', error)
    return FALLBACK_SPOTS
  }
}

// Send chat message to AI
export async function sendMessageToAI(userMessage) {
  const isAvailable = await checkAIAvailability()
  
  if (!isAvailable) {
    return {
      response: 'AI service is currently unavailable. Please make sure Ollama is running locally, or you can continue using the app with pre-loaded data.',
      data: null,
    }
  }

  const systemPrompt = `You are a friendly and knowledgeable AI travel assistant for Bharat Yatra - an India trip planner.
Your role is to help users with:
1. Suggesting popular cities and destinations in India
2. Recommending tourist spots and attractions
3. Providing travel tips and information
4. Helping plan itineraries
5. Answering questions about Indian destinations

Be concise, friendly, and informative. Use emojis appropriately. If user asks about specific destinations, provide helpful details.`

  try {
    const response = await makeAIRequest(userMessage, systemPrompt)
    return {
      response: response,
      data: null,
    }
  } catch (error) {
    console.error('Error sending message to AI:', error)
    throw error
  }
}

// Get location details from AI
export async function getLocationDetails(locationName) {
  const isAvailable = await checkAIAvailability()
  
  if (!isAvailable) {
    return null
  }

  const systemPrompt = `You are a travel expert for India. Respond ONLY with valid JSON.`
  
  const prompt = `Provide detailed information about ${locationName} in India.
Return ONLY a valid JSON object with this schema:
{"name":"string","state":"string","description":"string","bestTimeToVisit":"string","famousFor":["string"],"tier":1-3,"lat":number,"lng":number}
No markdown, no explanations.`

  try {
    const response = await makeAIRequest(prompt, systemPrompt)
    const data = parseJSONResponse(response)
    return data
  } catch (error) {
    console.error('Error getting location details:', error)
    return null
  }
}

export { checkAIAvailability, AI_CONFIG }
