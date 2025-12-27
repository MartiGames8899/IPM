<template>
  <div class="explore-map-page">
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <span class="page-tag">Interactive Explorer</span>
        <h1 class="page-title">Explore Map</h1>
        <p class="page-description">
          Visualize Airbnb listings on an interactive map. Select a city to explore detailed listings or use filters to narrow down results.
        </p>
      </div>
    </section>

    <!-- Map Workspace -->
    <section class="map-workspace">
      <div class="workspace-container">
        <!-- Sidebar Filters -->
        <div class="sidebar-column">
          <FilterSidebar
            ref="filterSidebarRef"
            :initial-filters="store.filters"
            :filtered-count="store.filteredListings.length"
            @filter-change="onFilterChange"
          />
        </div>

        <!-- Map Display -->
        <div class="map-column">
          <div class="map-wrapper">
            <MapView
              ref="mapViewRef"
              :listings="store.filteredListings"
              :selected-district-filter="store.filters.district"
              @map-ready="onMapReady"
              @city-selected="onCitySelected"
              @district-selected="onDistrictSelected"
              @district-cleared="onDistrictCleared"
              @view-mode-changed="onViewModeChanged"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
/**
 * Explore Map Page View
 * Interactive map with filters for exploring Airbnb listings
 */
import MapView from "../components/map/MapView.vue"
import FilterSidebar from "../components/map/FilterSidebar.vue"
import { useDataStore } from "../stores/data.js"

export default {
  name: "ExploreMapPage",

  components: {
    MapView,
    FilterSidebar,
  },

  setup() {
    const store = useDataStore()
    return { store }
  },

  data() {
    return {
      mapReady: false,
    }
  },

  mounted() {
    this.checkUrlParams()
  },

  watch: {
    "$route.query.city": {
      handler(newCity) {
        if (newCity && this.mapReady) {
          this.selectCityFromUrl(newCity)
        }
      },
    },
  },

  methods: {
    /**
     * Called when map is fully initialized
     */
    onMapReady() {
      this.mapReady = true
      this.checkUrlParams()
    },

    /**
     * Handles view mode changes from map
     */
    onViewModeChanged(mode) {
      if (mode === "world" || mode === "country") {
        this.store.resetFilters()
      }
    },

    /**
     * Handles city selection from map
     */
    onCitySelected() {
      this.store.resetFilters()
    },

    /**
     * Handles district selection from map
     */
    onDistrictSelected(districtName) {
      this.store.setFilters({ district: districtName })
    },

    /**
     * Handles district clear from map
     */
    onDistrictCleared() {
      this.store.setFilters({ district: null })
    },

    /**
     * Handles filter changes from sidebar
     */
    onFilterChange(newFilters) {
      const currentCityName = this.store.selectedCity?.name

      // Handle city change from dropdown
      if (newFilters.city && newFilters.city !== currentCityName) {
        this.$refs.mapViewRef?.selectCityByName(newFilters.city)
      } else if (!newFilters.city && currentCityName) {
        this.$refs.mapViewRef?.backToWorldView()
      }

      this.store.setFilters(newFilters)
    },

    /**
     * Checks URL for city parameter
     */
    checkUrlParams() {
      const cityParam = this.$route.query.city
      if (cityParam && this.mapReady) {
        this.selectCityFromUrl(cityParam)
      }
    },

    /**
     * Selects city from URL parameter
     */
    selectCityFromUrl(cityId) {
      const city = this.store.getCityById(cityId)
      if (city) {
        this.$refs.mapViewRef?.selectCityByName(city.name)
      }
    },
  },
}
</script>

<style scoped>
.explore-map-page {
  padding-top: 45px;
  min-height: 100vh;
  background: #f8f9fa;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-header {
  background: linear-gradient(135deg, #c0daf8 0%, #e8f1fc 100%);
  padding: 1.5rem 0;
}

.page-tag {
  display: inline-block;
  background: #3d8adf;
  color: #fff;
  padding: 0.2rem 0.6rem;
  border-radius: 15px;
  font-family: "Kanit", sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.page-title {
  font-family: "Kanit", sans-serif;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.page-description {
  font-family: "Kanit", sans-serif;
  font-size: 0.8rem;
  font-weight: 300;
  color: #4a5568;
  line-height: 1.5;
  max-width: 600px;
}

.map-workspace {
  padding: 1.25rem 0;
}

.workspace-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.25rem;
  align-items: start;
}

.sidebar-column {
  position: sticky;
  top: 60px;
  max-height: calc(100vh - 80px);
}

.map-column {
  display: flex;
  flex-direction: column;
}

.map-wrapper {
  background: white;
  border: 2px solid #75aff0;
  border-radius: 12px;
  height: 550px;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .workspace-container {
    grid-template-columns: 1fr;
  }

  .sidebar-column {
    position: relative;
    top: 0;
    max-height: none;
  }

  .map-wrapper {
    height: 450px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .page-description {
    font-size: 0.75rem;
  }

  .map-wrapper {
    height: 400px;
  }
}
</style>
