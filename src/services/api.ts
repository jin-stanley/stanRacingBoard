import type { ApiResponse } from '@/types/race'

const NEDS_API = 'https://api.neds.com.au/rest/v1/racing'
const API_BASE_URL = import.meta.env.PROD
  ? `https://corsproxy.io/?${encodeURIComponent(NEDS_API)}`
  : NEDS_API
const REQUEST_TIMEOUT = 10000

export const racingApi = {
  async getNextRaces(count: number = 10): Promise<ApiResponse> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    try {
      const response = await fetch(`${API_BASE_URL}/?method=nextraces&count=${count}`, {
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Failed to fetch races (${response.status})`)
      }

      const data: ApiResponse = await response.json()

      if (!data || !data.data || !data.data.race_summaries) {
        throw new Error('Invalid API response format')
      }

      return data
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please try again')
        }
        throw error
      }

      throw new Error('Network error - please check your connection')
    }
  }
}
