<template>
  <section class="values-section">
    <div class="container">
      <h2 class="section-title">Our Values</h2>
      <div class="values-grid">
        <div v-for="value in values" :key="value.title" class="value-card">
          <div class="value-icon">{{ value.icon }}</div>
          <h3 class="value-title">{{ value.title }}</h3>
          <p class="value-description">{{ value.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/**
 * About Values Component
 * Company values display
 */
export default {
  name: "AboutValues",

  data() {
    return {
      values: [
        {
          icon: "🎯",
          title: "Accuracy",
          description: "We prioritize data quality and reliability in every visualization we create.",
        },
        {
          icon: "🔓",
          title: "Transparency",
          description: "Open data practices that enable verification and reproducibility.",
        },
        {
          icon: "🤝",
          title: "Accessibility",
          description: "Making complex data understandable for everyone, not just data scientists.",
        },
      ],
    }
  },
}
</script>

<style scoped>
.values-section {
  padding: 3rem 0;
  background: #f8f9fa;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-title {
  font-family: "Kanit", sans-serif;
  font-weight: 600;
  font-size: 1.5rem;
  color: #1a1a2e;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.value-card {
  background: #fff;
  border: 2px solid #e8f1fc;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.25s ease;
}

.value-card:hover {
  border-color: #75aff0;
  transform: translateY(-3px);
}

.value-icon {
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
}

.value-title {
  font-family: "Kanit", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  color: #1a1a2e;
  margin: 0 0 0.4rem 0;
}

.value-description {
  font-family: "Kanit", sans-serif;
  font-weight: 300;
  font-size: 0.75rem;
  color: #6c757d;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 1024px) {
  .values-grid {
    grid-template-columns: 1fr;
  }
}
</style>
