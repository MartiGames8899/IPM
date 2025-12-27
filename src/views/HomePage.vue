<template>
  <div class="home-page">
    <HeroSection />
    <TrendingSection />
    <FeaturesSection />
    <FooterSection />
  </div>
</template>

<script>
/**
 * Home Page View
 * Landing page with hero, trending cities, features, and footer
 */
import HeroSection from "../components/home/HeroSection.vue"
import TrendingSection from "../components/home/TrendingSection.vue"
import FeaturesSection from "../components/FeaturesSection.vue"
import FooterSection from "../components/FooterSection.vue"

export default {
  name: "HomePage",

  components: {
    HeroSection,
    TrendingSection,
    FeaturesSection,
    FooterSection,
  },
}
</script>

<style scoped>
.home-page {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
