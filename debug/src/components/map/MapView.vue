<template>
  <div class="map-view">
    <!-- Map Container -->
    <div class="map-container" ref="mapContainer"></div>

    <!-- Loading Overlay -->
    <div v-if="isLoadingListings" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Loading {{ loadingProgress.toLocaleString() }} listings...</p>
    </div>

    <!-- City Selection Popup -->
    <div v-if="showCityPopup" class="city-popup" :style="cityPopupStyle">
      <div class="popup-content">
        <h3>{{ pendingCity?.name }}</h3>
      </div>
      <div class="popup-arrow"></div>
    </div>

    <!-- District Bar -->
    <div v-if="currentViewMode === 'district' && selectedDistrictName" class="district-bar">
      <span class="district-name">{{ selectedDistrictName }}</span>
      <button class="clear-district-btn" @click="clearDistrictSelection">
        x View all {{ selectedCity?.name }}
      </button>
    </div>

    <!-- Navigation Controls -->
    <div class="map-nav-controls">
      <button v-if="canGoBack" class="nav-back-btn" @click="goBack">
        {{ backButtonText }}
      </button>
      <span class="view-mode-indicator">{{ viewModeText }}</span>
    </div>
  </div>
</template>

<script>
/**
 * MapView Component
 * Interactive Leaflet map with country, city, and listing layers
 */
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.markercluster"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import { useDataStore } from "../../stores/data.js"

// View mode constants
const VIEW_MODES = {
  WORLD: "world",
  COUNTRY: "country",
  CITY: "city",
  DISTRICT: "district",
}

// Map configuration
const MAP_CONFIG = {
  defaultCenter: [39.5, -8.0],
  defaultZoom: 4,
  countryZoom: 6,
  cityZoom: 12,
  districtZoom: 14,
}

export default {
  name: "MapView",

  props: {
    listings: {
      type: Array,
      default: () => [],
    },
    selectedDistrictFilter: {
      type: String,
      default: null,
    },
  },

  emits: ["view-mode-changed", "country-selected", "city-selected", "district-selected", "district-cleared", "map-ready"],

  setup() {
    const store = useDataStore()
    return { store }
  },

  created() {
    // Initialize map layer references
    this.map = null
    this.countriesLayer = null
    this.citiesLayer = null
    this.markersLayer = null
    this.neighborhoodsLayer = null
    this.geojsonLayer = null
    this.maskLayer = null
    this.selectedCountryLayer = null
    this.selectedDistrictLayer = null
  },

  data() {
    return {
      renderId: 0,
      currentViewMode: VIEW_MODES.WORLD,
      selectedCountry: null,
      selectedCity: null,
      selectedDistrictName: null,
      showCityPopup: false,
      cityPopupPos: { x: 0, y: 0 },
      pendingCity: null,
      isLoadingListings: false,
      loadingProgress: 0,
    }
  },

  computed: {
    citiesData() {
      return this.store.citiesData
    },

    cityPopupStyle() {
      return {
        top: this.cityPopupPos.y + "px",
        left: this.cityPopupPos.x + "px",
      }
    },

    canGoBack() {
      return this.currentViewMode !== VIEW_MODES.WORLD
    },

    backButtonText() {
      const texts = {
        [VIEW_MODES.COUNTRY]: "Back to World View",
        [VIEW_MODES.CITY]: `Back to ${this.selectedCountry?.name || ""}`,
        [VIEW_MODES.DISTRICT]: `Back to ${this.selectedCity?.name || ""}`,
      }
      return texts[this.currentViewMode] || ""
    },

    viewModeText() {
      const texts = {
        [VIEW_MODES.WORLD]: "Click a country to zoom in",
        [VIEW_MODES.COUNTRY]: `Select a city in ${this.selectedCountry?.name || ""}`,
        [VIEW_MODES.CITY]: `Viewing ${this.selectedCity?.name || ""}`,
        [VIEW_MODES.DISTRICT]: `Viewing ${this.selectedDistrictName || ""}`,
      }
      return texts[this.currentViewMode] || ""
    },
  },

  mounted() {
    this.initMap()
  },

  beforeUnmount() {
    if (this.map) {
      this.map.remove()
    }
  },

  watch: {
    listings: {
      handler() {
        const shouldRender = this.currentViewMode === VIEW_MODES.CITY || this.currentViewMode === VIEW_MODES.DISTRICT
        if (shouldRender && this.selectedCity) {
          this.renderListings()
        }
      },
      deep: true,
    },

    selectedDistrictFilter(newDistrict) {
      if (newDistrict && newDistrict !== this.selectedDistrictName) {
        this.selectDistrictByName(newDistrict)
      } else if (!newDistrict && this.selectedDistrictName) {
        this.clearDistrictSelection()
      }
    },
  },

  methods: {
    // ============================================
    // MAP INITIALIZATION
    // ============================================

    initMap() {
      this.map = L.map(this.$refs.mapContainer, { preferCanvas: true }).setView(
        MAP_CONFIG.defaultCenter,
        MAP_CONFIG.defaultZoom,
      )

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
        updateWhenIdle: false,
        updateWhenZooming: false,
      }).addTo(this.map)

      // Initialize layers
      this.countriesLayer = L.layerGroup().addTo(this.map)
      this.citiesLayer = L.layerGroup().addTo(this.map)
      this.maskLayer = L.layerGroup().addTo(this.map)
      this.neighborhoodsLayer = L.layerGroup().addTo(this.map)

      this.markersLayer = L.markerClusterGroup({
        chunkedLoading: true,
        chunkInterval: 100,
        chunkDelay: 10,
        maxClusterRadius: 80,
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: 16,
        iconCreateFunction: this.createClusterIcon,
      }).addTo(this.map)

      this.loadCountries()
    },

    createClusterIcon(cluster) {
      const count = cluster.getChildCount()
      const size = count > 1000 ? "large" : count > 100 ? "medium" : "small"
      const dimension = count > 1000 ? 50 : count > 100 ? 40 : 30
      const displayCount = count >= 1000 ? Math.round(count / 1000) + "k" : count

      return L.divIcon({
        html: `<div class="cluster-dot cluster-${size}"><span>${displayCount}</span></div>`,
        className: "marker-cluster-custom",
        iconSize: L.point(dimension, dimension),
      })
    },

    // ============================================
    // COUNTRY LAYER
    // ============================================

    async loadCountries() {
      try {
        const response = await fetch("/data/countries.geojson")
        const data = await response.json()

        this.countriesLayer.clearLayers()

        this.geojsonLayer = L.geoJSON(data, {
          style: this.countryStyle,
          onEachFeature: (feature, layer) => {
            layer.on({
              mouseover: (e) => this.onCountryHover(e, true),
              mouseout: (e) => this.onCountryHover(e, false),
              click: (e) => this.onCountryClick(e),
            })
          },
        }).addTo(this.countriesLayer)

        this.$emit("map-ready")
      } catch (error) {
        console.error("Failed to load countries:", error)
      }
    },

    countryStyle() {
      return {
        fillColor: "#ccc",
        weight: 1,
        opacity: 1,
        color: "#666",
        fillOpacity: 0.4,
      }
    },

    onCountryHover(e, isHovering) {
      if (this.currentViewMode !== VIEW_MODES.WORLD) return

      const layer = e.target
      if (isHovering) {
        layer.setStyle({
          weight: 3,
          color: "#75AFF0",
          fillColor: "#75AFF0",
          fillOpacity: 0.6,
        })
      } else {
        layer.setStyle(this.countryStyle())
      }
    },

    onCountryClick(e) {
      if (this.currentViewMode !== VIEW_MODES.WORLD) return

      const layer = e.target
      const countryName = layer.feature.properties.name || layer.feature.properties.ADMIN

      this.selectCountry(layer, { name: countryName, feature: layer.feature })
    },

    selectCountry(layer, countryData) {
      this.selectedCountry = countryData
      this.selectedCountryLayer = layer
      this.currentViewMode = VIEW_MODES.COUNTRY

      // Dim other countries
      this.geojsonLayer.eachLayer((otherLayer) => {
        if (otherLayer !== layer) {
          otherLayer.off("mouseover mouseout click")
          otherLayer.setStyle({
            fillColor: "gray",
            color: "black",
            fillOpacity: 0.9,
            opacity: 1,
            weight: 1,
          })
        }
      })

      // Highlight selected country
      layer.setStyle({
        weight: 5,
        color: "#75AFF0",
        fillColor: "#75AFF0",
        fillOpacity: 0,
        dashArray: "",
      })

      this.map.fitBounds(layer.getBounds(), { padding: [50, 50] })
      this.renderCities()

      this.store.setViewMode("country", { country: countryData })
      this.$emit("view-mode-changed", VIEW_MODES.COUNTRY)
      this.$emit("country-selected", countryData)
    },

    // ============================================
    // CITY LAYER
    // ============================================

    renderCities() {
      this.citiesLayer.clearLayers()

      if (!this.selectedCountry) return

      const countryCities = this.citiesData.filter(
        (c) => c.country?.toLowerCase() === this.selectedCountry.name?.toLowerCase(),
      )

      countryCities.forEach((city) => {
        const marker = L.circleMarker([city.lat, city.lng], {
          radius: 12,
          fillColor: "#75AFF0",
          color: "#fff",
          weight: 3,
          opacity: 1,
          fillOpacity: 0.8,
        })

        marker.cityData = city
        marker.on("mouseover", (e) => {
          L.DomEvent.stopPropagation(e)
          this.onCityMarkerClick(e, city)
        })
        marker.on("mouseout", (e) => {
          this.closeCityPopup(e, city)
        })
        marker.on("click", (e) => {
          this.selectCity(city)
        })

        marker.addTo(this.citiesLayer)
      })
    },

    onCityMarkerClick(e, city) {
      const containerPoint = this.map.latLngToContainerPoint(e.latlng)
      this.cityPopupPos = { x: city.latitude.x, y: containerPoint.y - 80}
      this.pendingCity = city
      this.showCityPopup = true
    },

    confirmCitySelection() {
      if (this.pendingCity) {
        this.selectCity(this.pendingCity)
      }
      this.closeCityPopup()
    },

    closeCityPopup() {
      this.showCityPopup = false
      this.pendingCity = null
    },

    async selectCity(city) {
      this.selectedCity = city
      this.currentViewMode = VIEW_MODES.CITY

      this.citiesLayer.clearLayers()
      if (this.map.hasLayer(this.countriesLayer)) {
        this.map.removeLayer(this.countriesLayer)
      }

      this.map.setView([city.lat, city.lng], MAP_CONFIG.cityZoom, { animate: true })
      this.store.setViewMode("city", { city })

      await this.store.loadCityData(city.id)

      this.renderNeighborhoods()

      setTimeout(() => {
        this.updateMask("city")
      }, 50)

      this.$emit("view-mode-changed", VIEW_MODES.CITY)
      this.$emit("city-selected", city)
    },

    async selectCityByName(cityName) {
      const city = this.store.getCityByName(cityName)
      if (!city) return
      if (this.geojsonLayer) {
        this.geojsonLayer.eachLayer((layer) => {
          const countryName = layer.feature.properties.name || layer.feature.properties.ADMIN
          if (countryName && city.country && countryName.toLowerCase() === city.country.toLowerCase()) {
            this.selectCountry(layer, { name: countryName, feature: layer.feature })
          }
        })
      }
      await this.selectCity(city)
    },

    // ============================================
    // NEIGHBORHOOD LAYER
    // ============================================

    renderNeighborhoods() {
      this.neighborhoodsLayer.clearLayers()

      const geoJson = this.store.currentGeoJson
      if (!geoJson?.features) return

      const layer = L.geoJSON(geoJson, {
        style: {
          fillColor: "#75AFF0",
          weight: 1,
          opacity: 0.5,
          color: "#5a9ad8",
          fillOpacity: 0,
        },
        interactive: false,
        onEachFeature: (feature, layer) => {
          layer.neighborhoodName = feature.properties.neighbourhood || feature.properties.name
        },
      })

      layer.addTo(this.neighborhoodsLayer)
    },

    selectDistrict(layer, name) {
      if (this.selectedDistrictLayer && this.selectedDistrictLayer !== layer) {
        this.selectedDistrictLayer.setStyle({
          weight: 1,
          color: "#5a9ad8",
          fillOpacity: 0,
        })
      }

      this.selectedDistrictName = name
      this.selectedDistrictLayer = layer
      this.currentViewMode = VIEW_MODES.DISTRICT

      this.map.fitBounds(layer.getBounds(), { padding: [50, 50] })
      this.store.setViewMode("district", { district: name })
      this.updateMask("district", layer)

      this.$emit("view-mode-changed", VIEW_MODES.DISTRICT)
      this.$emit("district-selected", name)
    },

    selectDistrictByName(name) {
      this.neighborhoodsLayer.eachLayer((layerGroup) => {
        if (layerGroup.eachLayer) {
          layerGroup.eachLayer((layer) => {
            if (layer.neighborhoodName === name) {
              this.selectDistrict(layer, name)
            }
          })
        }
      })
    },

    clearDistrictSelection() {
      this.selectedDistrictName = null
      this.selectedDistrictLayer = null
      this.currentViewMode = VIEW_MODES.CITY

      if (this.selectedCity) {
        this.map.setView([this.selectedCity.lat, this.selectedCity.lng], MAP_CONFIG.cityZoom, { animate: true })
      }

      this.store.setViewMode("city", { city: this.selectedCity })
      this.updateMask("city")

      this.$emit("view-mode-changed", VIEW_MODES.CITY)
      this.$emit("district-cleared")
    },

    // ============================================
    // LISTINGS LAYER
    // ============================================

    async renderListings() {
      if (!this.markersLayer) return

      this.renderId++
      const currentRenderId = this.renderId

      this.isLoadingListings = true
      this.loadingProgress = 0
      this.markersLayer.clearLayers()

      const listings = this.listings
      const markers = []

      for (let i = 0; i < listings.length; i++) {
        if (this.renderId !== currentRenderId) return

        const l = listings[i]
        if (!l.latitude || !l.longitude) continue

        const dot = L.circleMarker([l.latitude, l.longitude], {
          radius: 6,
          fillColor: "#75AFF0",
          color: "#5a9ad8",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7,
        })

        dot.on("click", () => {
          dot.bindPopup(this.createListingPopup(l)).openPopup()
        })

        markers.push(dot)

        if (i % 5000 === 0) {
          this.loadingProgress = i
          await new Promise((r) => setTimeout(r, 1))
        }
      }

      if (this.renderId === currentRenderId) {
        this.markersLayer.addLayers(markers)
        this.isLoadingListings = false
      }
    },

    createListingPopup(l) {
      return `
        <div class="listing-popup">
          <h4>${l.name}</h4>
          <p class="listing-price">€${l.price}/night</p>
        </div>
      `
    },

    // ============================================
    // MASK LAYER
    // ============================================

    updateMask(mode, targetLayer) {
      this.maskLayer.clearLayers()

      const worldLatlngs = [
        [90, -180],
        [90, 180],
        [-90, 180],
        [-90, -180],
      ]
      const holes = []

      const addHoleFromLayer = (layer) => {
        const type = layer.feature?.geometry?.type
        const latlngs = layer.getLatLngs()

        if (type === "MultiPolygon") {
          latlngs.forEach((poly) => holes.push(poly[0]))
        } else if (type === "Polygon") {
          holes.push(latlngs[0])
        } else {
          holes.push(Array.isArray(latlngs[0]) ? latlngs[0] : latlngs)
        }
      }

      if (mode === "city" && this.neighborhoodsLayer) {
        this.neighborhoodsLayer.eachLayer((layerGroup) => {
          if (layerGroup.eachLayer) {
            layerGroup.eachLayer((l) => addHoleFromLayer(l))
          } else {
            addHoleFromLayer(layerGroup)
          }
        })
      } else if (mode === "district" && targetLayer) {
        addHoleFromLayer(targetLayer)
      }

      if (holes.length > 0) {
        L.polygon([worldLatlngs, ...holes], {
          color: "none",
          fillColor: "#1a1a2e",
          fillOpacity: 0.7,
          interactive: false,
        }).addTo(this.maskLayer)
      }
    },

    // ============================================
    // NAVIGATION
    // ============================================

    goBack() {
      if (this.currentViewMode === VIEW_MODES.DISTRICT) {
        this.clearDistrictSelection()
      } else if (this.currentViewMode === VIEW_MODES.CITY) {
        this.backToCountryView()
      } else if (this.currentViewMode === VIEW_MODES.COUNTRY) {
        this.backToWorldView()
      }
    },

    backToCountryView() {
      this.renderId++
      this.isLoadingListings = false
      this.markersLayer.clearLayers()
      this.neighborhoodsLayer.clearLayers()
      this.maskLayer.clearLayers()
      this.store.clearCityData()
      this.selectedCity = null
      this.currentViewMode = VIEW_MODES.COUNTRY

      if (!this.map.hasLayer(this.countriesLayer)) {
        this.countriesLayer.addTo(this.map)
      }

      setTimeout(() => {
        if (this.selectedCountryLayer) {
          this.map.fitBounds(this.selectedCountryLayer.getBounds(), { padding: [50, 50], animate: false })
          this.selectedCountryLayer.setStyle({
            weight: 5,
            color: "#75AFF0",
            fillColor: "#75AFF0",
            fillOpacity: 0,
            dashArray: "",
          })
        } else {
          this.backToWorldView()
        }

        this.renderCities()
        this.store.setViewMode("country", { country: this.selectedCountry })
        this.$emit("view-mode-changed", VIEW_MODES.COUNTRY)
      }, 50)
    },

    backToWorldView() {
      this.renderId++
      this.isLoadingListings = false
      this.markersLayer.clearLayers()
      this.neighborhoodsLayer.clearLayers()
      this.citiesLayer.clearLayers()
      this.maskLayer.clearLayers()
      this.store.clearCityData()
      this.selectedCountry = null
      this.currentViewMode = VIEW_MODES.WORLD

      setTimeout(() => {
        if (this.countriesLayer) {
          this.countriesLayer.eachLayer((l) => {
            if (l.eachLayer) {
              l.eachLayer((fl) => {
                this.geojsonLayer.resetStyle(fl)
                fl.off()
                fl.on({
                  mouseover: (e) => this.onCountryHover(e, true),
                  mouseout: (e) => this.onCountryHover(e, false),
                  click: (e) => this.onCountryClick(e),
                })
              })
            }
          })
        }

        this.map.setView(MAP_CONFIG.defaultCenter, MAP_CONFIG.defaultZoom, { animate: false })
        this.store.setViewMode("world")
        this.$emit("view-mode-changed", VIEW_MODES.WORLD)
      }, 50)
    },
  },
}
</script>

<style scoped>
.map-view {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-container {
  width: 100%;
  height: 100%;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e9ecef;
  border-top-color: #75aff0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 0.75rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-overlay p {
  font-family: "Kanit", sans-serif;
  font-size: 0.85rem;
  color: #2c3e50;
  margin: 0;
}

/* City Popup */
.city-popup {
  position: absolute;
  z-index: 1001;
  transform: translateX(-50%);
}

.popup-content {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  min-width: 150px;
  text-align: center;
  position: relative;
}

.popup-close {
  position: absolute;
  top: 0.25rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #6c757d;
  cursor: pointer;
}

.popup-content h3 {
  font-family: "Kanit", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
}

.listing-count {
  font-family: "Kanit", sans-serif;
  font-size: 0.75rem;
  color: #6c757d;
  margin: 0 0 0.75rem 0;
}

.popup-btn {
  background: #75aff0;
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-family: "Kanit", sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.popup-btn:hover {
  background: #5a9ad8;
}

.popup-arrow {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid white;
  margin: 0 auto;
}

/* District Bar */
.district-bar {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1000;
}

.district-name {
  font-family: "Kanit", sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #2c3e50;
}

.clear-district-btn {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  color: #6c757d;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-family: "Kanit", sans-serif;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-district-btn:hover {
  background: #e9ecef;
  color: #2c3e50;
}

/* Navigation Controls */
.map-nav-controls {
  position: absolute;
  bottom: 20px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1000;
}

.nav-back-btn {
  background: white;
  border: 2px solid #75aff0;
  color: #3d8adf;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: "Kanit", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-back-btn:hover {
  background: #75aff0;
  color: white;
}

.view-mode-indicator {
  background: rgba(255, 255, 255, 0.95);
  padding: 0.4rem 0.75rem;
  border-radius: 15px;
  font-family: "Kanit", sans-serif;
  font-size: 0.7rem;
  color: #6c757d;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>

<style>
/* Global styles for map elements */
.marker-cluster-custom {
  background: transparent;
}

.cluster-dot {
  background: #75aff0;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.cluster-dot span {
  color: white;
  font-family: "Kanit", sans-serif;
  font-weight: 600;
  font-size: 0.7rem;
}

.cluster-small {
  width: 30px;
  height: 30px;
}

.cluster-medium {
  width: 40px;
  height: 40px;
}

.cluster-large {
  width: 50px;
  height: 50px;
}

.cluster-large span {
  font-size: 0.8rem;
}

.neighborhood-tooltip {
  background: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  font-family: "Kanit", sans-serif;
  font-size: 0.75rem;
  padding: 0.4rem 0.75rem;
}

.listing-popup {
  font-family: "Kanit", sans-serif;
}

.listing-popup h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.listing-popup p {
  font-size: 0.75rem;
  margin: 0.25rem 0;
  color: #6c757d;
}

.listing-popup .listing-price {
  color: #3d8adf;
  font-weight: 500;
}
</style>
