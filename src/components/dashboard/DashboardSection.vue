<template>
  <div class="dashboard-section">
    <DashboardHeader :city-name="cityName" :listings-count="listings.length" />

    <div class="dashboard-content">
      <DashboardKpis :kpis="kpis" />
      <DashboardAlerts :anomalies="anomalies" />
      <DashboardCharts :listings="listings" :city-name="cityName" />
      <DashboardShare :kpis="kpis" :city-name="cityName" :anomalies-count="anomalies.length" />
      <DashboardHosts :kpis="kpis" />
      <DashboardExport :listings="listings" :city-name="cityName" />
    </div>
  </div>
</template>

<script>
import DashboardHeader from "./DashboardHeader.vue"
import DashboardKpis from "./DashboardKpis.vue"
import DashboardAlerts from "./DashboardAlerts.vue"
import DashboardCharts from "./DashboardCharts.vue"
import DashboardShare from "./DashboardShare.vue"
import DashboardHosts from "./DashboardHosts.vue"
import DashboardExport from "./DashboardExport.vue"

export default {
  name: "DashboardSection",
  components: {
    DashboardHeader,
    DashboardKpis,
    DashboardAlerts,
    DashboardCharts,
    DashboardShare,
    DashboardHosts,
    DashboardExport
  },
  props: {
    cityName: {
      type: String,
      default: ""
    },
    listings: {
      type: Array,
      default: () => []
    },
    allListings: {
      type: Array,
      default: () => []
    }
  },
  emits: ["toggle-dashboard"],
  computed: {
    kpis() {
      const data = this.listings.length ? this.listings : []
      const totalListings = data.length

      const validPrices = data.filter((l) => l.price && l.price > 0)
      const avgPrice = validPrices.length
        ? Math.round(validPrices.reduce((sum, l) => sum + l.price, 0) / validPrices.length)
        : 0

      const hostCounts = {}
      data.forEach((l) => {
        if (l.host_id) {
          hostCounts[l.host_id] = (hostCounts[l.host_id] || 0) + 1
        }
      })
      const totalHosts = Object.keys(hostCounts).length

      const multiListingHosts = Object.values(hostCounts).filter((c) => c >= 2).length
      const singleListingHosts = totalHosts - multiListingHosts
      const multiListingPercent = totalHosts ? Math.round((multiListingHosts / totalHosts) * 100) : 0
      const maxListingsPerHost = Math.max(...Object.values(hostCounts), 0)

      const superhosts = data.filter((l) => l.is_superhost).length
      const superhostPercent = totalListings ? Math.round((superhosts / totalListings) * 100) : 0

      const estimatedRevenue = Math.round((avgPrice * 20 * totalListings) / 1000) * 1000

      return {
        totalListings,
        avgPrice,
        totalHosts,
        superhostPercent,
        multiListingHosts,
        singleListingHosts,
        multiListingPercent,
        maxListingsPerHost,
        estimatedRevenue
      }
    },
    anomalies() {
      return this.listings
        .filter((l) => l.availability && l.availability > 300)
        .sort((a, b) => b.availability - a.availability)
    }
  }
}
</script>

<style scoped>
.dashboard-section {
  background: white;
  border: 2px solid #75aff0;
  border-radius: 12px;
  height: calc(100vh - 100px);
  min-height: 500px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dashboard-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.dashboard-content::-webkit-scrollbar {
  width: 6px;
}

.dashboard-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.dashboard-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dashboard-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@media (max-width: 768px) {
  .dashboard-section {
    height: auto;
    min-height: auto;
  }
}
</style>
