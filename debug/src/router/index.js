/**
 * Vue Router Configuration
 * Defines all application routes
 */
import { createRouter, createWebHistory } from "vue-router"
import HomePage from "../views/HomePage.vue"
import ExploreMapPage from "../views/ExploreMapPage.vue"
import ExportDataPage from "../views/ExportDataPage.vue"
import AboutPage from "../views/AboutPage.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/explore-map",
    name: "ExploreMap",
    component: ExploreMapPage,
  },
  {
    path: "/explore-map/:city?",
    name: "ExploreMapCity",
    component: ExploreMapPage,
  },
  {
    path: "/export-data",
    name: "ExportData",
    component: ExportDataPage,
  },
  {
    path: "/about",
    name: "About",
    component: AboutPage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
