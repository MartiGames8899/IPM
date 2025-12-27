<template>
  <section class="data-preview">
    <div class="container">
      <h2 class="section-title">Data Preview</h2>
      <div class="preview-table">
        <table>
          <thead>
            <tr>
              <th v-for="header in headers" :key="header">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in previewData" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.city }}</td>
              <td>{{ row.type }}</td>
              <td>{{ row.price }}</td>
              <td>{{ row.availability }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
/**
 * Export Preview Component
 * Sample data preview table
 */
export default {
  name: "ExportPreview",

  data() {
    return {
      headers: ["Listing ID", "City", "Property Type", "Price", "Availability"],
      previewData: [
        { id: "12345678", city: "Porto", type: "Entire home", price: "€85/night", availability: "245 days/year" },
        { id: "23456789", city: "Porto", type: "Private room", price: "€45/night", availability: "180 days/year" },
        { id: "34567890", city: "Porto", type: "Entire home", price: "€120/night", availability: "320 days/year" },
      ],
    }
  },
}
</script>

<style scoped>
.data-preview {
  padding: 4rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  font-family: "Kanit", sans-serif;
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.preview-table {
  background: #fff;
  border: 3px solid #75aff0;
  border-radius: 20px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #75aff0;
}

th {
  font-family: "Kanit", sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: #fff;
  padding: 1.25rem;
  text-align: left;
}

td {
  font-family: "Kanit", sans-serif;
  font-size: 1rem;
  font-weight: 300;
  color: #2c3e50;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e9ecef;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background: #f8f9fa;
}

@media (max-width: 768px) {
  .preview-table {
    overflow-x: auto;
  }

  table {
    min-width: 600px;
  }
}
</style>
