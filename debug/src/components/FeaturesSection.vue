<template>
  <section class="features-section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <span class="section-tag">Why Choose Us</span>
        <h2 class="section-title">Powerful Data Tools</h2>
      </div>

      <!-- Features Grid -->
      <div class="features-grid">
        <FeatureCard
          v-for="feature in features"
          :key="feature.title"
          :icon="feature.icon"
          :title="feature.title"
          :description="feature.description"
        />
      </div>
    </div>
  </section>
</template>

<script>
/**
 * Features Section Component
 * Displays platform features in a grid
 */
import FeatureCard from "./features/FeatureCard.vue"

export default {
  name: "FeaturesSection",

  components: {
    FeatureCard,
  },

  data() {
    return {
      features: [
        {
          icon: "chart",
          title: "Interactive Maps",
          description: "Explore listings on dynamic maps with filtering by district, price, and property type.",
        },
        {
          icon: "export",
          title: "Data Export",
          description: "Download comprehensive datasets in multiple formats for your research needs.",
        },
        {
          icon: "search",
          title: "Deep Analytics",
          description: "Uncover trends and patterns with advanced filtering and visualization tools.",
        },
        {
          icon: "globe",
          title: "Multi-City Coverage",
          description: "Access data from major European cities with consistent, reliable metrics.",
        },
      ],
    }
  },
}
</script>

<style scoped>
.features-section {
  padding: 2.5rem 0;
  background: #f8f9fa;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-tag {
  font-family: "Kanit", sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  color: #3d8adf;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: block;
  margin-bottom: 0.3rem;
}

.section-title {
  font-family: "Kanit", sans-serif;
  font-weight: 600;
  font-size: 1.5rem;
  color: #1a1a2e;
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
