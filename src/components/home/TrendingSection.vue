<template>
  <section class="trending-section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <div class="section-title-group">
          <span class="section-tag">Popular Destinations</span>
          <h2 class="trending-title">Trending Cities</h2>
        </div>
        <p class="section-description">
          Discover the most explored urban rental markets with comprehensive data insights.
        </p>
      </div>

      <!-- Cities Grid -->
      <div class="cities-grid">
        <CityCard
          v-for="city in store.trendingCities"
          :key="city.id"
          :city="city"
          @city-click="handleCityClick"
        />
      </div>
    </div>
  </section>
</template>

<script>
/**
 * Trending Section Component
 * Displays featured cities in a grid layout
 */
import CityCard from "./CityCard.vue"
import { useDataStore } from "../../stores/data.js"

export default {
  name: "TrendingSection",

  components: {
    CityCard,
  },

  setup() {
    const store = useDataStore()
    return { store }
  },

  methods: {
    handleCityClick(city) {
      this.$router.push(`/explore-map?city=${city.id}`)
    },
  },
}
</script>

<style scoped>
.trending-section {
  padding: 2.5rem 0;
  background: #fff;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.section-tag {
  font-family: "Kanit", sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  color: #3d8adf;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.trending-title {
  font-family: "Kanit", sans-serif;
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 1.2;
  color: #1a1a2e;
  margin: 0;
}

.section-description {
  font-family: "Kanit", sans-serif;
  font-size: 0.8rem;
  font-weight: 300;
  color: #6c757d;
  max-width: 350px;
  margin: 0;
  text-align: right;
}

.cities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

@media (max-width: 768px) {
  .trending-section {
    padding: 2rem 0;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-description {
    text-align: left;
  }

  .trending-title {
    font-size: 1.25rem;
  }

  .cities-grid {
    grid-template-columns: 1fr;
  }
}
</style>
