<template>
  <div id="app">
    <Header @navigate="handleNavigation" />
    <router-view />
  </div>
</template>

<script>
/**
 * Root Application Component
 * Handles global navigation and initial data loading
 */
import Header from "./components/Header.vue"
import { useDataStore } from "./stores/data.js"

export default {
  name: "App",
  
  components: {
    Header,
  },

  setup() {
    const store = useDataStore()
    return { store }
  },

  mounted() {
    this.store.loadCities()
    this.store.fetchGlobalStats()
  },

  methods: {
    handleNavigation(route) {
      this.$router.push(route)
    },
  },
}
</script>

<style>
/* Global Styles */
@import url("https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=Adamina&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 14px;
  scroll-behavior: smooth;
}

body {
  font-family: "Kanit", sans-serif;
  background-color: #f8f9fa;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #75aff0;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #5a9ad8;
}
</style>
