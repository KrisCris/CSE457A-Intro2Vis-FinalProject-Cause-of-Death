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
  <div class="tooltip-content">
    <h4>{{data?.[0]}}</h4>
    <p>Year: {{world.year}}</p>
    <p>Population: {{data?.[1]}}</p>
    <p>Total Death: {{data?.[2]}} ({{(data?.[3] * 100).toFixed(2)}}%)</p>
  </div>
</template>

<style scoped lang="scss">
</style>
