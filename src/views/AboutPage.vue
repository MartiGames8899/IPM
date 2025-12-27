<template>
  <div class="about-page">
    <AboutHero />
    <AboutMission />
    <AboutValues />
    <AboutTeam />
    <AboutCta />
    <FooterSection />
  </div>
</template>

<script>
/**
 * About Page View
 * Company information, mission, values, and team
 */
import AboutHero from "../components/about/AboutHero.vue"
import AboutMission from "../components/about/AboutMission.vue"
import AboutValues from "../components/about/AboutValues.vue"
import AboutTeam from "../components/about/AboutTeam.vue"
import AboutCta from "../components/about/AboutCta.vue"
import FooterSection from "../components/FooterSection.vue"

export default {
  name: "AboutPage",

  components: {
    AboutHero,
    AboutMission,
    AboutValues,
    AboutTeam,
    AboutCta,
    FooterSection,
  },
}
</script>

<style scoped>
.about-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 45px;
}
</style>
