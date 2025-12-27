<template>
  <div class="dropdown-wrapper">
    <div class="dropdown" :class="{ 'dropdown-open': isOpen }">
      <!-- Toggle Button -->
      <button class="dropdown-toggle" @click="toggleDropdown" @blur="closeDropdown">
        <span class="selected-text" :style="{ fontSize: textSize }">
          {{ selectedOption ? getOptionText(selectedOption) : placeholder }}
        </span>
        <span class="dropdown-arrow">▼</span>
      </button>

      <!-- Dropdown Menu -->
      <div v-if="isOpen" class="dropdown-menu">
        <div v-for="(group, letter) in groupedOptions" :key="letter" class="dropdown-group">
          <div class="group-header">{{ letter }}</div>
          <div
            v-for="option in group"
            :key="getOptionValue(option)"
            class="dropdown-item"
            :class="{ 'dropdown-item-selected': isSelected(option) }"
            @mousedown="selectOption(option)"
          >
            {{ getOptionText(option) }}
            <span v-if="option.country" class="option-country">{{ option.country }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Dropdown Component
 * Reusable dropdown with grouped alphabetical options
 */
export default {
  name: "Dropdown",

  props: {
    options: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: [String, Number, Object],
      default: null,
    },
    placeholder: {
      type: String,
      default: "Select an option",
    },
    valueKey: {
      type: String,
      default: "value",
    },
    textKey: {
      type: String,
      default: "text",
    },
    textSize: {
      type: String,
      default: "0.85rem",
    },
  },

  emits: ["update:modelValue", "change"],

  data() {
    return {
      isOpen: false,
    }
  },

  computed: {
    selectedOption() {
      if (!this.modelValue) return null
      return this.options.find((opt) => this.getOptionValue(opt) === this.modelValue) || this.modelValue
    },

    groupedOptions() {
      const groups = {}

      this.options
        .slice()
        .sort((a, b) => {
          const textA = this.getOptionText(a).toLowerCase()
          const textB = this.getOptionText(b).toLowerCase()
          return textA.localeCompare(textB)
        })
        .forEach((option) => {
          const text = this.getOptionText(option)
          const firstLetter = text.charAt(0).toUpperCase()

          if (!groups[firstLetter]) {
            groups[firstLetter] = []
          }
          groups[firstLetter].push(option)
        })

      return groups
    },
  },

  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },

    closeDropdown() {
      setTimeout(() => {
        this.isOpen = false
      }, 150)
    },

    selectOption(option) {
      const value = this.getOptionValue(option)
      this.$emit("update:modelValue", value)
      this.$emit("change", value, option)
      this.isOpen = false
    },

    isSelected(option) {
      return this.getOptionValue(option) === this.modelValue
    },

    getOptionValue(option) {
      if (typeof option === "object") {
        return option[this.valueKey]
      }
      return option
    },

    getOptionText(option) {
      if (typeof option === "object") {
        return option[this.textKey]
      }
      return option
    },
  },
}
</script>

<style scoped>
.dropdown-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.dropdown {
  position: relative;
  width: 100%;
}

.dropdown-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  width: 100%;
  background: #fff;
  border: 2px solid #75aff0;
  border-radius: 12px;
  cursor: pointer;
  font-family: "Kanit", sans-serif;
  font-size: 0.85rem;
  color: #2c3e50;
  transition: all 0.2s ease;
  min-height: 44px;
}

.dropdown-toggle:hover {
  border-color: #3d8adf;
  transform: scale(1.005);
}

.dropdown-open .dropdown-toggle {
  border-color: #3d8adf;
  box-shadow: 0 0 0 2px rgba(61, 138, 223, 0.15);
}

.selected-text {
  flex: 1;
  text-align: left;
}

.dropdown-arrow {
  margin-left: 0.5rem;
  transition: transform 0.2s ease;
  font-size: 0.7rem;
}

.dropdown-open .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-width: 100%;
  background: #fff;
  border: 2px solid #75aff0;
  border-radius: 12px;
  margin-top: 0.4rem;
  max-height: 250px;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.dropdown-group {
  border-bottom: 1px solid #f0f0f0;
}

.dropdown-group:last-child {
  border-bottom: none;
}

.group-header {
  padding: 0.5rem 1rem;
  font-family: "Kanit", sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: #2c3e50;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  z-index: 1;
}

.dropdown-item {
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: "Kanit", sans-serif;
  color: #2c3e50;
  font-size: 0.85rem;
  border-bottom: 1px solid #f8f8f8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-item:hover {
  background-color: #f0f8ff;
}

.dropdown-item-selected {
  background-color: #8cb9eb;
  color: #fff;
  font-weight: 500;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.option-country {
  font-size: 0.7rem;
  color: #6c757d;
  font-weight: 300;
}

.dropdown-item-selected .option-country {
  color: rgba(255, 255, 255, 0.8);
}

.dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 6px;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background: #75aff0;
  border-radius: 6px;
}

@media (max-width: 768px) {
  .dropdown-toggle {
    padding: 0.6rem 0.8rem;
    min-height: 40px;
  }
}
</style>
