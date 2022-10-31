<script setup>
import { ref, onMounted } from 'vue';
import { select, geoMercator, geoPath } from 'd3';
import world from '../../../assets/data/countries.json';

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const svg = ref();
const wrapper = ref();

onMounted(() => {
  const { width } = wrapper.value.getBoundingClientRect();
  const radius = width - 50;

  const projection = geoMercator()
    .fitWidth(radius, world)
    .translate([width / 2, width / 2]);

  const path = geoPath().projection(projection);

  select(svg.value)
    .attr('width', radius)
    .attr('height', radius)
    .selectAll('path')
    .data(world.features, d => d.id)
    .join('path')
    .attr('d', path)
    .attr('fill', () => getRandomColor());
});
</script>

<template>
  <div ref="wrapper">
    <svg ref="svg"></svg>
  </div>
</template>

<style scoped lang="scss">
</style>
