<script setup>
import { ref } from 'vue';

const expand = ref(false);
</script>

<template>
  <div
    :class="{'expand': expand}"
    @click="expand = !expand"
  >
    <p>
      <slot name="title"></slot>
    </p>
    <p>
      <slot name="content"></slot>
    </p>
  </div>
</template>

<style scoped lang="scss">
div {
  margin:0px;
  margin-bottom: 1.5rem;
  background-color:#b9eab5;
  color: #3e8639;
  border-radius: 1rem;
  max-height: 3rem;
  transition: all .4s ease-in-out;
  overflow: hidden;
  cursor: pointer;
}

p {
  margin: 0;
  padding: 1rem;
  box-sizing: border-box;

  &:first-child {
    height: 3rem;
    line-height: 1rem;
  }
}

.expand {
  max-height: 100vh;
}
</style>
