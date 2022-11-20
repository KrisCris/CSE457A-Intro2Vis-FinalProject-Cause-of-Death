<script setup>
import {
  ref,
  onMounted,
  watchEffect,
} from 'vue';
import {
  zoom,
  select,
  zoomIdentity,
  pointer,
  drag,
  zoomTransform,
} from 'd3';
import versor from 'versor';
import useWorldStore from '../../../stores/world';
import Tooltip from '../../../components/Tooltip.vue';
import TooltipContent from './TooltipContent.vue';

const world = useWorldStore();
const wrapper = ref();
const svg = ref();
const group = ref();
const Zoom = zoom().scaleExtent([1, 8]);

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

// const test = (d, e) => {
//   const [[x0, y0], [x1, y1]] = world.pathGenerator.bounds(d);
//   e.stopPropagation();
//   select(this).transition().style('fill', 'red');
//   select(svg.value).transition().duration(750).call(
//     Zoom.transform,
//     zoomIdentity
//       .translate(world.width / 2, world.width / 2)
//       .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / world.width, (y1 - y0) / world.width)))
//       .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
//     pointer(e, svg.value),
//   );
// };

let v0;
let q0;
let r0;

const dragStart = e => {
  v0 = versor.cartesian(world.projection.invert(pointer(e, svg.value)));
  q0 = versor((r0 = world.projection.rotate()));
};

const dragging = e => {
  // const rotate = world.projection.rotate();
  // const k = 75 / world.projection.scale();
  // world.projection.rotate([
  //   rotate[0] + e.dx * k,
  //   rotate[1] - e.dy * k,
  // ]);
  const pt = pointer(e, svg.value);
  const v1 = versor.cartesian(world.projection.rotate(r0).invert(pt));
  const delta = versor.delta(v0, v1);
  const q1 = versor.multiply(q0, delta);

  world.projection.rotate(versor.rotation(q1));
  world.newPathGenerator();
  // path = d3.geoPath().projection(projection)
  // svg.selectAll("path").attr("d", path)
};

const reset = () => {
  select(svg.value).transition().duration(750).call(
    Zoom.transform,
    zoomIdentity,
    zoomTransform(svg.value).invert([world.width / 2, world.width / 2]),
  );
};

watchEffect(() => {
  // console.log(world.type);
  // reset();
  select(svg.value)
    .call(drag()
      .on('start', world.type === '2D' ? null : dragStart)
      .on('drag', world.type === '2D' ? null : dragging));
});

const scaleColor = d => {
  const meta = world.data[d.properties.adm0_a3];
  return world.colorScale(meta ? meta[meta.length - 1] : 1);
};
</script>

<template>
  <div ref="wrapper">
    <!-- <button @click="reset">reset</button> -->
    <svg
      :width="world.width"
      :height="world.width"
      ref="svg"
    >
      <g ref="group">
        <Tooltip
          v-for="d in world.countries"
          :key="d.id"
        >
          <template #target="{onMouseEnter, onMouseLeave}">
            <path
              :d="world.pathGenerator(d)"
              :fill="scaleColor(d)"
              @mouseenter="onMouseEnter"
              @mouseleave="onMouseLeave"
            />
          </template>
          <template #content>
            <TooltipContent :code="d.properties.adm0_a3"/>
          </template>
        </Tooltip>
      </g>
    </svg>
  </div>
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
</style>
