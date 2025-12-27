<template>
  <button :class="buttonClasses" @click="handleClick" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
    {{ text }}
  </button>
</template>

<script>
/**
 * Button Component
 * Reusable button with hover and click states
 */
export default {
  name: "MyButton",

  props: {
    text: {
      type: String,
      default: "Button",
    },
    size: {
      type: String,
      default: "normal",
      validator: (value) => ["normal", "small"].includes(value),
    },
  },

  emits: ["button-clicked"],

  data() {
    return {
      isHovering: false,
      isClicked: false,
    }
  },

  computed: {
    buttonClasses() {
      return {
        button: true,
        "button-small": this.size === "small",
        "button-default": !this.isHovering && !this.isClicked,
        "button-hover": this.isHovering && !this.isClicked,
        "button-clicked": this.isClicked,
      }
    },
  },

  methods: {
    handleClick() {
      this.isClicked = true
      this.$emit("button-clicked")

      setTimeout(() => {
        this.isClicked = false
      }, 200)
    },
  },
}
</script>

<style scoped>
.button {
  box-sizing: border-box;
  width: auto;
  min-width: 60px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-family: "Kanit", sans-serif;
  font-weight: 400;
  text-align: center;
  color: #000;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.button:not(.button-small) {
  height: 40px;
  padding: 0 24px;
  font-size: 0.9rem;
  line-height: 1.4;
}

.button-small {
  height: 32px;
  padding: 0 16px;
  font-size: 0.8rem;
  line-height: 1.3;
  min-width: 80px;
}

.button-default {
  border: 2px solid #8cb9eb;
  border-radius: 100px;
  background: transparent;
}

.button-hover {
  background: #8cb9eb;
  border-radius: 14px;
  border: 2px solid #8cb9eb;
  color: #fff;
}

.button-clicked {
  background: #3d8adf;
  border-radius: 14px;
  border: 2px solid #3d8adf;
  color: #fff;
}
</style>
