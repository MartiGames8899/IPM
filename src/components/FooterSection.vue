<template>
  <footer class="footer-section">
    <!-- Main Footer -->
    <div class="footer-main">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand Column -->
          <div class="footer-brand">
            <p class="footer-tagline">Airbnb Data Insights</p>
            <p class="footer-description">
              Transforming complex rental market data into actionable insights for researchers and policymakers.
            </p>
          </div>

          <!-- Explore Links -->
          <div class="footer-links">
            <h4 class="footer-heading">Explore</h4>
            <router-link to="/explore-map" class="footer-link">Interactive Map</router-link>
            <router-link to="/export-data" class="footer-link">Export Data</router-link>
            <router-link to="/about" class="footer-link">About Us</router-link>
          </div>

          <!-- Cities Links -->
          <div class="footer-links">
            <h4 class="footer-heading">Cities</h4>
            <router-link to="/explore-map?city=paris" class="footer-link">Paris</router-link>
            <router-link to="/explore-map?city=porto" class="footer-link">Porto</router-link>
            <router-link to="/explore-map?city=los-angeles" class="footer-link">Los Angeles</router-link>
            <router-link to="/explore-map?city=madrid" class="footer-link">Madrid</router-link>
          </div>

          <!-- CTA -->
          <div class="footer-cta">
            <h4 class="footer-heading">Start Exploring</h4>
            <p class="cta-text">Discover rental market insights in your city of interest.</p>
            <button class="cta-button" @click="$router.push('/explore-map')">Open Map</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <div class="container">
        <p class="copyright">2025 BnBScope.</p>
      </div>
    </div>
  </footer>
</template>

<script>
/**
 * Footer Section Component
 * Site-wide footer with navigation and branding
 */
export default {
  name: "FooterSection",
}
</script>

<style scoped>
.footer-section {
  margin-top: auto;
}

.footer-main {
  background: linear-gradient(135deg, #1a1a2e 0%, #2d3748 100%);
  padding: 2.5rem 0 1.5rem;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 2rem;
}

.footer-brand {
  max-width: 280px;
}

.footer-logo {
  height: 28px;
  width: auto;
  filter: brightness(0) invert(1);
  margin-bottom: 0.75rem;
}

.footer-tagline {
  font-family: "Adamina", serif;
  font-size: 1rem;
  color: #fff;
  margin: 0 0 0.5rem 0;
}

.footer-description {
  font-family: "Kanit", sans-serif;
  font-weight: 300;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin: 0;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-heading {
  font-family: "Kanit", sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  color: #fff;
  margin: 0 0 0.5rem 0;
}

.footer-link {
  font-family: "Kanit", sans-serif;
  font-weight: 300;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #75aff0;
}

.footer-cta {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1rem;
}

.cta-text {
  font-family: "Kanit", sans-serif;
  font-weight: 300;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 0.75rem 0;
}

.cta-button {
  width: 100%;
  background: #3d8adf;
  color: #fff;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-family: "Kanit", sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cta-button:hover {
  background: #2d7ad1;
  transform: translateY(-1px);
}

.footer-bottom {
  background: #151525;
  padding: 0.75rem 0;
}

.copyright {
  font-family: "Kanit", sans-serif;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  text-align: center;
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .footer-brand {
    grid-column: span 2;
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .footer-brand {
    grid-column: span 1;
  }
}
</style>
