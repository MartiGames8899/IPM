<template>
  <section class="about-hero">
    <div class="container">
      <span class="page-tag">About Us</span>
      <h1 class="page-title">Empowering Data-Driven Decisions</h1>
      <p class="page-subtitle">
        We transform complex Airbnb rental data into clear, actionable insights for researchers, policymakers, and urban analysts.
      </p>
    </div>
  </section>
</template>

<script>
export default {
  name: "AboutHero",
}
</script>

<style scoped>
.about-hero {
  background: linear-gradient(135deg, #c0daf8 0%, #e8f1fc 100%);
  padding: 3rem 0;
  text-align: center;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-tag {
  display: inline-block;
  background: #3d8adf;
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-family: "Kanit", sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
}

.page-title {
  font-family: "Kanit", sans-serif;
  font-weight: 600;
  font-size: 2rem;
  color: #1a1a2e;
  margin: 0 0 0.75rem 0;
}

.page-subtitle {
  font-family: "Kanit", sans-serif;
  font-weight: 300;
  font-size: 0.9rem;
  color: #4a5568;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .page-title {
    font-size: 1.5rem;
  }
}
</style>
