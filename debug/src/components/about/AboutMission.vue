<template>
  <section class="about-content">
    <div class="container">
      <div class="content-grid">
        <div class="content-text">
          <h2 class="content-title">Our Mission</h2>
          <p class="content-description">
            Urban rental markets are complex ecosystems that affect housing affordability, neighborhood dynamics, and city planning. Our platform makes this data accessible and understandable.
          </p>
          <p class="content-description">
            We aggregate and visualize Airbnb listing data from major European cities, providing tools that help stakeholders make informed decisions about urban development and housing policy.
          </p>
        </div>
        <div class="content-image">
          <img src="/images/logo.png" alt="Our Team" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/**
 * About Mission Component
 * Mission statement section
 */
export default {
  name: "AboutMission",
}
</script>

<style scoped>
.about-content {
  padding: 3rem 0;
  background: #fff;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  align-items: center;
}

.content-title {
  font-family: "Kanit", sans-serif;
  font-weight: 600;
  font-size: 1.5rem;
  color: #1a1a2e;
  margin: 0 0 1rem 0;
}

.content-description {
  font-family: "Kanit", sans-serif;
  font-weight: 300;
  font-size: 0.85rem;
  color: #4a5568;
  line-height: 1.6;
  margin: 0 0 0.75rem 0;
}

.content-image img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
