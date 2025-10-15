import { describe, it, expect, vi, beforeEach } from 'vitest'
import { racingApi } from '../api'

const mockFetch = vi.fn()
global.fetch = mockFetch as unknown as typeof fetch

describe('racingApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch races successfully', async () => {
    const mockResponse = {
      status: 200,
      data: {
        next_to_go_ids: ['1', '2'],
        race_summaries: {
          '1': { race_id: '1', race_name: 'Test Race' }
        }
      },
      message: 'success'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const result = await racingApi.getNextRaces(10)
    expect(result).toEqual(mockResponse)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10',
      expect.any(Object)
    )
  })

  it('should handle HTTP errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    await expect(racingApi.getNextRaces()).rejects.toThrow('Failed to fetch races (500)')
  })

  it('should handle invalid response format', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ invalid: 'data' })
    })

    await expect(racingApi.getNextRaces()).rejects.toThrow('Invalid API response format')
  })

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network failed'))

    await expect(racingApi.getNextRaces()).rejects.toThrow('Network failed')
  })
})
