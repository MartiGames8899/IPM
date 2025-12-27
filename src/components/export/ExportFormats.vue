<template>
  <section class="export-options">
    <div class="container">
      <div class="export-grid">
        <div v-for="format in formats" :key="format.id" class="export-card" :class="{ 'card-disabled': isExporting }">
          <div class="card-icon">{{ format.icon }}</div>
          <h3 class="card-title">{{ format.title }}</h3>
          <p class="card-description">{{ format.description }}</p>
          <div class="card-actions">
            <button 
              class="export-btn"
              :class="{ 'btn-loading': isExporting && exportingFormat === format.id }"
              :disabled="isExporting"
              @click="handleExport(format.id)"
            >
              <span v-if="isExporting && exportingFormat === format.id" class="btn-spinner"></span>
              <span v-else>Export {{ format.id.toUpperCase() }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ExportFormats",

  props: {
    isExporting: {
      type: Boolean,
      default: false,
    },
    exportingFormat: {
      type: String,
      default: null,
    },
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

  methods: {
    handleExport(formatId) {
      if (!this.isExporting) {
        this.$emit("export", formatId)
      }
    },
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

.export-card:hover:not(.card-disabled) {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(116, 173, 239, 0.3);
}

.card-disabled {
  opacity: 0.7;
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

.export-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 140px;
  height: 40px;
  padding: 0 24px;
  font-family: "Kanit", sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  color: #000;
  background: transparent;
  border: 2px solid #8cb9eb;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-btn:hover:not(:disabled) {
  background: #8cb9eb;
  color: #fff;
  border-radius: 14px;
}

.export-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-loading {
  background: #3d8adf;
  border-color: #3d8adf;
  color: #fff;
  border-radius: 14px;
}

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .export-grid {
    grid-template-columns: 1fr;
  }
}
</style>
