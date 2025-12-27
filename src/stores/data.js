import { defineStore } from "pinia"

const API_URL = "http://localhost:3001"

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
  state: () => ({
    allListingsRaw: [],
    totalListingsGlobal: 0,
    citiesData: [],
    currentGeoJson: null,
    loading: false,
    error: null,
    currentViewMode: "world",
    selectedCountry: null,
    selectedCity: null,
    filters: {
      district: null,
      propertyTypes: [],
      priceMin: null,
      priceMax: null,
      availabilityMin: null,
      availabilityMax: null,
      ratingMin: null,
      ratingMax: null,
      accommodatesMin: null,
      accommodatesMax: null,
      superhostOnly: false,
      hasLicense: false,
    },
    trendingCities: [],
    exportState: {
      loading: false,
      error: null,
      success: false,
      lastExport: null,
      previewData: [],
      previewLoading: false,
    },
  }),

  getters: {
    trendingCities: (state) => {
      return [...state.citiesData].sort((a, b) => (b.listingCount || 0) - (a.listingCount || 0)).slice(0, 10)
    },

    totalGlobalListings: (state) => {
      return state.citiesData.reduce((acc, city) => acc + (city.listingCount || 0), 0)
    },

    filteredListings: (state) => {
      let result = state.allListingsRaw

      if (state.filters.district) {
        result = result.filter(
          (l) => l.district === state.filters.district || l.neighbourhood === state.filters.district,
        )
      }

      if (state.filters.propertyTypes.length > 0) {
        result = result.filter((l) => state.filters.propertyTypes.includes(l.propertyType))
      }

      if (state.filters.priceMin != null && state.filters.priceMin !== "") {
        result = result.filter((l) => l.price >= state.filters.priceMin)
      }
      if (state.filters.priceMax != null && state.filters.priceMax !== "") {
        result = result.filter((l) => l.price <= state.filters.priceMax)
      }

      if (state.filters.availabilityMin != null && state.filters.availabilityMin !== "") {
        result = result.filter((l) => l.availability >= state.filters.availabilityMin)
      }
      if (state.filters.availabilityMax != null && state.filters.availabilityMax !== "") {
        result = result.filter((l) => l.availability <= state.filters.availabilityMax)
      }

      if (state.filters.ratingMin != null && state.filters.ratingMin !== "") {
        result = result.filter((l) => l.rating >= state.filters.ratingMin)
      }
      if (state.filters.ratingMax != null && state.filters.ratingMax !== "") {
        result = result.filter((l) => l.rating <= state.filters.ratingMax)
      }

      if (state.filters.accommodatesMin != null && state.filters.accommodatesMin !== "") {
        result = result.filter((l) => l.accommodates >= state.filters.accommodatesMin)
      }
      if (state.filters.accommodatesMax != null && state.filters.accommodatesMax !== "") {
        result = result.filter((l) => l.accommodates <= state.filters.accommodatesMax)
      }

      if (state.filters.superhostOnly) {
        result = result.filter((l) => l.is_superhost === true || l.is_superhost === "t" || l.is_superhost === "true")
      }

      if (state.filters.hasLicense) {
        result = result.filter((l) => l.license && l.license.trim() !== "")
      }

      return result
    },

    availableDistricts: (state) => {
      if (!state.allListingsRaw.length) return []
      const districts = state.allListingsRaw.map((l) => l.neighbourhood).filter(Boolean)
      return [...new Set(districts)].sort()
    },

    cityNames: (state) => {
      return state.citiesData.map((c) => c.name).sort()
    },

    getCityById: (state) => (cityId) => {
      return state.citiesData.find((c) => c.id === cityId) || null
    },

    getCityByName: (state) => (cityName) => {
      return state.citiesData.find((c) => c.name === cityName) || null
    },

    isWorldView: (state) => state.currentViewMode === "world",
    isCountryView: (state) => state.currentViewMode === "country",
    isCityView: (state) => state.currentViewMode === "city",
    isDistrictView: (state) => state.currentViewMode === "district",

    isExporting: (state) => state.exportState.loading,
    exportError: (state) => state.exportState.error,
    exportSuccess: (state) => state.exportState.success,
    exportPreviewData: (state) => state.exportState.previewData,
    isPreviewLoading: (state) => state.exportState.previewLoading,
  },

  actions: {
    setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
    },

    resetFilters() {
      this.filters = {
        district: null,
        propertyTypes: [],
        priceMin: null,
        priceMax: null,
        availabilityMin: null,
        availabilityMax: null,
        ratingMin: null,
        ratingMax: null,
        accommodatesMin: null,
        accommodatesMax: null,
        superhostOnly: false,
        hasLicense: false,
      }
    },

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

    async loadCityData(cityId) {
      this.loading = true
      this.error = null
      this.allListingsRaw = []
      this.currentGeoJson = null
      this.resetFilters()

      try {
        if (this.citiesData.length === 0) {
          await this.loadCities()
        }

        const cityInfo = this.citiesData.find((c) => c.id === cityId)
        if (!cityInfo) {
          throw new Error("City not found")
        }

        this.selectedCity = cityInfo
        const folder = cityInfo.folderName

        try {
          const geoRes = await fetch(`/data/cities/${folder}/neighbourhoods.geojson`)
          if (geoRes.ok) {
            this.currentGeoJson = Object.freeze(await geoRes.json())
          }
        } catch (e) {
          console.warn("Failed to load GeoJSON:", e)
        }

        const response = await fetch(`${API_URL}/listings?cityId=${cityId}`)
        const data = await response.json()

        const processed = data.map((row) => ({
          id: row.id,
          name: row.name,
          cityId: row.cityId,
          latitude: row.latitude,
          longitude: row.longitude,
          price: row.price,
          neighbourhood: row.neighbourhood,
          district: row.neighbourhood,
          image: row.image,
          url: row.url,
          rating: row.rating,
          reviews: row.reviews,
          license: row.license,
          host_id: row.host_id,
          host_name: row.host_name,
          host_image: row.host_image,
          is_superhost: row.is_superhost,
          propertyType: row.propertyType || normalizePropertyType(row.room_type),
          propertyTypeLabel: row.room_type,
          accommodates: row.accommodates,
          availability: row.availability,
          revenue: row.revenue,
        }))

        this.allListingsRaw = Object.freeze(processed)
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    clearCityData() {
      this.allListingsRaw = []
      this.currentGeoJson = null
      this.resetFilters()
    },

    async fetchExportPreview(cityName, fields, timePeriod) {
      this.exportState.previewLoading = true
      this.exportState.error = null

      try {
        const city = this.citiesData.find((c) => c.name === cityName)
        if (!city) {
          this.exportState.previewData = []
          return
        }

        const response = await fetch(`${API_URL}/listings?cityId=${city.id}&limit=5`)

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`)
        }

        const data = await response.json()
        const filteredData = this.filterByTimePeriod(data, timePeriod)

        this.exportState.previewData = filteredData.slice(0, 5).map((listing) => {
          const preview = { id: listing.id }

          if (fields.listingDetails) {
            preview.name = listing.name
            preview.type = listing.room_type || listing.propertyType
          }
          if (fields.pricing) {
            preview.price = `€${listing.price}/night`
          }
          if (fields.availability) {
            preview.availability = `${listing.availability} days/year`
          }
          if (fields.hostInfo) {
            preview.host = listing.host_name
          }
          if (fields.reviews) {
            preview.rating = listing.rating ? `${listing.rating}★` : "N/A"
          }
          if (fields.coordinates) {
            preview.coordinates = `${listing.latitude?.toFixed(4)}, ${listing.longitude?.toFixed(4)}`
          }

          return preview
        })
      } catch (err) {
        console.error("Failed to fetch export preview:", err)
        this.exportState.error = err.message
        this.exportState.previewData = []
      } finally {
        this.exportState.previewLoading = false
      }
    },

    async exportData(format, cityName, fields, timePeriod) {
      this.exportState.loading = true
      this.exportState.error = null
      this.exportState.success = false

      try {
        if (!cityName) {
          throw new Error("Please select a city before exporting")
        }

        const selectedFields = Object.entries(fields)
          .filter(([_, v]) => v)
          .map(([k]) => k)
        if (selectedFields.length === 0) {
          throw new Error("Please select at least one data field to export")
        }

        const city = this.citiesData.find((c) => c.name === cityName)
        if (!city) {
          throw new Error("City not found")
        }

        const response = await fetch(`${API_URL}/listings?cityId=${city.id}`)

        if (!response.ok) {
          throw new Error(`Server error: ${response.status} - Failed to fetch data`)
        }

        const data = await response.json()

        if (!data || data.length === 0) {
          throw new Error("No data available for the selected city")
        }

        const filteredData = this.filterByTimePeriod(data, timePeriod)
        const exportData = this.prepareExportData(filteredData, fields, cityName)

        await this.downloadFile(exportData, format, cityName)

        this.exportState.success = true
        this.exportState.lastExport = {
          format,
          city: cityName,
          count: exportData.length,
          timestamp: new Date().toISOString(),
        }

        return { success: true, count: exportData.length }
      } catch (err) {
        console.error("Export failed:", err)
        this.exportState.error = err.message
        throw err
      } finally {
        this.exportState.loading = false
      }
    },

    filterByTimePeriod(data, timePeriod) {
      return data
    },

    prepareExportData(data, fields, cityName) {
      return data.map((listing) => {
        const row = {}

        if (fields.listingDetails) {
          row.listing_id = listing.id
          row.name = listing.name
          row.property_type = listing.room_type || listing.propertyType
          row.city = cityName
          row.neighbourhood = listing.neighbourhood
        }

        if (fields.hostInfo) {
          row.host_id = listing.host_id
          row.host_name = listing.host_name
          row.is_superhost = listing.is_superhost
        }

        if (fields.pricing) {
          row.price_per_night = listing.price
          row.estimated_revenue = listing.revenue
        }

        if (fields.availability) {
          row.availability_365 = listing.availability
        }

        if (fields.reviews) {
          row.rating = listing.rating
          row.number_of_reviews = listing.reviews
        }

        if (fields.coordinates) {
          row.latitude = listing.latitude
          row.longitude = listing.longitude
        }

        return row
      })
    },

    async downloadFile(data, format, cityName) {
      const timestamp = new Date().toISOString().split("T")[0]
      const filename = `airbnb_${cityName.toLowerCase().replace(/\s+/g, "_")}_${timestamp}`

      let blob, extension

      switch (format) {
        case "csv":
          blob = this.generateCSV(data)
          extension = "csv"
          break
        case "json":
          blob = this.generateJSON(data)
          extension = "json"
          break
        case "excel":
          blob = this.generateExcel(data)
          extension = "xlsx"
          break
        default:
          throw new Error("Unsupported format")
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${filename}.${extension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },

    generateCSV(data) {
      if (data.length === 0) return new Blob([""], { type: "text/csv" })

      const headers = Object.keys(data[0])
      const csvRows = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((header) => {
              const value = row[header]
              if (value === null || value === undefined) return ""
              const stringValue = String(value)
              if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
                return `"${stringValue.replace(/"/g, '""')}"`
              }
              return stringValue
            })
            .join(","),
        ),
      ]

      return new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" })
    },

    generateJSON(data) {
      return new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    },

    generateExcel(data) {
      if (data.length === 0) return new Blob([""], { type: "text/csv" })

      const headers = Object.keys(data[0])
      const csvRows = [
        headers.join("\t"),
        ...data.map((row) =>
          headers
            .map((header) => {
              const value = row[header]
              if (value === null || value === undefined) return ""
              return String(value).replace(/\t/g, " ")
            })
            .join("\t"),
        ),
      ]

      const BOM = "\uFEFF"
      return new Blob([BOM + csvRows.join("\n")], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
    },

    resetExportState() {
      this.exportState = {
        loading: false,
        error: null,
        success: false,
        lastExport: null,
        previewData: [],
        previewLoading: false,
      }
    },
  },
})
