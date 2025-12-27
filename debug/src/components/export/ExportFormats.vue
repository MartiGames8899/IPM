<template>
  <section class="export-options">
    <div class="container">
      <div class="export-grid">
        <div v-for="format in formats" :key="format.id" class="export-card">
          <div class="card-icon">{{ format.icon }}</div>
          <h3 class="card-title">{{ format.title }}</h3>
          <p class="card-description">{{ format.description }}</p>
          <div class="card-actions">
            <MyButton :text="`Export ${format.id.toUpperCase()}`" @button-clicked="$emit('export', format.id)" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/**
 * Export Formats Component
 * Format selection cards (CSV, JSON, Excel)
 */
import MyButton from "../Button.vue"

export default {
  name: "ExportFormats",

  components: {
    MyButton,
  },

  emits: ["export"],

  data() {
    return {
      formats: [
        {
          id: "csv",
          icon: "📊",
          title: "CSV Format",
          description: "Download data in CSV format, compatible with Excel, Google Sheets, and most data analysis tools.",
        },
        {
          id: "json",
          icon: "{ }",
          title: "JSON Format",
          description: "Download structured data in JSON format, ideal for developers and programmatic data analysis.",
        },
        {
          id: "excel",
          icon: "📈",
          title: "Excel Format",
          description: "Download data in XLSX format with pre-formatted sheets and charts for immediate analysis.",
        },
      ],
    }
  },
}
</script>

<style scoped>
.export-options {
  padding: 3rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.export-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.export-card {
  background: #fff;
  border: 3px solid #75aff0;
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.export-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(116, 173, 239, 0.3);
}

.card-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
}

.card-title {
  font-family: "Kanit", sans-serif;
  font-size: 1.75rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.card-description {
  font-family: "Kanit", sans-serif;
  font-size: 1rem;
  font-weight: 300;
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.card-actions {
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .export-grid {
    grid-template-columns: 1fr;
  }
}
</style>
