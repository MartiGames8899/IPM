<template>
  <div class="dashboard-panel" :class="{ 'panel-visible': isVisible }">
    <div class="panel-header">
      <div class="header-left">
        <h2 class="panel-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="title-icon">
            <line x1="12" y1="20" x2="12" y2="10"/>
            <line x1="18" y1="20" x2="18" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="16"/>
          </svg>
          Dashboard: {{ cityName }}
        </h2>
      </div>
      <button class="close-btn" @click="$emit('close')" title="Fechar Dashboard">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div class="panel-content">
      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon listings-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">{{ formatNumber(kpis.totalListings) }}</span>
            <span class="kpi-label">Listagens</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon price-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">€{{ formatNumber(kpis.avgPrice) }}</span>
            <span class="kpi-label">Preço Médio</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon hosts-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">{{ formatNumber(kpis.totalHosts) }}</span>
            <span class="kpi-label">Hosts</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon availability-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">{{ kpis.avgAvailability }}</span>
            <span class="kpi-label">Disponib. (dias)</span>
          </div>
        </div>
      </div>

      <!-- Alertas Section (Maria Santos - Vereadora) -->
      <div v-if="anomalies.length > 0" class="alerts-section">
        <div class="section-header">
          <h3 class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="alert-icon">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Alertas de Anomalias
          </h3>
          <span class="alert-badge">{{ anomalies.length }}</span>
        </div>
        <div class="alerts-list">
          <div v-for="anomaly in anomalies.slice(0, 3)" :key="anomaly.id" class="alert-item">
            <div class="alert-top">
              <span class="alert-days">{{ anomaly.availability }}d</span>
              <span class="alert-price">€{{ anomaly.price }}</span>
            </div>
            <p class="alert-name">{{ anomaly.name }}</p>
            <span class="alert-location">{{ anomaly.neighbourhood }}</span>
          </div>
        </div>
        <button v-if="anomalies.length > 3" class="view-all-btn" @click="showAllAnomalies = !showAllAnomalies">
          {{ showAllAnomalies ? 'Ver menos' : `+${anomalies.length - 3} mais` }}
        </button>
      </div>

      <!-- Charts -->
      <div class="charts-section">
        <!-- Property Type Distribution -->
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Distribuição por Tipo</h3>
            <button class="chart-action-btn" @click="shareChart('propertyType')" title="Partilhar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </button>
          </div>
          <div class="chart-container">
            <canvas ref="propertyTypeChart"></canvas>
          </div>
        </div>

        <!-- Top Neighbourhoods -->
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Top 5 Bairros</h3>
            <button class="chart-action-btn" @click="shareChart('neighbourhood')" title="Partilhar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </button>
          </div>
          <div class="chart-container">
            <canvas ref="neighbourhoodChart"></canvas>
          </div>
        </div>

        <!-- Price Distribution -->
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Distribuição de Preços</h3>
            <button class="chart-action-btn" @click="shareChart('priceDistribution')" title="Partilhar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </button>
          </div>
          <div class="chart-container">
            <canvas ref="priceDistributionChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Quick Share Stats (António Costa - Ativista) -->
      <div class="share-stats-section">
        <h3 class="section-title">Estatísticas para Partilha</h3>
        <div class="share-cards">
          <div class="share-card" @click="copyStatistic('listings')">
            <div class="share-stat">
              <span class="share-value">{{ formatNumber(kpis.totalListings) }}</span>
              <span class="share-label">AL em {{ cityName }}</span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="copy-icon">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </div>

          <div class="share-card highlight" @click="copyStatistic('anomalies')">
            <div class="share-stat">
              <span class="share-value">{{ anomalies.length }}</span>
              <span class="share-label">Propriedades +300d</span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="copy-icon">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * DashboardPanel Component
 * Sliding panel with city analytics for the map view
 */
import Chart from "chart.js/auto"

export default {
  name: "DashboardPanel",

  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    cityName: {
      type: String,
      default: "",
    },
    listings: {
      type: Array,
      default: () => [],
    },
  },

  emits: ["close"],

  data() {
    return {
      showAllAnomalies: false,
      charts: {},
    }
  },

  computed: {
    kpis() {
      if (!this.listings.length) {
        return {
          totalListings: 0,
          avgPrice: 0,
          totalHosts: 0,
          avgAvailability: 0,
        }
      }

      const validPrices = this.listings.filter((l) => l.price && l.price > 0)
      const avgPrice = validPrices.length
        ? Math.round(validPrices.reduce((sum, l) => sum + l.price, 0) / validPrices.length)
        : 0

      const validAvailability = this.listings.filter((l) => l.availability != null)
      const avgAvailability = validAvailability.length
        ? Math.round(validAvailability.reduce((sum, l) => sum + l.availability, 0) / validAvailability.length)
        : 0

      const uniqueHosts = new Set(this.listings.map((l) => l.host_id).filter(Boolean))

      return {
        totalListings: this.listings.length,
        avgPrice,
        totalHosts: uniqueHosts.size,
        avgAvailability,
      }
    },

    anomalies() {
      return this.listings
        .filter((l) => l.availability && l.availability > 300)
        .sort((a, b) => b.availability - a.availability)
    },

    propertyTypeData() {
      const types = {}
      this.listings.forEach((l) => {
        const type = l.propertyTypeLabel || l.propertyType || "Outro"
        types[type] = (types[type] || 0) + 1
      })
      return types
    },

    neighbourhoodData() {
      const neighbourhoods = {}
      this.listings.forEach((l) => {
        const neighbourhood = l.neighbourhood || "Desconhecido"
        neighbourhoods[neighbourhood] = (neighbourhoods[neighbourhood] || 0) + 1
      })
      return Object.entries(neighbourhoods)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})
    },

    priceRanges() {
      const ranges = {
        "€0-50": 0,
        "€51-100": 0,
        "€101-150": 0,
        "€151-200": 0,
        "€201+": 0,
      }

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
  },

  watch: {
    isVisible(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.renderCharts()
        })
      }
    },

    listings: {
      handler() {
        if (this.isVisible) {
          this.$nextTick(() => {
            this.renderCharts()
          })
        }
      },
      deep: true,
    },
  },

  beforeUnmount() {
    Object.values(this.charts).forEach((chart) => {
      if (chart) chart.destroy()
    })
  },

  methods: {
    formatNumber(num) {
      return num >= 1000 ? num.toLocaleString("pt-PT") : num
    },

    renderCharts() {
      if (!this.listings.length) return

      this.renderPropertyTypeChart()
      this.renderNeighbourhoodChart()
      this.renderPriceDistributionChart()
    },

    renderPropertyTypeChart() {
      const ctx = this.$refs.propertyTypeChart
      if (!ctx) return

      if (this.charts.propertyType) {
        this.charts.propertyType.destroy()
      }

      const data = this.propertyTypeData
      const colors = ["#3d8adf", "#75aff0", "#a8d0f5", "#d4e8fb"]

      this.charts.propertyType = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: Object.keys(data),
          datasets: [
            {
              data: Object.values(data),
              backgroundColor: colors,
              borderWidth: 2,
              borderColor: "#fff",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 10,
                font: { family: "Kanit", size: 10 },
              },
            },
          },
        },
      })
    },

    renderNeighbourhoodChart() {
      const ctx = this.$refs.neighbourhoodChart
      if (!ctx) return

      if (this.charts.neighbourhood) {
        this.charts.neighbourhood.destroy()
      }

      const data = this.neighbourhoodData

      this.charts.neighbourhood = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(data),
          datasets: [
            {
              label: "Listagens",
              data: Object.values(data),
              backgroundColor: "#3d8adf",
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: "y",
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { family: "Kanit", size: 9 } },
            },
            y: {
              grid: { display: false },
              ticks: { font: { family: "Kanit", size: 9 } },
            },
          },
        },
      })
    },

    renderPriceDistributionChart() {
      const ctx = this.$refs.priceDistributionChart
      if (!ctx) return

      if (this.charts.priceDistribution) {
        this.charts.priceDistribution.destroy()
      }

      const data = this.priceRanges

      this.charts.priceDistribution = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(data),
          datasets: [
            {
              label: "Listagens",
              data: Object.values(data),
              backgroundColor: "#75aff0",
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { family: "Kanit", size: 9 } },
            },
            y: {
              grid: { color: "#f0f0f0" },
              ticks: { font: { family: "Kanit", size: 9 } },
            },
          },
        },
      })
    },

    shareChart(chartName) {
      const chart = this.charts[chartName]
      if (chart) {
        const link = document.createElement("a")
        link.download = `${chartName}-${this.cityName}.png`
        link.href = chart.toBase64Image()
        link.click()
      }
    },

    copyStatistic(type) {
      const text = {
        listings: `${this.formatNumber(this.kpis.totalListings)} alojamentos locais em ${this.cityName}`,
        anomalies: `${this.anomalies.length} propriedades com +300 dias de ocupação em ${this.cityName}`,
      }

      navigator.clipboard.writeText(text[type])
      alert("Estatística copiada!")
    },
  },
}
</script>

<style scoped>
.dashboard-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 420px;
  height: 100%;
  background: #fff;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 500;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-visible {
  transform: translateX(0);
}

.panel-header {
  padding: 16px 20px;
  border-bottom: 2px solid #75aff0;
  background: linear-gradient(135deg, #c0daf8 0%, #e8f1fc 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.header-left {
  flex: 1;
}

.panel-title {
  font-family: "Kanit", sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  width: 20px;
  height: 20px;
  color: #3d8adf;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #fff;
  transform: scale(1.05);
}

.close-btn svg {
  width: 18px;
  height: 18px;
  color: #6c757d;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.kpi-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #e9ecef;
}

.kpi-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-icon svg {
  width: 20px;
  height: 20px;
}

.listings-icon {
  background: rgba(61, 138, 223, 0.1);
  color: #3d8adf;
}

.price-icon {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.hosts-icon {
  background: rgba(155, 89, 182, 0.1);
  color: #9b59b6;
}

.availability-icon {
  background: rgba(241, 196, 15, 0.1);
  color: #f1c40f;
}

.kpi-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.kpi-value {
  font-family: "Kanit", sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.1;
}

.kpi-label {
  font-family: "Kanit", sans-serif;
  font-size: 0.7rem;
  color: #6c757d;
}

/* Alerts Section */
.alerts-section {
  background: #fef2f2;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid #fecaca;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-family: "Kanit", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.alert-icon {
  width: 18px;
  height: 18px;
  color: #e74c3c;
}

.alert-badge {
  background: #e74c3c;
  color: #fff;
  padding: 2px 8px;
  border-radius: 12px;
  font-family: "Kanit", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.alert-item {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #fecaca;
}

.alert-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.alert-days {
  font-family: "Kanit", sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: #e74c3c;
}

.alert-price {
  font-family: "Kanit", sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #2c3e50;
}

.alert-name {
  font-family: "Kanit", sans-serif;
  font-size: 0.8rem;
  color: #2c3e50;
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.alert-location {
  font-family: "Kanit", sans-serif;
  font-size: 0.7rem;
  color: #6c757d;
}

.view-all-btn {
  width: 100%;
  margin-top: 10px;
  padding: 8px;
  background: transparent;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  color: #e74c3c;
  font-family: "Kanit", sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  background: #e74c3c;
  color: #fff;
}

/* Charts Section */
.charts-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.chart-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e9ecef;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.chart-title {
  font-family: "Kanit", sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.chart-action-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.chart-action-btn:hover {
  background: #f8f9fa;
  border-color: #3d8adf;
}

.chart-action-btn svg {
  width: 14px;
  height: 14px;
  color: #6c757d;
}

.chart-action-btn:hover svg {
  color: #3d8adf;
}

.chart-container {
  height: 200px;
  position: relative;
}

/* Share Stats Section */
.share-stats-section {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e9ecef;
}

.share-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.share-card {
  background: linear-gradient(135deg, #3d8adf 0%, #75aff0 100%);
  border-radius: 10px;
  padding: 16px;
  color: #fff;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.share-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(61, 138, 223, 0.3);
}

.share-card.highlight {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.share-card.highlight:hover {
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.share-stat {
  display: flex;
  flex-direction: column;
}

.share-value {
  font-family: "Kanit", sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.1;
}

.share-label {
  font-family: "Kanit", sans-serif;
  font-size: 0.8rem;
  opacity: 0.9;
}

.copy-icon {
  width: 20px;
  height: 20px;
  opacity: 0.8;
}

/* Scrollbar */
.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.panel-content::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-panel {
    width: 100%;
  }
}
</style>
