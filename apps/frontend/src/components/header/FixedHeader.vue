<template>
  <!-- You can use slot to render default content here -->
  <div :class="computedClass">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'fixed-header',
  props: {
    threshold: {
      required: false,
      type: Number,
      default: 0,
    },
    headerClass: {
      required: false,
      type: String,
      default: 'vue-fixed-header',
    },
    fixedClass: {
      required: false,
      type: String,
      default: 'vue-fixed-header--isFixed',
    },
    hideScrollUp: {
      required: false,
      type: Boolean,
      default: false,
    },
  },

  data() {
    return { check: null, isFixed: false, lastScrollTop: 0 };
  },

  computed: {
    computedClass() {
      let classes = [this.headerClass];
      if (this.isFixed) {
        classes.push(this.fixedClass);
      }
      return classes;
    },
  },

  mounted() {
    this.main();
    this.registerEvent();
  },

  beforeDestroy() {
    this.removeEvent();
  },

  methods: {
    getScrollTop() {
      return window.pageYOffset || document.documentElement.scrollTop;
    },
    main() {
      this.lastScrollTop = this.getScrollTop();

      this.check = () => {
        const { threshold, hideScrollUp } = this;
        const currentScrollPos = this.getScrollTop();

        const isOverThreshold = currentScrollPos > threshold;
        const isScrollDown = currentScrollPos >= this.lastScrollTop;

        const newIsFixed = isScrollDown
          ? isOverThreshold
          : hideScrollUp
            ? false
            : isOverThreshold;

        this.lastScrollTop = currentScrollPos;

        if (this.isFixed !== newIsFixed) {
          this.isFixed = newIsFixed;
          this.$emit('change', this.isFixed);
        }
      };
    },
    registerEvent() {
      window.addEventListener('scroll', this.check);
    },
    removeEvent() {
      window.removeEventListener('scroll', this.check);
    },
  },
};
</script>

<style scoped>
.vue-fixed-header {
  transition: all 0.3s ease;
  background-color: white;
  width: 100%;
  position: relative;
  z-index: 999;
}

.vue-fixed-header--isFixed {
  position: fixed;
  top: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
