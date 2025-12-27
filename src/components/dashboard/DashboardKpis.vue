<template>
  <div class="kpi-section">
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
          <span class="kpi-label">Total Listings</span>
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
          <span class="kpi-label">Avg. Price/Night</span>
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
          <span class="kpi-label">Unique Hosts</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon superhost-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <div class="kpi-content">
          <span class="kpi-value">{{ kpis.superhostPercent }}%</span>
          <span class="kpi-label">Superhosts</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardKpis",
  props: {
    kpis: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatNumber(num) {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
      if (num >= 1000) return (num / 1000).toFixed(1) + "K"
      return num
    }
  }
}
</script>

<style scoped>
.kpi-section {
  margin-bottom: 20px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.kpi-card {
  background: #f8fafc;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #e2e8f0;
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
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.hosts-icon {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.superhost-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.kpi-content {
  display: flex;
  flex-direction: column;
}

.kpi-value {
  font-family: "Kanit", sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.1;
}

.kpi-label {
  font-family: "Kanit", sans-serif;
  font-size: 0.7rem;
  color: #64748b;
}
</style>
