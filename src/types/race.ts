// API Response Types
export interface ApiResponse {
  status: number
  data: {
    next_to_go_ids: string[]
    race_summaries: Record<string, RaceSummary>
  }
  message: string
}

export interface RaceSummary {
  race_id: string
  race_name: string
  race_number: number
  meeting_id: string
  meeting_name: string
  category_id: string
  advertised_start: {
    seconds: number
  }
  race_form: RaceForm
  venue_id: string
  venue_name: string
  venue_state: string
  venue_country: string
}

export interface RaceForm {
  distance: number
  distance_type: {
    id: string
    name: string
    short_name: string
  }
  distance_type_id: string
  track_condition: {
    id: string
    name: string
    short_name: string
  }
  track_condition_id: string
  weather: {
    id: string
    name: string
    short_name: string
    icon_uri: string
  }
  weather_id: string
  race_comment?: string
  race_comment_alternative?: string
}

// Category IDs
export const CATEGORIES = {
  HORSE_RACING: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
  GREYHOUND_RACING: '9daef0d7-bf3c-4f50-921d-8e818c60fe61',
  HARNESS_RACING: '161d9be2-e909-4326-8c2c-35ed71fb460b'
} as const

export type CategoryId =
  | typeof CATEGORIES.HORSE_RACING
  | typeof CATEGORIES.GREYHOUND_RACING
  | typeof CATEGORIES.HARNESS_RACING

// Race Status
export type RaceStatus = 'upcoming' | 'started' | 'finished'

// Grouped Race Data
export interface VenueGroup {
  venue: string
  state: string
  races: RaceSummary[]
}

export interface CategoryGroup {
  name: string
  categoryId: CategoryId
  venues: VenueGroup[]
}

export type CategoryFilter = 'all' | CategoryId

export type CountryFilter = 'all' | string
