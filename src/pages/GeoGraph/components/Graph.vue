<script setup>
import {
  ref, onMounted, watchEffect,
} from 'vue';
import {
  zoom, select, zoomIdentity, pointer, geoPath, geoBounds, drag, zoomTransform,
} from 'd3';
import useWorldStore from '../../../stores/world';

const world = useWorldStore();
const wrapper = ref();
const svg = ref();
const group = ref();
const Zoom = zoom().scaleExtent([1, 8]);
const tooltip = ref();
const hover = ref(null);

onMounted(() => {
  const { width } = wrapper.value.getBoundingClientRect();
  world.init(width - 100, group);
  Zoom
    .on('zoom', e => {
      const { transform } = e;
      select(group.value).attr('transform', transform);
      // select(group.value).attr('stroke-width', 1 / transform.k);
    });
  select(svg.value)
    .call(Zoom)
    .on('mousedown.zoom', null);
});

const test = (d, e) => {
  const [[x0, y0], [x1, y1]] = world.pathGenerator.bounds(d);
  e.stopPropagation();
  select(this).transition().style('fill', 'red');
  select(svg.value).transition().duration(750).call(
    Zoom.transform,
    zoomIdentity
      .translate(world.width / 2, world.width / 2)
      .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / world.width, (y1 - y0) / world.width)))
      .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
    pointer(e, svg.value),
  );
};

watchEffect(() => {
  // console.log(world.type);
  select(svg.value)
    .call(drag().on('drag', world.type === '2D' ? null : e => {
      const rotate = world.projection.rotate();
      const k = 75 / world.projection.scale();
      world.projection.rotate([
        rotate[0] + e.dx * k,
        rotate[1] - e.dy * k,
      ]);
      world.newPathGenerator();
      // path = d3.geoPath().projection(projection)
      // svg.selectAll("path").attr("d", path)
    }));
});

const reset = () => {
  select(svg.value).transition().duration(750).call(
    Zoom.transform,
    zoomIdentity,
    zoomTransform(svg.value).invert([world.width / 2, world.width / 2]),
  );
};

const scaleColor = d => {
  const meta = world.data[d.properties.adm0_a3];
  return world.colorScale(meta ? meta[meta.length - 1] : 1);
};

const onHover = (d, e) => {
  hover.value = world.data[d.properties.adm0_a3];
  tooltip.value.style.top = `${e.clientY + 20}px`;
  tooltip.value.style.left = `${e.clientX + 20}px`;
};

</script>

<template>
  <div ref="wrapper">
    <button @click="reset">reset</button>
    <svg
      :width="world.width"
      :height="world.width"
      ref="svg">
      <g ref="group">
        <path v-for="d in world.countries"
          :key="d.id"
          :d="world.pathGenerator(d)"
          :fill="scaleColor(d)"
          @click="test(d, $event)"
          @mouseenter="onHover(d, $event)"
          @mouseleave="hover = null"
        />
      </g>
    </svg>
  </div>
  <Teleport to="body">
    <div ref="tooltip" v-show="hover" class="tooltip">
      <h4>{{hover?.[0]}}</h4>
      <p>Year: {{world.year}}</p>
      <p>Total Death: {{hover?.[hover?.length - 1]}}</p>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
div {
  display: flex;
  justify-content: center;
  position: relative;

  button {
    position: absolute;
    top: 0;
    left: 0;
  }
}

path {
  cursor: pointer;
  transition: fill .3s;
}

.tooltip {
  background-color: white;
  border-radius: 8px;
  position: absolute;
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, .25);
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
