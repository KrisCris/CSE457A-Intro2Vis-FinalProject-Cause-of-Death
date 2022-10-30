<script setup>
// https://github.com/vbenjs/vite-plugin-svg-icons
import { computed } from 'vue';

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  fill: {
    type: String,
    default: 'black',
  },
  size: {
    type: String,
    default: '2em',
  },
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>

<template>
  <svg aria-hidden="true" :width="props.size" :height="props.size">
    <use :xlink:href="symbolId" :fill="props.fill" />
  </svg>
</template>

<style scoped lang="scss">
svg {
    margin-right: 15px;
}
</style>
