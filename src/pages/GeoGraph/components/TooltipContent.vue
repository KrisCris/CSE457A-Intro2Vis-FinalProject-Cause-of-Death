<script setup>
import { defineProps } from 'vue';
import useWorldStore from '../../../stores/world';

const world = useWorldStore();

const props = defineProps({
  code: String,
});
const data = world.data[props.code];
</script>

<template>
  <div class="tooltip">
    <h4>{{data?.[0]}}</h4>
    <p>Year: {{world.year}}</p>
    <p>Total Death: {{data?.[data?.length - 1]}}</p>
  </div>
</template>

<style scoped lang="scss">
.tooltip {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h4, p {
    margin: 0;
  }

  p {
    color: gray;
  }
}
</style>
