<script setup>
import {
  ref,
  onMounted,
  watchEffect,
} from 'vue';
import {
  zoom as Zoom,
  select,
  zoomIdentity,
  pointer,
  drag as Drag,
  zoomTransform,
} from 'd3';``
import versor from 'versor';
import useWorldStore from '../../../stores/world';
import Tooltip from '../../../components/Tooltip.vue';
import TooltipContent from './TooltipContent.vue';

const world = useWorldStore();
const wrapper = ref();
const svg = ref();
const group = ref();
const zoom = Zoom().scaleExtent([1, 8]);
const drag = Drag();

let v0;
let q0;
let r0;

const dragStart = e => {
  v0 = versor.cartesian(world.projection.invert(pointer(e, svg.value)));
  q0 = versor((r0 = world.projection.rotate()));
};

const dragging = e => {
  const pt = pointer(e, svg.value);
  const v1 = versor.cartesian(world.projection.rotate(r0).invert(pt));
  const delta = versor.delta(v0, v1);
  const q1 = versor.multiply(q0, delta);

  world.projection.rotate(versor.rotation(q1));
  world.newPathGenerator();
};

const reset = () => {
  select(svg.value).transition().duration(750).call(
    zoom.transform,
    zoomIdentity,
    zoomTransform(svg.value).invert([world.width / 2, world.width / 2]),
  );
};

onMounted(() => {
  const { width } = wrapper.value.getBoundingClientRect();
  world.init(width - 100);
  zoom.on('zoom', e => {
    const { transform } = e;
    select(group.value).attr('transform', transform);
  });
  const selection = select(svg.value);

  watchEffect(() => {
    reset();
    if (world.type === '3D') {
      selection
        .call(drag
          .on('start', dragStart)
          .on('drag', dragging))
        .call(zoom)
        .on('mousedown.zoom', null);
    } else if (world.type === '2D') {
      selection.call(zoom).call(drag);
    }
  });
});

const scaleColor = d => {
  const meta = world.data[d.properties.adm0_a3];
  return world.colorScale(meta ? meta[2] / meta[1] : 0);
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
              stroke="gray"
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
