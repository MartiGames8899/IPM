<template>
  <div class="feature-card">
    <div class="feature-icon">
      <span>{{ iconEmoji }}</span>
    </div>
    <h3 class="feature-title">{{ title }}</h3>
    <p class="feature-description">{{ description }}</p>
  </div>
</template>

<script>
/**
 * Feature Card Component
 * Individual feature display card
 */
export default {
  name: "FeatureCard",

  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },

  computed: {
    iconEmoji() {
      const iconMap = {
        chart: "📊",
        export: "📈",
        search: "🔍",
        globe: "🌍",
      }
      return iconMap[this.icon] || "📊"
    },
  },
}
</script>

<style scoped>
.feature-card {
  background: #fff;
  border: 2px solid #e8f1fc;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.25s ease;
}

.feature-card:hover {
  border-color: #75aff0;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(116, 173, 239, 0.15);
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #c0daf8 0%, #e8f1fc 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.feature-title {
  font-family: "Kanit", sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  color: #1a1a2e;
  margin: 0 0 0.4rem 0;
}

.feature-description {
  font-family: "Kanit", sans-serif;
  font-weight: 300;
  font-size: 0.75rem;
  color: #6c757d;
  line-height: 1.5;
  margin: 0;
}
</style>
