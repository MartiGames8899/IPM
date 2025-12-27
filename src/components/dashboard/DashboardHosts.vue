<template>
  <div class="host-analysis">
    <div class="section-header">
      <h3 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="section-icon">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        Host Analysis
      </h3>
    </div>
    <div class="host-stats">
      <div class="host-stat-card">
        <div class="stat-header">
          <span class="stat-label">Single-listing hosts</span>
          <span class="stat-badge good">Individual</span>
        </div>
        <div class="stat-bar">
          <div class="stat-fill good" :style="{ width: (100 - kpis.multiListingPercent) + '%' }"></div>
        </div>
        <span class="stat-value">{{ formatNumber(kpis.singleListingHosts) }} hosts ({{ 100 - kpis.multiListingPercent }}%)</span>
      </div>
      <div class="host-stat-card">
        <div class="stat-header">
          <span class="stat-label">Multi-listing hosts (2+)</span>
          <span class="stat-badge warning">Commercial</span>
        </div>
        <div class="stat-bar">
          <div class="stat-fill warning" :style="{ width: kpis.multiListingPercent + '%' }"></div>
        </div>
        <span class="stat-value">{{ formatNumber(kpis.multiListingHosts) }} hosts ({{ kpis.multiListingPercent }}%)</span>
      </div>
      <div class="host-stat-card highlight">
        <div class="stat-header">
          <span class="stat-label">Top host listings</span>
          <span class="stat-badge danger">High concentration</span>
        </div>
        <span class="stat-value large">{{ kpis.maxListingsPerHost }} listings</span>
        <span class="stat-sublabel">by a single host</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardHosts",
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
.host-analysis {
  background: #f8fafc;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 20px;
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

.host-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.host-stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e2e8f0;
}

.host-stat-card.highlight {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #f59e0b;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stat-label {
  font-family: "Kanit", sans-serif;
  font-size: 0.75rem;
  color: #64748b;
}

.stat-badge {
  font-family: "Kanit", sans-serif;
  font-size: 0.6rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.stat-badge.good {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.stat-badge.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-badge.danger {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.stat-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  margin-bottom: 6px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.stat-fill.good {
  background: #10b981;
}

.stat-fill.warning {
  background: #f59e0b;
}

.stat-value {
  font-family: "Kanit", sans-serif;
  font-size: 0.75rem;
  color: #1e293b;
  font-weight: 500;
}

.stat-value.large {
  font-size: 1.25rem;
  font-weight: 700;
}

.stat-sublabel {
  font-family: "Kanit", sans-serif;
  font-size: 0.65rem;
  color: #64748b;
}
</style>
