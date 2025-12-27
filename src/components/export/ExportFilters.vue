<template>
  <section class="data-filters">
    <div class="container">
      <h2 class="section-title">Customize Your Export</h2>

      <!-- City Selection -->
      <div class="filter-section">
        <label class="filter-label">Select City</label>
        <Dropdown
          :options="store.cityNames"
          :model-value="selectedCity"
          placeholder="Choose a city..."
          @change="$emit('city-change', $event)"
        />
      </div>

      <!-- Data Fields -->
      <div class="filter-section">
        <h3 class="subsection-title">Data Fields to Include</h3>
        <div class="checkboxes-grid">
          <label v-for="field in fieldOptions" :key="field.key" class="checkbox-label">
            <input
              type="checkbox"
              :checked="fields[field.key]"
              @change="$emit('field-change', field.key, $event.target.checked)"
              class="checkbox-input"
            />
            <span>{{ field.label }}</span>
          </label>
        </div>
      </div>

      <!-- Time Period -->
      <div class="filter-section">
        <h3 class="subsection-title">Time Period</h3>
        <div class="time-period-grid">
          <div v-for="period in timePeriods" :key="period.value" class="time-option">
            <label class="radio-label">
              <input
                type="radio"
                :value="period.value"
                :checked="selectedTimePeriod === period.value"
                @change="$emit('time-period-change', period.value)"
                class="radio-input"
              />
              <span>{{ period.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/**
 * Export Filters Component
 * City, fields, and time period selection
 */
import Dropdown from "../DropDown.vue"

export default {
  name: "ExportFilters",

  components: {
    Dropdown,
  },

  props: {
    store: {
      type: Object,
      required: true,
    },
    selectedCity: {
      type: [String, Number],
      default: null,
    },
    selectedTimePeriod: {
      type: String,
      default: "3months",
    },
    fields: {
      type: Object,
      required: true,
    },
  },

  emits: ["city-change", "time-period-change", "field-change"],

  data() {
    return {
      fieldOptions: [
        { key: "listingDetails", label: "Listing Details" },
        { key: "hostInfo", label: "Host Information" },
        { key: "pricing", label: "Pricing Data" },
        { key: "availability", label: "Availability" },
        { key: "reviews", label: "Reviews" },
        { key: "coordinates", label: "Geographic Coordinates" },
      ],
      timePeriods: [
        { value: "3months", label: "Last 3 Months" },
        { value: "6months", label: "Last 6 Months" },
        { value: "12months", label: "Last 12 Months" },
      ],
    }
  },
}
</script>

<style scoped>
.data-filters {
  padding: 4rem 0;
  background: #f8f9fa;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  font-family: "Kanit", sans-serif;
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.subsection-title {
  font-family: "Kanit", sans-serif;
  font-size: 1.5rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.filter-section {
  background: #fff;
  border: 3px solid #75aff0;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.filter-label {
  font-family: "Kanit", sans-serif;
  font-size: 1.125rem;
  font-weight: 500;
  color: #2c3e50;
  display: block;
  margin-bottom: 1rem;
}

.checkboxes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-family: "Kanit", sans-serif;
  font-size: 1rem;
  color: #2c3e50;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #75aff0;
}

.time-period-grid {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.time-option {
  flex: 1;
  min-width: 200px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-family: "Kanit", sans-serif;
  font-size: 1rem;
  color: #2c3e50;
}

.radio-input {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #75aff0;
}

@media (max-width: 768px) {
  .checkboxes-grid {
    grid-template-columns: 1fr;
  }

  .time-period-grid {
    flex-direction: column;
  }
}
</style>
