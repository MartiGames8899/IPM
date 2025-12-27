<template>
  <div class="hero-stats">
    <template v-for="(stat, index) in stats" :key="stat.label">
      <div class="stat-item">
        <span class="stat-number">{{ stat.number }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </div>
      <div v-if="index < stats.length - 1" class="stat-divider"></div>
    </template>
  </div>
</template>

<script>
/**
 * Hero Stats Component
 * Displays statistics in the hero section
 */
export default {
  name: "HeroStats",

  props: {
    stats: {
      type: Array,
      required: true,
      validator: (stats) => stats.every((s) => s.number !== undefined && s.label),
    },
  },
}
</script>

<style scoped>
.hero-stats {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  max-width: fit-content;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-family: "Kanit", sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #3d8adf;
}

.stat-label {
  font-family: "Kanit", sans-serif;
  font-size: 0.65rem;
  font-weight: 400;
  color: #6c757d;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: #e0e0e0;
}

@media (max-width: 768px) {
  .hero-stats {
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style>
