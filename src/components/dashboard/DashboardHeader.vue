<template>
  <div class="dashboard-header">
    <div class="header-content">
      <h2 class="dashboard-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="title-icon">
          <line x1="12" y1="20" x2="12" y2="10"/>
          <line x1="18" y1="20" x2="18" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="16"/>
        </svg>
        {{ cityName }} Analytics
      </h2>
      <p class="dashboard-subtitle">{{ listingsCount.toLocaleString() }} listings analyzed</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardHeader",
  props: {
    cityName: {
      type: String,
      default: ""
    },
    listingsCount: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
.dashboard-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #c0daf8 0%, #e8f1fc 100%);
  flex-shrink: 0;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dashboard-title {
  font-family: "Kanit", sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
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

.dashboard-subtitle {
  font-family: "Kanit", sans-serif;
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
}
</style>
