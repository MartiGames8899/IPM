<template>
  <section class="cta-section">
    <div class="container">
      <h2 class="cta-title">Ready to Explore?</h2>
      <p class="cta-text">Start discovering insights from urban rental markets today.</p>
      <button class="cta-button" @click="$router.push('/explore-map')">Explore the Map</button>
    </div>
  </section>
</template>

<script>
/**
 * About CTA Component
 * Call to action section
 */
export default {
  name: "AboutCta",
}
</script>

<style scoped>
.cta-section {
  padding: 3rem 0;
  background: linear-gradient(135deg, #3d8adf 0%, #5a9ad8 100%);
  text-align: center;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.cta-title {
  font-family: "Kanit", sans-serif;
  font-weight: 600;
  font-size: 1.5rem;
  color: #fff;
  margin: 0 0 0.5rem 0;
}

.cta-text {
  font-family: "Kanit", sans-serif;
  font-weight: 300;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1.25rem 0;
}

.cta-button {
  background: #fff;
  color: #3d8adf;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-family: "Kanit", sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
</style>
