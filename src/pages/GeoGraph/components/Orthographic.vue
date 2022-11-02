<script setup>
import { ref, onMounted } from 'vue';
import { geoOrthographic, geoPath } from 'd3';
import world from '../../../assets/data/countries.json';

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const wrapper = ref();
const radius = ref();

const path = geoPath();

onMounted(() => {
  const { width } = wrapper.value.getBoundingClientRect();
  radius.value = width - 50;

  const rotate = [-15, -40];
  const projection = geoOrthographic()
    .rotate(rotate)
    .fitSize([radius.value, radius.value], world)
    .translate([radius.value / 2, radius.value / 2]);
  path.projection(projection);
});
</script>

<template>
  <div ref="wrapper">
    <svg :width="radius" :height="radius">
      <path v-for="d in world.features"
        :key="d.id"
        :d="path(d)"
        :fill="getRandomColor()"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
div {
  display: flex;
  justify-content: center;
}
</style>
