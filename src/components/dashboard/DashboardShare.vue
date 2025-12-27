<template>
  <div class="share-section">
    <div class="section-header">
      <h3 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="share-icon">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        Quick Stats for Sharing
      </h3>
    </div>
    <div class="share-cards">
      <div class="share-card" @click="copyStatistic('total')">
        <div class="share-content">
          <span class="share-value">{{ formatNumber(kpis.totalListings) }}</span>
          <span class="share-label">Short-term rentals in {{ cityName }}</span>
        </div>
        <div class="share-action">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <span>Copy</span>
        </div>
      </div>

      <div class="share-card highlight" @click="copyStatistic('anomalies')">
        <div class="share-content">
          <span class="share-value">{{ anomaliesCount }}</span>
          <span class="share-label">Properties with +300 days occupancy</span>
        </div>
        <div class="share-action">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <span>Copy</span>
        </div>
      </div>

      <div class="share-card" @click="copyStatistic('revenue')">
        <div class="share-content">
          <span class="share-value">€{{ formatNumber(kpis.estimatedRevenue) }}</span>
          <span class="share-label">Est. monthly market revenue</span>
        </div>
        <div class="share-action">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <span>Copy</span>
        </div>
      </div>

      <div class="share-card" @click="copyStatistic('hosts')">
        <div class="share-content">
          <span class="share-value">{{ kpis.multiListingPercent }}%</span>
          <span class="share-label">Multi-listing hosts (commercial)</span>
        </div>
        <div class="share-action">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <span>Copy</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardShare",
  props: {
    kpis: {
      type: Object,
      required: true
    },
    cityName: {
      type: String,
      default: ""
    },
    anomaliesCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    formatNumber(num) {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
      if (num >= 1000) return (num / 1000).toFixed(1) + "K"
      return num
    },
    copyStatistic(type) {
      const texts = {
        total: `${this.formatNumber(this.kpis.totalListings)} short-term rentals in ${this.cityName}`,
        anomalies: `${this.anomaliesCount} properties in ${this.cityName} have 300+ days/year availability - likely full-time rentals removed from the housing market`,
        revenue: `Estimated monthly market revenue of €${this.formatNumber(this.kpis.estimatedRevenue)} from short-term rentals in ${this.cityName}`,
        hosts: `${this.kpis.multiListingPercent}% of hosts in ${this.cityName} operate multiple listings (commercial operators)`
      }
      navigator.clipboard.writeText(texts[type])
      alert("Statistic copied to clipboard!")
    }
  }
}
</script>

<style scoped>
.share-section {
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

.share-icon {
  width: 16px;
  height: 16px;
  color: #3d8adf;
}

.share-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.share-card {
  background: linear-gradient(135deg, #3d8adf 0%, #60a5fa 100%);
  border-radius: 10px;
  padding: 14px;
  color: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.share-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(61, 138, 223, 0.3);
}

.share-card.highlight {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
}

.share-card.highlight:hover {
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.share-content {
  display: flex;
  flex-direction: column;
}

.share-value {
  font-family: "Kanit", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.1;
}

.share-label {
  font-family: "Kanit", sans-serif;
  font-size: 0.7rem;
  opacity: 0.9;
}

.share-action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: "Kanit", sans-serif;
  font-size: 0.7rem;
  opacity: 0.8;
}

.share-action svg {
  width: 14px;
  height: 14px;
}

@media (max-width: 1200px) {
  .share-cards {
    grid-template-columns: 1fr;
  }
}
</style>
