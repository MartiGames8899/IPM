<template>
  <div class="export-section">
    <div class="section-header">
      <h3 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="section-icon">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        Export Data
      </h3>
    </div>
    <div class="export-buttons">
      <button class="export-btn" @click="exportData('csv')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        Export CSV
      </button>
      <button class="export-btn" @click="exportData('json')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        Export JSON
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardExport",
  props: {
    listings: {
      type: Array,
      default: () => []
    },
    cityName: {
      type: String,
      default: ""
    }
  },
  methods: {
    exportData(format) {
      const data = this.listings.map((l) => ({
        id: l.id,
        name: l.name,
        neighbourhood: l.neighbourhood,
        price: l.price,
        availability: l.availability,
        property_type: l.propertyTypeLabel,
        host_id: l.host_id,
        host_name: l.host_name,
        is_superhost: l.is_superhost,
        rating: l.rating,
        reviews: l.reviews
      }))

      let content, mimeType, extension

      if (format === "csv") {
        const headers = Object.keys(data[0] || {}).join(",")
        const rows = data.map((row) => Object.values(row).map((v) => `"${v || ""}"`).join(","))
        content = [headers, ...rows].join("\n")
        mimeType = "text/csv"
        extension = "csv"
      } else {
        content = JSON.stringify(data, null, 2)
        mimeType = "application/json"
        extension = "json"
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${this.cityName}-listings.${extension}`
      link.click()
      URL.revokeObjectURL(url)
    }
  }
}
</script>

<style scoped>
.export-section {
  background: #f8fafc;
  border-radius: 10px;
  padding: 14px;
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-family: "Kanit", sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-icon {
  width: 16px;
  height: 16px;
  color: #3d8adf;
}

.export-buttons {
  display: flex;
  gap: 10px;
}

.export-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: "Kanit", sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-btn:hover {
  background: #3d8adf;
  border-color: #3d8adf;
  color: #fff;
}

.export-btn svg {
  width: 18px;
  height: 18px;
}
</style>
