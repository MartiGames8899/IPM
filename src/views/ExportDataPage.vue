<template>
  <div class="export-data-page">
    <ExportHeader />
    
    <ExportFormats 
      :is-exporting="store.isExporting"
      :exporting-format="exportingFormat"
      @export="handleExport" 
    />
    
    <ExportFilters
      :store="store"
      :selected-city="selectedCity"
      :selected-time-period="selectedTimePeriod"
      :fields="fields"
      @city-change="handleCityChange"
      @time-period-change="selectedTimePeriod = $event"
      @field-change="handleFieldChange"
    />
    
    <ExportPreview 
      :preview-data="store.exportPreviewData"
      :is-loading="store.isPreviewLoading"
      :city-name="selectedCity"
      :selected-fields="fields"
    />

    <Toast
      v-model="showSuccessToast"
      type="success"
      :title="successTitle"
      :message="successMessage"
      :duration="5000"
    />

    <Toast
      v-model="showErrorToast"
      type="error"
      :title="errorTitle"
      :message="errorMessage"
      :duration="6000"
    />

    <Toast
      v-model="showWarningToast"
      type="warning"
      title="Missing Selection"
      :message="warningMessage"
      :duration="4000"
    />
  </div>
</template>

<script>
import ExportHeader from "../components/export/ExportHeader.vue"
import ExportFormats from "../components/export/ExportFormats.vue"
import ExportFilters from "../components/export/ExportFilters.vue"
import ExportPreview from "../components/export/ExportPreview.vue"
import Toast from "../components/Toast.vue"
import { useDataStore } from "../stores/data.js"

export default {
  name: "ExportDataPage",

  components: {
    ExportHeader,
    ExportFormats,
    ExportFilters,
    ExportPreview,
    Toast,
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
      exportingFormat: null,
      showSuccessToast: false,
      showErrorToast: false,
      showWarningToast: false,
      successTitle: "",
      successMessage: "",
      errorTitle: "",
      errorMessage: "",
      warningMessage: "",
    }
  },

  watch: {
    selectedCity: {
      handler(newCity) {
        if (newCity) {
          this.updatePreview()
        }
      },
    },
    fields: {
      deep: true,
      handler() {
        if (this.selectedCity) {
          this.updatePreview()
        }
      },
    },
  },

  mounted() {
    if (this.store.citiesData.length === 0) {
      this.store.loadCities()
    }
  },

  methods: {
    handleCityChange(cityName) {
      this.selectedCity = cityName
    },

    handleFieldChange(fieldName, value) {
      this.fields[fieldName] = value
    },

    updatePreview() {
      this.store.fetchExportPreview(this.selectedCity, this.fields, this.selectedTimePeriod)
    },

    async handleExport(format) {
      if (!this.selectedCity) {
        this.warningMessage = "Please select a city before exporting data."
        this.showWarningToast = true
        return
      }

      const hasSelectedFields = Object.values(this.fields).some((v) => v)
      if (!hasSelectedFields) {
        this.warningMessage = "Please select at least one data field to include in the export."
        this.showWarningToast = true
        return
      }

      this.exportingFormat = format

      try {
        const result = await this.store.exportData(
          format,
          this.selectedCity,
          this.fields,
          this.selectedTimePeriod
        )

        this.successTitle = "Export Successful!"
        this.successMessage = `Downloaded ${result.count.toLocaleString()} records from ${this.selectedCity} in ${format.toUpperCase()} format.`
        this.showSuccessToast = true

      } catch (error) {
        this.errorTitle = "Export Failed"
        this.errorMessage = error.message || "An unexpected error occurred. Please try again."
        this.showErrorToast = true

      } finally {
        this.exportingFormat = null
      }
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
