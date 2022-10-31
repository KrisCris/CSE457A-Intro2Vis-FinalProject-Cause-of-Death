<script setup>
import { ref, onMounted } from 'vue';
import { select, geoOrthographic, geoPath } from 'd3';
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
  const radius = width - 20;

  const rotate = [-15, -40];
  const projection = geoOrthographic()
    .rotate(rotate)
    .scale(450)
    .translate([width / 2, width / 2]);
  const path = geoPath().projection(projection);

  select(svg.value)
    .attr('width', radius)
    .attr('height', radius)
    .selectAll('path')
    .data(world.features, (d) => d.id)
    .enter()
    .append('path')
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
