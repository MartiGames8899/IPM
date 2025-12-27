<template>
  <div class="export-data-page">
    <ExportHeader />
    <ExportFormats @export="handleExport" />
    <ExportFilters
      :store="store"
      :selected-city="selectedCity"
      :selected-time-period="selectedTimePeriod"
      :fields="fields"
      @city-change="handleCityChange"
      @time-period-change="selectedTimePeriod = $event"
      @field-change="handleFieldChange"
    />
    <ExportPreview />
  </div>
</template>

<script>
/**
 * Export Data Page View
 * Data export functionality with format selection and filters
 */
import ExportHeader from "../components/export/ExportHeader.vue"
import ExportFormats from "../components/export/ExportFormats.vue"
import ExportFilters from "../components/export/ExportFilters.vue"
import ExportPreview from "../components/export/ExportPreview.vue"
import { useDataStore } from "../stores/data.js"

export default {
  name: "ExportDataPage",

  components: {
    ExportHeader,
    ExportFormats,
    ExportFilters,
    ExportPreview,
  },

  setup() {
    const store = useDataStore()
    return { store }
  },

  data() {
    return {
      selectedCity: null,
      selectedTimePeriod: "3months",
      fields: {
        listingDetails: true,
        hostInfo: true,
        pricing: true,
        availability: true,
        reviews: false,
        coordinates: true,
      },
    }
  },

  methods: {
    handleCityChange(cityId) {
      this.selectedCity = cityId
    },

    handleFieldChange(fieldName, value) {
      this.fields[fieldName] = value
    },

    handleExport(format) {
      console.log(`Exporting ${format} format with:`, {
        city: this.selectedCity,
        timePeriod: this.selectedTimePeriod,
        fields: this.fields,
      })
    },
  },
}
</script>

<style scoped>
.export-data-page {
  padding-top: 60px;
  min-height: 100vh;
}
</style>
