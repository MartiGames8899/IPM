<template>
  <section class="data-preview">
    <div class="container">
      <div class="preview-header">
        <h2 class="section-title">Data Preview</h2>
        <div v-if="cityName" class="preview-status">
          <span class="status-city">{{ cityName }}</span>
          <span class="status-count">{{ previewData.length }} sample records</span>
        </div>
      </div>

      <div v-if="isLoading" class="preview-loading">
        <div class="loading-spinner"></div>
        <p>Loading preview data...</p>
      </div>

      <div v-else-if="!cityName" class="preview-empty">
        <div class="empty-icon">📋</div>
        <p class="empty-text">Select a city above to preview the export data</p>
      </div>

      <div v-else-if="previewData.length === 0" class="preview-empty">
        <div class="empty-icon">📭</div>
        <p class="empty-text">No data available for the selected filters</p>
      </div>

      <div v-else class="preview-table">
        <table>
          <thead>
            <tr>
              <th v-for="header in tableHeaders" :key="header.key">{{ header.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in previewData" :key="row.id">
              <td v-for="header in tableHeaders" :key="header.key">
                {{ formatValue(row[header.key]) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="previewData.length > 0" class="preview-footer">
        <p class="footer-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="info-icon">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          Showing first 5 records. Full export will include all matching data.
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ExportPreview",

  props: {
    previewData: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    cityName: {
      type: String,
      default: null,
    },
    selectedFields: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    tableHeaders() {
      if (this.previewData.length === 0) return []

      const fieldLabels = {
        id: "Listing ID",
        name: "Name",
        type: "Property Type",
        price: "Price",
        availability: "Availability",
        host: "Host",
        rating: "Rating",
        coordinates: "Coordinates",
      }

      return Object.keys(this.previewData[0]).map((key) => ({
        key,
        label: fieldLabels[key] || key,
      }))
    },
  },

  methods: {
    formatValue(value) {
      if (value === null || value === undefined) return "—"
      return value
    },
  },
}
</script>

<style scoped>
.data-preview {
  padding: 4rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-family: "Kanit", sans-serif;
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.preview-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-city {
  background: #75aff0;
  color: #fff;
  padding: 6px 16px;
  border-radius: 20px;
  font-family: "Kanit", sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-count {
  font-family: "Kanit", sans-serif;
  font-size: 0.9rem;
  color: #6c757d;
}

.preview-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: #fff;
  border: 3px solid #75aff0;
  border-radius: 20px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e9ecef;
  border-top-color: #75aff0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.preview-loading p {
  font-family: "Kanit", sans-serif;
  font-size: 1rem;
  color: #6c757d;
}

.preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: #fff;
  border: 3px dashed #c0daf8;
  border-radius: 20px;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-family: "Kanit", sans-serif;
  font-size: 1.125rem;
  color: #6c757d;
  text-align: center;
}

.preview-table {
  background: #fff;
  border: 3px solid #75aff0;
  border-radius: 20px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #75aff0;
}

th {
  font-family: "Kanit", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  padding: 1.25rem;
  text-align: left;
  white-space: nowrap;
}

td {
  font-family: "Kanit", sans-serif;
  font-size: 0.95rem;
  font-weight: 300;
  color: #2c3e50;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e9ecef;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background: #f8f9fa;
}

.preview-footer {
  margin-top: 1.5rem;
}

.footer-note {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Kanit", sans-serif;
  font-size: 0.9rem;
  color: #6c757d;
}

.info-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .preview-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .preview-table {
    overflow-x: auto;
  }

  table {
    min-width: 600px;
  }

  .section-title {
    font-size: 1.5rem;
  }
}
</style>
