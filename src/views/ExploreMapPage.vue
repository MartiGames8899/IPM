<template>
  <div class="explore-map-page" ref="pageContainer">
    <section class="map-workspace" ref="workspaceRef">
      <div class="workspace-container" :class="{ 'dashboard-visible': showDashboard }">
        <div class="left-panel" :class="{ 'panel-collapsed': showDashboard }">
          <div class="sidebar-column">
            <FilterSidebar
              ref="filterSidebarRef"
              :initial-filters="store.filters"
              :filtered-count="store.filteredListings.length"
              @filter-change="onFilterChange"
            />
          </div>

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

        <!-- import DashboardSection from components/dashboard instead of components/map -->
        <div class="right-panel" :class="{ 'panel-visible': showDashboard }">
          <DashboardSection
            v-if="store.selectedCity"
            :city-name="store.selectedCity?.name || ''"
            :listings="store.filteredListings"
            :all-listings="store.allListingsRaw"
            @toggle-dashboard="toggleDashboard"
          />
          <div v-else class="dashboard-placeholder">
            <div class="placeholder-content">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="placeholder-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <h3>Select a City</h3>
              <p>Choose a city on the map to view detailed analytics and insights</p>
            </div>
          </div>
        </div>
      </div>

      <button 
        v-if="store.selectedCity && !showDashboard" 
        class="scroll-indicator" 
        @click="toggleDashboard"
      >
        <span>View Dashboard</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      <button 
        v-if="showDashboard" 
        class="collapse-indicator" 
        @click="toggleDashboard"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        <span>Expand Map</span>
      </button>
    </section>
  </div>
</template>

<script>
import MapView from "../components/map/MapView.vue"
import FilterSidebar from "../components/map/FilterSidebar.vue"
import DashboardSection from "../components/dashboard/DashboardSection.vue"
import { useDataStore } from "../stores/data.js"

export default {
  name: "ExploreMapPage",
  components: {
    MapView,
    FilterSidebar,
    DashboardSection
  },
  setup() {
    const store = useDataStore()
    return { store }
  },
  data() {
    return {
      mapReady: false,
      showDashboard: false
    }
  },
  mounted() {
    this.checkUrlParams()
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  watch: {
    "$route.query.city": {
      handler(newCity) {
        if (newCity && this.mapReady) {
          this.selectCityFromUrl(newCity)
        }
      }
    },
    "store.selectedCity": {
      handler(newCity) {
        if (newCity && !this.showDashboard) {
          setTimeout(() => {
            this.showDashboard = true
          }, 800)
        }
      }
    }
  },
  methods: {
    handleScroll() {},
    toggleDashboard() {
      this.showDashboard = !this.showDashboard
      setTimeout(() => {
        this.$refs.mapViewRef?.map?.invalidateSize()
      }, 350)
    },
    onMapReady() {
      this.mapReady = true
      this.checkUrlParams()
    },
    onViewModeChanged(mode) {
      if (mode === "world" || mode === "country") {
        this.store.resetFilters()
        this.showDashboard = false
      }
    },
    onCitySelected() {
      this.store.resetFilters()
    },
    onDistrictSelected(districtName) {
      this.store.setFilters({ district: districtName })
    },
    onDistrictCleared() {
      this.store.setFilters({ district: null })
    },
    onFilterChange(newFilters) {
      const currentCityName = this.store.selectedCity?.name

      if (newFilters.city && newFilters.city !== currentCityName) {
        this.$refs.mapViewRef?.selectCityByName(newFilters.city)
      } else if (!newFilters.city && currentCityName) {
        this.$refs.mapViewRef?.backToWorldView()
      }

      this.store.setFilters(newFilters)
    },
    checkUrlParams() {
      const cityParam = this.$route.query.city
      if (cityParam && this.mapReady) {
        this.selectCityFromUrl(cityParam)
      }
    },
    selectCityFromUrl(cityId) {
      const city = this.store.getCityById(cityId)
      if (city) {
        this.$refs.mapViewRef?.selectCityByName(city.name)
      }
    }
  }
}
</script>

<style scoped>
.explore-map-page {
  padding-top: 45px;
  min-height: 100vh;
  background: #c0daf8;
}

.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  background: linear-gradient(135deg, #c0daf8 0%, #e8f1fc 100%);
  padding: 1.25rem 0;
}

.page-title {
  font-family: "Kanit", sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 0.35rem;
}

.page-description {
  font-family: "Kanit", sans-serif;
  font-size: 0.75rem;
  font-weight: 300;
  color: #4a5568;
  line-height: 1.4;
  max-width: 550px;
}

.map-workspace {
  padding: 1rem 0;
  position: relative;
}

.workspace-container {
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  gap: 1rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.left-panel {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1rem;
  flex: 1;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.left-panel.panel-collapsed {
  flex: 0 0 52%;
}

.sidebar-column {
  position: sticky;
  top: 55px;
  max-height: calc(100vh - 100px);
}

.map-column {
  display: flex;
  flex-direction: column;
}

.map-wrapper {
  background: white;
  border: 2px solid #75aff0;
  border-radius: 12px;
  height: calc(100vh - 100px);
  min-height: 500px;
  overflow: hidden;
  transition: height 0.3s ease;
}

.right-panel {
  flex: 0;
  width: 0;
  opacity: 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.right-panel.panel-visible {
  flex: 0 0 48%;
  width: auto;
  opacity: 1;
  overflow: visible;
}

.dashboard-placeholder {
  background: white;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  height: calc(100vh - 70px);
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  text-align: center;
  padding: 2rem;
}

.placeholder-icon {
  width: 56px;
  height: 56px;
  color: #9ca3af;
  margin-bottom: 0.75rem;
}

.placeholder-content h3 {
  font-family: "Kanit", sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 0.4rem;
}

.placeholder-content p {
  font-family: "Kanit", sans-serif;
  font-size: 0.8rem;
  color: #9ca3af;
}

.scroll-indicator,
.collapse-indicator {
  position: fixed;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #3d8adf 0%, #75aff0 100%);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 24px;
  font-family: "Kanit", sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 16px rgba(61, 138, 223, 0.3);
  z-index: 100;
  transition: all 0.3s ease;
}

.scroll-indicator:hover,
.collapse-indicator:hover {
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 6px 20px rgba(61, 138, 223, 0.4);
}

.scroll-indicator svg,
.collapse-indicator svg {
  width: 18px;
  height: 18px;
}

.collapse-indicator {
  background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
  box-shadow: 0 4px 16px rgba(107, 114, 128, 0.3);
}

.collapse-indicator:hover {
  box-shadow: 0 6px 20px rgba(107, 114, 128, 0.4);
}

@media (max-width: 1400px) {
  .left-panel {
    grid-template-columns: 240px 1fr;
  }
  
  .left-panel.panel-collapsed {
    flex: 0 0 54%;
  }
  
  .right-panel.panel-visible {
    flex: 0 0 46%;
  }
}

@media (max-width: 1200px) {
  .left-panel {
    grid-template-columns: 220px 1fr;
  }
  
  .left-panel.panel-collapsed {
    flex: 0 0 55%;
  }
  
  .right-panel.panel-visible {
    flex: 0 0 45%;
  }
}

@media (max-width: 1024px) {
  .workspace-container {
    flex-direction: column;
  }

  .left-panel {
    grid-template-columns: 1fr;
    flex: none;
  }
  
  .left-panel.panel-collapsed {
    flex: none;
  }

  .sidebar-column {
    position: relative;
    top: 0;
    max-height: none;
  }

  .map-wrapper {
    height: 450px;
    min-height: 400px;
  }

  .right-panel {
    width: 100%;
    opacity: 1;
  }
  
  .right-panel.panel-visible {
    flex: none;
    width: 100%;
  }

  .dashboard-placeholder {
    height: auto;
    min-height: 300px;
  }

  .scroll-indicator,
  .collapse-indicator {
    display: none;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.35rem;
  }

  .page-description {
    font-size: 0.7rem;
  }

  .map-wrapper {
    height: 400px;
  }
}
</style>
