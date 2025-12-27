<template>
  <div class="city-card" @click="handleClick">
    <div class="city-image">
      <img 
        :src="city.image" 
        :alt="`Image of ${city.name}`" 
        class="image-normal" 
        loading="lazy"
        decoding="async"
      />
    </div>

    <div class="city-overlay"></div>

    <div class="card-header">
      <h3 class="city-name">{{ city.name }}</h3>
    </div>

    <div class="card-footer">
      <span class="city-cta">Explore Data ⇁</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "CityCard",

  props: {
    city: {
      type: Object,
      required: true,
      validator: (city) => city.name && city.image,
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
  background-color: #f0f0f0;
}

.city-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(116, 173, 239, 0.3);
}

.city-image {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.image-normal {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.city-card:hover .image-normal {
  transform: scale(1.05);
}

.city-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.6) 100%);
  z-index: 1;
}

.card-header {
  position: absolute;
  top: 0;
  left: 0;
  padding: 1rem;
  z-index: 2;
  width: 100%;
}

.city-name {
  font-family: "Kanit", sans-serif;
  font-weight: 600;
  font-size: 1.25rem;
  color: #fff;
  margin: 0;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  text-align: left;
}

.card-footer {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 1rem;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
}

.city-cta {
  font-family: "Kanit", sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.25s ease;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
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
