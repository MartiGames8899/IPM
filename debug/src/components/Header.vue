<template>
  <header class="header">
    <div class="header-content">
      <!-- Logo -->
      <router-link to="/" class="logo-link">
        <div class="logo">
          <img src="/images/logo.png" alt="Airbnb Insights" class="logo-image" />
        </div>
      </router-link>

      <!-- Navigation -->
      <nav class="nav-links">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="nav-link"
          :class="{ active: isActive(link) }"
        >
          {{ link.name }}
        </router-link>
      </nav>

      <!-- CTA Button -->
      <div class="nav-buttons">
        <MyButton text="Get Started" size="small" @button-clicked="handleExploreClick" />
      </div>
    </div>
  </header>
</template>

<script>
/**
 * Header Component
 * Main navigation header with logo, links, and CTA
 */
import MyButton from "./Button.vue"

export default {
  name: "Header",

  components: {
    MyButton,
  },

  data() {
    return {
      navLinks: [
        { name: "Home", path: "/", matchPath: "/" },
        { name: "Explore Map", path: "/explore-map", matchPath: "/explore-map" },
        { name: "Export Data", path: "/export-data", matchPath: "/export-data" },
        { name: "About Us", path: "/about", matchPath: "/about" },
      ],
    }
  },

  methods: {
    handleExploreClick() {
      this.$router.push("/explore-map")
    },

    isActive(link) {
      if (link.matchPath === "/") {
        return this.$route.path === "/"
      }
      return this.$route.path.includes(link.matchPath)
    },
  },
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: #fff;
  border-bottom: 2px solid #75aff0;
  z-index: 1000;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo {
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.logo-image {
  height: 32px;
  width: auto;
}

.logo-link:hover .logo {
  transform: scale(1.03);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  font-family: "Kanit", sans-serif;
  font-size: 0.85rem;
  font-weight: 400;
  color: #2c3e50;
  text-decoration: none;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: #75aff0;
  transition: width 0.2s ease;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 80%;
}

.nav-link.active {
  color: #3d8adf;
  font-weight: 500;
}

.nav-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0.5rem 1rem;
  }

  .logo-image {
    height: 28px;
  }

  .nav-links {
    display: none;
  }

  .nav-buttons {
    gap: 0.5rem;
  }
}
</style>
