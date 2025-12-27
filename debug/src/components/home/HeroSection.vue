<template>
  <section class="hero-section">
    <div class="hero-bg"></div>

    <!-- Hero Content -->
    <div class="hero-content">
      <div class="hero-text">
        <span class="hero-tag">{{ tagline }}</span>
        <h1 class="hero-title">{{ title }}</h1>
        <p class="hero-subtitle">{{ subtitle }}</p>
      </div>

      <!-- City Dropdown -->
      <div class="hero-dropdown">
        <label class="dropdown-label">Select a city to explore</label>
        <Dropdown
          :options="store.citiesData"
          v-model="selectedCity"
          placeholder="Choose a city..."
          value-key="id"
          text-key="name"
          text-size="1rem"
          @change="handleCityChange"
        />
      </div>

      <!-- Stats Display -->
      <HeroStats :stats="computedStats" />
    </div>

    <!-- Hero Image -->
    <div class="hero-visual">
      <img src="/images/logo.png" alt="Data Visualization" class="hero-image" />
    </div>
  </section>
</template>

<script>
/**
 * Hero Section Component
 * Main hero banner with city search and statistics
 */
import Dropdown from "../DropDown.vue"
import HeroStats from "./HeroStats.vue"
import { useDataStore } from "../../stores/data.js"

export default {
  name: "HeroSection",

  components: {
    Dropdown,
    HeroStats,
  },

  setup() {
    const store = useDataStore()
    return { store }
  },

  data() {
    return {
      selectedCity: null,
      tagline: "Airbnb Data Insights",
      title: "Explore Urban Rental Markets",
      subtitle:
        "Transform complex Airbnb data into intuitive visualizations. Empowering researchers, policymakers, and analysts with actionable insights.",
    }
  },

  computed: {
    totalCities() {
      return this.store.citiesData.length
    },

    totalCountries() {
      const countries = this.store.citiesData.map((c) => c.country)
      return new Set(countries).size
    },

    totalListings() {
      return this.store.totalGlobalListings
    },

    computedStats() {
      const listingsDisplay = this.totalListings > 0 
        ? (this.totalListings / 1000).toFixed(0) + "K+" 
        : "..."

      return [
        { number: this.totalCities > 0 ? this.totalCities : "...", label: "Cities" },
        { number: listingsDisplay, label: "Listings" },
        { number: this.totalCountries > 0 ? this.totalCountries : "...", label: "Countries" },
      ]
    },
  },

  methods: {
    handleCityChange(cityId) {
      this.$router.push(`/explore-map?city=${cityId}`)
    },
  },
}
</script>

<style scoped>
.hero-section {
  position: relative;
  width: 100%;
  min-height: 320px;
  margin-top: 45px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #c0daf8 0%, #e8f1fc 100%);
}

.hero-content {
  position: relative;
  width: 55%;
  max-width: 600px;
  padding: 2rem 1.5rem 2rem 3rem;
  z-index: 1;
}

.hero-tag {
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

.hero-text {
  margin-bottom: 1.25rem;
}

.hero-title {
  font-family: "Kanit", sans-serif;
  font-weight: 600;
  font-size: 1.75rem;
  line-height: 1.2;
  color: #1a1a2e;
  margin: 0 0 0.75rem 0;
}

.hero-subtitle {
  font-family: "Kanit", sans-serif;
  font-weight: 300;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #4a5568;
  margin: 0;
}

.hero-dropdown {
  width: 100%;
  max-width: 400px;
  margin-bottom: 1.5rem;
}

.dropdown-label {
  display: block;
  font-family: "Kanit", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.4rem;
}

.hero-visual {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 40%;
  max-width: 400px;
  z-index: 0;
  opacity: 0.9;
}

.hero-image {
  width: 100%;
  height: auto;
  object-fit: contain;
}

@media (max-width: 1024px) {
  .hero-visual {
    display: none;
  }

  .hero-content {
    width: 100%;
    max-width: 100%;
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 280px;
    margin-top: 50px;
  }

  .hero-title {
    font-size: 1.5rem;
  }
}
</style>
