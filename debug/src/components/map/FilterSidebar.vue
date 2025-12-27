<template>
  <div class="filter-sidebar">
    <!-- Header -->
    <div class="sidebar-header">
      <h2>Filters</h2>
      <button class="reset-btn" @click="resetFilters">Reset All</button>
    </div>

    <!-- City Filter -->
    <div class="filter-section">
      <h3>City</h3>
      <Dropdown
        :options="store.cityNames"
        v-model="localFilters.city"
        placeholder="Select city..."
        @change="emitFilterChange"
      />
    </div>

    <!-- District Filter -->
    <div v-if="localFilters.city" class="filter-section">
      <h3>District/Zone</h3>
      <Dropdown
        :options="availableDistricts"
        v-model="localFilters.district"
        placeholder="All districts..."
        @change="emitFilterChange"
      />
      <p v-if="localFilters.district" class="selected-indicator">
        {{ localFilters.district }}
      </p>
    </div>

    <!-- Property Type Filter -->
    <div class="filter-section">
      <h3>Property Type</h3>
      <div class="checkbox-group">
        <label v-for="type in propertyTypes" :key="type.value" class="checkbox-label">
          <input type="checkbox" :value="type.value" v-model="localFilters.propertyTypes" @change="emitFilterChange" />
          <span>{{ type.label }}</span>
        </label>
      </div>
    </div>

    <!-- Price Range Filter -->
    <div class="filter-section">
      <h3>Price Range</h3>
      <div class="range-inputs">
        <input
          type="number"
          v-model.number="localFilters.priceMin"
          placeholder="Min"
          @input="emitFilterChange"
          class="range-input"
        />
        <span class="range-separator">-</span>
        <input
          type="number"
          v-model.number="localFilters.priceMax"
          placeholder="Max"
          @input="emitFilterChange"
          class="range-input"
        />
      </div>
      <p class="range-label">€/night</p>
    </div>

    <!-- Availability Filter -->
    <div class="filter-section">
      <h3>Availability</h3>
      <div class="range-inputs">
        <input
          type="number"
          v-model.number="localFilters.availabilityMin"
          placeholder="Min"
          min="0"
          max="365"
          @input="emitFilterChange"
          class="range-input"
        />
        <span class="range-separator">-</span>
        <input
          type="number"
          v-model.number="localFilters.availabilityMax"
          placeholder="Max"
          min="0"
          max="365"
          @input="emitFilterChange"
          class="range-input"
        />
      </div>
      <p class="range-label">days per year</p>
    </div>

    <!-- Results Count -->
    <div class="filter-stats">
      <p class="stats-text">{{ filteredCount.toLocaleString() }} listings match</p>
    </div>
  </div>
</template>

<script>
/**
 * Filter Sidebar Component
 * Provides filtering controls for map listings
 */
import Dropdown from "../DropDown.vue"
import { useDataStore } from "../../stores/data.js"

export default {
  name: "FilterSidebar",

  components: {
    Dropdown,
  },

  props: {
    initialFilters: {
      type: Object,
      required: true,
    },
    filteredCount: {
      type: Number,
      default: 0,
    },
  },

  emits: ["filter-change"],

  setup() {
    const store = useDataStore()
    return { store }
  },

  data() {
    return {
      localFilters: { ...this.initialFilters },
      propertyTypes: [
        { value: "entire_home", label: "Entire Home/Apt" },
        { value: "private_room", label: "Private Room" },
        { value: "shared_room", label: "Shared Room" },
        { value: "hotel_room", label: "Hotel Room" },
      ],
    }
  },

  computed: {
    availableDistricts() {
      return this.store.availableDistricts.length > 0 ? this.store.availableDistricts : []
    },
  },

  watch: {
    initialFilters: {
      handler(newVal) {
        this.localFilters = {
          ...newVal,
          propertyTypes: newVal.propertyTypes || [],
        }

        // Sync city from store
        if (this.store.selectedCity) {
          this.localFilters.city = this.store.selectedCity.name
        }
      },
      deep: true,
    },

    "localFilters.city"(newCity, oldCity) {
      if (newCity !== oldCity) {
        this.localFilters.district = null
      }
    },
  },

  methods: {
    emitFilterChange() {
      this.$emit("filter-change", { ...this.localFilters })
    },

    resetFilters() {
      this.localFilters = {
        city: this.localFilters.city,
        district: null,
        propertyTypes: [],
        priceMin: null,
        priceMax: null,
        availabilityMin: null,
        availabilityMax: null,
      }
      this.emitFilterChange()
    },
  },
}
</script>

<style scoped>
.filter-sidebar {
  background: white;
  border: 2px solid #75aff0;
  border-radius: 12px;
  padding: 1rem;
  height: 100%;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e9ecef;
}

.sidebar-header h2 {
  font-family: "Kanit", sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.reset-btn {
  background: transparent;
  border: 1px solid #75aff0;
  color: #75aff0;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-family: "Kanit", sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background: #75aff0;
  color: white;
}

.filter-section {
  margin-bottom: 1rem;
}

.filter-section h3 {
  font-family: "Kanit", sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.selected-indicator {
  font-family: "Kanit", sans-serif;
  font-size: 0.65rem;
  color: #75aff0;
  font-weight: 500;
  margin-top: 0.3rem;
  padding: 0.3rem;
  background: rgba(117, 175, 240, 0.1);
  border-radius: 4px;
  text-align: center;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "Kanit", sans-serif;
  font-size: 0.75rem;
  color: #2c3e50;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 14px;
  height: 14px;
  cursor: pointer;
  accent-color: #75aff0;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.range-input {
  flex: 1;
  padding: 0.4rem 0.5rem;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-family: "Kanit", sans-serif;
  font-size: 0.75rem;
  color: #2c3e50;
  transition: border-color 0.2s ease;
}

.range-input:focus {
  outline: none;
  border-color: #75aff0;
}

.range-separator {
  font-family: "Kanit", sans-serif;
  color: #6c757d;
  font-weight: 500;
  font-size: 0.75rem;
}

.range-label {
  font-family: "Kanit", sans-serif;
  font-size: 0.65rem;
  color: #6c757d;
  margin-top: 0.3rem;
}

.filter-stats {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.stats-text {
  font-family: "Kanit", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  color: #75aff0;
  text-align: center;
}
</style>
