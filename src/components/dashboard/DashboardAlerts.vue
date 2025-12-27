<template>
  <div v-if="anomalies.length > 0" class="alerts-section">
    <div class="section-header">
      <h3 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="alert-icon">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        Anomaly Alerts (+300 days/year)
      </h3>
      <span class="alert-badge">{{ anomalies.length }}</span>
    </div>
    <div class="alerts-list">
      <div v-for="anomaly in displayedAnomalies" :key="anomaly.id" class="alert-item">
        <div class="alert-top">
          <span class="alert-days">{{ anomaly.availability }}d</span>
          <span class="alert-price">€{{ anomaly.price }}/night</span>
        </div>
        <p class="alert-name">{{ anomaly.name }}</p>
        <span class="alert-location">{{ anomaly.neighbourhood }}</span>
      </div>
    </div>
    <button v-if="anomalies.length > 3" class="view-more-btn" @click="toggleShowAll">
      {{ showAll ? 'Show less' : `View all ${anomalies.length} alerts` }}
    </button>
  </div>
</template>

<script>
export default {
  name: "DashboardAlerts",
  props: {
    anomalies: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showAll: false
    }
  },
  computed: {
    displayedAnomalies() {
      return this.showAll ? this.anomalies : this.anomalies.slice(0, 3)
    }
  },
  methods: {
    toggleShowAll() {
      this.showAll = !this.showAll
    }
  }
}
</script>

<style scoped>
.alerts-section {
  background: #fef2f2;
  border-radius: 10px;
  padding: 14px;
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
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.alert-icon {
  width: 16px;
  height: 16px;
  color: #ef4444;
}

.alert-badge {
  background: #ef4444;
  color: #fff;
  padding: 2px 8px;
  border-radius: 10px;
  font-family: "Kanit", sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-item {
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  border: 1px solid #fecaca;
}

.alert-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.alert-days {
  font-family: "Kanit", sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  color: #ef4444;
}

.alert-price {
  font-family: "Kanit", sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #1e293b;
}

.alert-name {
  font-family: "Kanit", sans-serif;
  font-size: 0.75rem;
  color: #1e293b;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.alert-location {
  font-family: "Kanit", sans-serif;
  font-size: 0.65rem;
  color: #64748b;
}

.view-more-btn {
  width: 100%;
  margin-top: 10px;
  padding: 8px;
  background: transparent;
  border: 1px solid #ef4444;
  border-radius: 6px;
  color: #ef4444;
  font-family: "Kanit", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-more-btn:hover {
  background: #ef4444;
  color: #fff;
}
</style>
