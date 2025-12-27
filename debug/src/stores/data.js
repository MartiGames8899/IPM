/**
 * Pinia Data Store
 * Central state management for cities, listings, and filters
 */
import { defineStore } from "pinia"

const API_URL = "http://localhost:3001"

/**
 * Normalizes room type strings to consistent property type values
 */
function normalizePropertyType(type) {
  if (!type) return "unknown"

  const lower = type.toLowerCase()
  if (lower.includes("entire")) return "entire_home"
  if (lower.includes("private")) return "private_room"
  if (lower.includes("shared")) return "shared_room"
  if (lower.includes("hotel")) return "hotel_room"

  return "unknown"
}

export const useDataStore = defineStore("data", {
  // ============================================
  // STATE
  // ============================================
  state: () => ({
    // Listings data
    allListingsRaw: [],
    totalListingsGlobal: 0,

    // Cities data
    citiesData: [],
    currentGeoJson: null,

    // Loading state
    loading: false,
    error: null,

    // View state
    currentViewMode: "world",
    selectedCountry: null,
    selectedCity: null,

    // Filter state
    filters: {
      district: null,
      propertyTypes: [],
      priceMin: null,
      priceMax: null,
      availabilityMin: null,
      availabilityMax: null,
    },

    // Featured cities for homepage
    trendingCities: [],
  }),

  // ============================================
  // GETTERS
  // ============================================
  getters: {

    totalGlobalListings: (state) => {
      return state.citiesData.reduce((acc, city) => acc + (city.listingCount || 0), 0)
    },
    /**
     * Returns listings filtered by current filter criteria
     */
    filteredListings: (state) => {
      let result = state.allListingsRaw

      // Filter by district
      if (state.filters.district) {
        result = result.filter(
          (l) => l.district === state.filters.district || l.neighbourhood === state.filters.district,
        )
      }

      // Filter by property type
      if (state.filters.propertyTypes.length > 0) {
        result = result.filter((l) => state.filters.propertyTypes.includes(l.propertyType))
      }

      // Filter by price range
      if (state.filters.priceMin != null && state.filters.priceMin !== "") {
        result = result.filter((l) => l.price >= state.filters.priceMin)
      }
      if (state.filters.priceMax != null && state.filters.priceMax !== "") {
        result = result.filter((l) => l.price <= state.filters.priceMax)
      }

      // Filter by availability
      if (state.filters.availabilityMin != null && state.filters.availabilityMin !== "") {
        result = result.filter((l) => l.availability >= state.filters.availabilityMin)
      }
      if (state.filters.availabilityMax != null && state.filters.availabilityMax !== "") {
        result = result.filter((l) => l.availability <= state.filters.availabilityMax)
      }

      return result
    },

    /**
     * Returns unique district names from current listings
     */
    availableDistricts: (state) => {
      if (!state.allListingsRaw.length) return []

      const districts = state.allListingsRaw.map((l) => l.neighbourhood).filter(Boolean)

      return [...new Set(districts)].sort()
    },

    /**
     * Returns sorted city names for dropdowns
     */
    cityNames: (state) => {
      return state.citiesData.map((c) => c.name).sort()
    },

    /**
     * Find city by ID
     */
    getCityById: (state) => (cityId) => {
      return state.citiesData.find((c) => c.id === cityId) || null
    },

    /**
     * Find city by name
     */
    getCityByName: (state) => (cityName) => {
      return state.citiesData.find((c) => c.name === cityName) || null
    },

    // View mode helpers
    isWorldView: (state) => state.currentViewMode === "world",
    isCountryView: (state) => state.currentViewMode === "country",
    isCityView: (state) => state.currentViewMode === "city",
    isDistrictView: (state) => state.currentViewMode === "district",
  },

  // ============================================
  // ACTIONS
  // ============================================
  actions: {
    /**
     * Updates filter state
     */
    setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
    },

    /**
     * Resets all filters to default values
     */
    resetFilters() {
      this.filters = {
        district: null,
        propertyTypes: [],
        priceMin: null,
        priceMax: null,
        availabilityMin: null,
        availabilityMax: null,
      }
    },

    /**
     * Updates current view mode and related state
     */
    setViewMode(mode, data = {}) {
      this.currentViewMode = mode

      switch (mode) {
        case "world":
          this.selectedCountry = null
          this.selectedCity = null
          this.clearCityData()
          break
        case "country":
          this.selectedCountry = data.country || null
          this.selectedCity = null
          this.clearCityData()
          break
        case "city":
          this.selectedCity = data.city || null
          break
        case "district":
          if (data.district) {
            this.filters.district = data.district
          }
          break
      }
    },

    /**
     * Loads cities list from API
     */
    async loadCities() {
      this.error = null

      try {
        const response = await fetch(`${API_URL}/cities`)
        if (!response.ok) return

        this.citiesData = await response.json()
      } catch (err) {
        console.error("Failed to load cities:", err)
      }
    },

    /**
     * Loads all data for a specific city
     */
    async loadCityData(cityId) {
      this.loading = true
      this.error = null
      this.allListingsRaw = []
      this.currentGeoJson = null
      this.resetFilters()

      try {
        // Ensure cities are loaded
        if (this.citiesData.length === 0) {
          await this.loadCities()
        }

        const cityInfo = this.citiesData.find((c) => c.id === cityId)
        if (!cityInfo) {
          throw new Error("City not found")
        }

        this.selectedCity = cityInfo
        const folder = cityInfo.folderName

        // Load GeoJSON boundaries
        try {
          const geoRes = await fetch(`/data/cities/${folder}/neighbourhoods.geojson`)
          if (geoRes.ok) {
            this.currentGeoJson = Object.freeze(await geoRes.json())
          }
        } catch (e) {
          console.warn("Failed to load GeoJSON:", e)
        }

        // Load listings from API
        const response = await fetch(`${API_URL}/listings?cityId=${cityId}`)
        const data = await response.json()

        // Process and normalize listing data
        const processed = data.map((row) => ({
          id: row.id,
          name: row.name,
          host_id: row.host_id,
          host_name: row.host_name,
          latitude: row.latitude,
          longitude: row.longitude,
          price: row.price,
          availability: row.availability_365,
          propertyType: row.propertyType || normalizePropertyType(row.room_type),
          propertyTypeLabel: row.room_type,
          neighbourhood: row.neighbourhood,
          district: row.neighbourhood,
          cityId: row.cityId,
          reviews: row.number_of_reviews,
        }))

        this.allListingsRaw = Object.freeze(processed)
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    /**
     * Clears current city data
     */
    clearCityData() {
      this.allListingsRaw = []
      this.currentGeoJson = null
      this.resetFilters()
    },
  },
})
