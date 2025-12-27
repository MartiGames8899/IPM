<template>
  <div class="city-card" @click="handleClick">
    <!-- City Images -->
    <div class="city-image">
      <img :src="city.image" :alt="`Image of ${city.name}`" class="image-normal" />
      <img :src="city.hoverImage" :alt="`Hover image of ${city.name}`" class="image-hover" />
    </div>

    <!-- Overlay -->
    <div class="city-overlay"></div>

    <!-- Content -->
    <div class="city-content">
      <h3 class="city-name">{{ city.name }}</h3>
      <span class="city-cta">Explore Data</span>
    </div>
  </div>
</template>

<script>
/**
 * CityCard Component
 * Interactive card for displaying trending cities
 */
export default {
  name: "CityCard",

  props: {
    city: {
      type: Object,
      required: true,
      validator: (city) => city.name && city.image && city.hoverImage,
    },
  },

  emits: ["city-click"],

  methods: {
    handleClick() {
      this.$emit("city-click", this.city)
    },
  },
}
</script>

<style scoped>
.city-card {
  position: relative;
  width: 100%;
  height: 200px;
  border: 2px solid #74adef;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
  overflow: hidden;
}

.city-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(116, 173, 239, 0.3);
}

.city-image {
  position: absolute;
  inset: 0;
}

.image-normal,
.image-hover {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.4s ease;
}

.image-normal {
  opacity: 1;
}

.image-hover {
  opacity: 0;
}

.city-card:hover .image-normal {
  opacity: 0;
}

.city-card:hover .image-hover {
  opacity: 1;
}

.city-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.6) 100%);
  z-index: 1;
}

.city-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.city-name {
  font-family: "Kanit", sans-serif;
  font-weight: 600;
  font-size: 1.25rem;
  color: #fff;
  margin: 0;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
}

.city-cta {
  font-family: "Kanit", sans-serif;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.9);
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.25s ease;
}

.city-card:hover .city-cta {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 768px) {
  .city-card {
    height: 160px;
  }

  .city-name {
    font-size: 1.1rem;
  }
}
</style>
