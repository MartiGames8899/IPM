<template>
  <section class="page-header">
    <div class="container">
      <h1 class="page-title">Export Data</h1>
      <p class="page-description">
        Download comprehensive Airbnb data in multiple formats. Perfect for researchers, policymakers, and data analysts who need raw data for deeper analysis.
      </p>
    </div>
  </section>
</template>

<script>
/**
 * Export Header Component
 * Page header with title and description
 */
export default {
  name: "ExportHeader",
}
</script>

<style scoped>
.page-header {
  background: #c0daf8;
  padding: 3rem 0;
  margin-bottom: 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-title {
  font-family: "Kanit", sans-serif;
  font-style: italic;
  font-size: 3rem;
  font-weight: 300;
  color: #000;
  margin-bottom: 1rem;
}

.page-description {
  font-family: "Kanit", sans-serif;
  font-size: 1.125rem;
  font-weight: 300;
  color: #000;
  line-height: 1.8;
  max-width: 800px;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .page-description {
    font-size: 1rem;
  }
}
</style>
