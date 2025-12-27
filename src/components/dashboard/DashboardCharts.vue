<template>
  <div class="charts-grid">
    <div class="chart-card">
      <div class="chart-header">
        <h3 class="chart-title">Property Types</h3>
        <button class="chart-action" @click="downloadChart('propertyType')" title="Download chart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
      </div>
      <div class="chart-container">
        <canvas ref="propertyTypeChart"></canvas>
      </div>
      <div class="chart-legend">
        <div v-for="(item, index) in propertyTypeLegend" :key="item.label" class="legend-item">
          <span class="legend-dot" :style="{ background: chartColors[index] }"></span>
          <span class="legend-label">{{ item.label }}</span>
          <span class="legend-value">{{ item.percent }}%</span>
        </div>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-header">
        <h3 class="chart-title">Top 5 Neighbourhoods</h3>
        <button class="chart-action" @click="downloadChart('neighbourhood')" title="Download chart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
      </div>
      <div class="chart-container">
        <canvas ref="neighbourhoodChart"></canvas>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-header">
        <h3 class="chart-title">Price Distribution</h3>
        <button class="chart-action" @click="downloadChart('priceDistribution')" title="Download chart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
      </div>
      <div class="chart-container">
        <canvas ref="priceDistributionChart"></canvas>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-header">
        <h3 class="chart-title">Availability (days/year)</h3>
        <button class="chart-action" @click="downloadChart('availability')" title="Download chart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
      </div>
      <div class="chart-container">
        <canvas ref="availabilityChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto"

export default {
  name: "DashboardCharts",
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
  data() {
    return {
      charts: {},
      chartColors: ["#3d8adf", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
    }
  },
  computed: {
    propertyTypeData() {
      const types = {}
      this.listings.forEach((l) => {
        const type = l.propertyTypeLabel || l.propertyType || "Other"
        types[type] = (types[type] || 0) + 1
      })
      return types
    },
    propertyTypeLegend() {
      const total = this.listings.length || 1
      return Object.entries(this.propertyTypeData).map(([label, count]) => ({
        label,
        count,
        percent: Math.round((count / total) * 100)
      }))
    },
    neighbourhoodData() {
      const neighbourhoods = {}
      this.listings.forEach((l) => {
        const neighbourhood = l.neighbourhood || "Unknown"
        neighbourhoods[neighbourhood] = (neighbourhoods[neighbourhood] || 0) + 1
      })
      return Object.entries(neighbourhoods)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})
    },
    priceRanges() {
      const ranges = { "€0-50": 0, "€51-100": 0, "€101-150": 0, "€151-200": 0, "€201+": 0 }
      this.listings.forEach((l) => {
        const price = l.price || 0
        if (price <= 50) ranges["€0-50"]++
        else if (price <= 100) ranges["€51-100"]++
        else if (price <= 150) ranges["€101-150"]++
        else if (price <= 200) ranges["€151-200"]++
        else ranges["€201+"]++
      })
      return ranges
    },
    availabilityRanges() {
      const ranges = { "0-60": 0, "61-120": 0, "121-180": 0, "181-300": 0, "300+": 0 }
      this.listings.forEach((l) => {
        const avail = l.availability || 0
        if (avail <= 60) ranges["0-60"]++
        else if (avail <= 120) ranges["61-120"]++
        else if (avail <= 180) ranges["121-180"]++
        else if (avail <= 300) ranges["181-300"]++
        else ranges["300+"]++
      })
      return ranges
    }
  },
  watch: {
    listings: {
      handler() {
        this.$nextTick(() => this.renderCharts())
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => this.renderCharts())
  },
  beforeUnmount() {
    Object.values(this.charts).forEach((chart) => chart?.destroy())
  },
  methods: {
    renderCharts() {
      if (!this.listings.length) return
      this.renderPropertyTypeChart()
      this.renderNeighbourhoodChart()
      this.renderPriceDistributionChart()
      this.renderAvailabilityChart()
    },
    renderPropertyTypeChart() {
      const ctx = this.$refs.propertyTypeChart
      if (!ctx) return
      if (this.charts.propertyType) this.charts.propertyType.destroy()

      this.charts.propertyType = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: Object.keys(this.propertyTypeData),
          datasets: [{
            data: Object.values(this.propertyTypeData),
            backgroundColor: this.chartColors,
            borderWidth: 3,
            borderColor: "#fff"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "65%",
          plugins: { legend: { display: false } }
        }
      })
    },
    renderNeighbourhoodChart() {
      const ctx = this.$refs.neighbourhoodChart
      if (!ctx) return
      if (this.charts.neighbourhood) this.charts.neighbourhood.destroy()

      this.charts.neighbourhood = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(this.neighbourhoodData),
          datasets: [{
            data: Object.values(this.neighbourhoodData),
            backgroundColor: "#3d8adf",
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: "y",
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { family: "Kanit", size: 10 } } },
            y: { grid: { display: false }, ticks: { font: { family: "Kanit", size: 10 } } }
          }
        }
      })
    },
    renderPriceDistributionChart() {
      const ctx = this.$refs.priceDistributionChart
      if (!ctx) return
      if (this.charts.priceDistribution) this.charts.priceDistribution.destroy()

      this.charts.priceDistribution = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(this.priceRanges),
          datasets: [{
            data: Object.values(this.priceRanges),
            backgroundColor: "#10b981",
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { family: "Kanit", size: 10 } } },
            y: { grid: { color: "#f0f0f0" }, ticks: { font: { family: "Kanit", size: 10 } } }
          }
        }
      })
    },
    renderAvailabilityChart() {
      const ctx = this.$refs.availabilityChart
      if (!ctx) return
      if (this.charts.availability) this.charts.availability.destroy()

      this.charts.availability = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(this.availabilityRanges),
          datasets: [{
            data: Object.values(this.availabilityRanges),
            backgroundColor: ["#10b981", "#22c55e", "#f59e0b", "#f97316", "#ef4444"],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { family: "Kanit", size: 10 } } },
            y: { grid: { color: "#f0f0f0" }, ticks: { font: { family: "Kanit", size: 10 } } }
          }
        }
      })
    },
    downloadChart(chartName) {
      const chart = this.charts[chartName]
      if (chart) {
        const link = document.createElement("a")
        link.download = `${this.cityName}-${chartName}.png`
        link.href = chart.toBase64Image()
        link.click()
      }
    }
  }
}
</script>

<style scoped>
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.chart-card {
  background: #fff;
  border-radius: 10px;
  padding: 14px;
  border: 1px solid #e2e8f0;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.chart-title {
  font-family: "Kanit", sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.chart-action {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.chart-action:hover {
  background: #f1f5f9;
  border-color: #3d8adf;
}

.chart-action svg {
  width: 14px;
  height: 14px;
  color: #64748b;
}

.chart-action:hover svg {
  color: #3d8adf;
}

.chart-container {
  height: 160px;
  position: relative;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: "Kanit", sans-serif;
  font-size: 0.65rem;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-label {
  color: #64748b;
}

.legend-value {
  color: #1e293b;
  font-weight: 600;
}

@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
