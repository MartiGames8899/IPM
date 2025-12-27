<template>
  <Teleport to="body">
    <Transition name="toast-slide">
      <div v-if="visible" class="toast-container" :class="[`toast-${type}`]">
        <div class="toast-icon">
          <svg v-if="type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <svg v-else-if="type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
          <svg v-else-if="type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 9v4M12 17h.01" />
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </div>
        <div class="toast-content">
          <p class="toast-title">{{ title }}</p>
          <p v-if="message" class="toast-message">{{ message }}</p>
        </div>
        <button class="toast-close" @click="close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
export default {
  name: "Toast",

  props: {
    type: {
      type: String,
      default: "info",
      validator: (value) => ["success", "error", "warning", "info"].includes(value),
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      default: 4000,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:modelValue", "close"],

  data() {
    return {
      visible: false,
      timer: null,
    }
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(val) {
        this.visible = val
        if (val && this.duration > 0) {
          this.startTimer()
        }
      },
    },
  },

  beforeUnmount() {
    this.clearTimer()
  },

  methods: {
    startTimer() {
      this.clearTimer()
      this.timer = setTimeout(() => {
        this.close()
      }, this.duration)
    },

    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },

    close() {
      this.visible = false
      this.$emit("update:modelValue", false)
      this.$emit("close")
    },
  },
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  max-width: 400px;
  min-width: 300px;
  border-left: 4px solid;
}

.toast-success {
  border-left-color: #22c55e;
}

.toast-error {
  border-left-color: #ef4444;
}

.toast-warning {
  border-left-color: #f59e0b;
}

.toast-info {
  border-left-color: #3b82f6;
}

.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
}

.toast-success .toast-icon {
  color: #22c55e;
}

.toast-error .toast-icon {
  color: #ef4444;
}

.toast-warning .toast-icon {
  color: #f59e0b;
}

.toast-info .toast-icon {
  color: #3b82f6;
}

.toast-icon svg {
  width: 100%;
  height: 100%;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-family: "Kanit", sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.toast-message {
  font-family: "Kanit", sans-serif;
  font-size: 0.875rem;
  font-weight: 300;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #9ca3af;
  transition: color 0.2s ease;
}

.toast-close:hover {
  color: #4b5563;
}

.toast-close svg {
  width: 100%;
  height: 100%;
}

.toast-slide-enter-active {
  animation: toast-in 0.3s ease-out;
}

.toast-slide-leave-active {
  animation: toast-out 0.2s ease-in;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes toast-out {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

@media (max-width: 768px) {
  .toast-container {
    left: 16px;
    right: 16px;
    max-width: none;
    min-width: auto;
  }
}
</style>
