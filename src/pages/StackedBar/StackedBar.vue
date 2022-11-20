<script setup>
import { max } from 'd3-array';
import { axisLeft } from 'd3-axis';
import { scaleBand, scaleSqrt, scaleOrdinal } from 'd3-scale';
import { select } from 'd3-selection';
import { stack } from 'd3-shape';
import { ref, onMounted } from 'vue';
import stackStore from '../../stores/stack';
import worldStore from '../../stores/world';
import YearSelector from '../../components/YearSelector.vue';

const stackState = stackStore();
const worldState = worldStore();

const years = [];

for (let i = 1990; i < 2020; i++) {
  years.push(i);
}

const leftBound = ref(1);
const rightBound = ref(30);

const hover = ref(null);

const wrapper = ref();
const svg = ref();
const tooltip = ref();

const reasons = stackState.getReasonNames();

const colorSet = [];
for (let i = 0; i < reasons.length; ++i) {
  colorSet.push(worldState.getRandomColor());
}

const colorScale = scaleOrdinal(colorSet).domain(reasons);

let barGrp;
let axisGrp;

onMounted(() => {
  const { width } = wrapper.value.getBoundingClientRect();
  stackState.init(width);
  draw();
});

const onChangeYear = year => {
  stackState.setYear(year);
  draw();
};

const draw = async () => {
  barGrp = barGrp || select(svg.value).append('g');
  axisGrp = axisGrp || select(svg.value).append('g');

  const rawData = Object.values(stackState.getYearlyData());
  console.log(rawData);
  rawData.sort((a, b) => b.total_death - a.total_death);
  const selectedData = rawData.slice(leftBound.value - 1, rightBound.value);
  const countryNames = selectedData.map(d => d.country_name);
  const eachHeight = 30;

  stackState.height = eachHeight * countryNames.length;

  const y = scaleBand()
    .domain(countryNames)
    .range([0, eachHeight * countryNames.length])
    .padding([0.2]);
  const yAxis = axisLeft(y);
  const x = scaleSqrt()
    .domain([0, max(selectedData, d => d.total_death)])
    .range([0, stackState.width - 220]);

  const data = stack().keys(stackState.getReasonNames())(selectedData);
  axisGrp
    .attr('transform', `translate(${170}, ${0})`)
    .call(yAxis);
  const rects = barGrp
    .attr('transform', `translate(${170}, ${0})`)
    .selectAll('g')
    .data(data)
    .join('g')
    .attr('fill', d => colorScale(d.key))
    .selectAll('rect')
    .data(d => d)
    .join(
      enter => enter
        .append('rect')
        .attr('y', d => y(d.data.country_name))
        .transition()
        .duration(200)
        .attr('x', d => x(d[0]))
        .attr('width', d => x(d[1]) - x(d[0]))
        .attr('height', y.bandwidth()),
      update => update
        .attr('y', d => y(d.data.country_name))
        .transition()
        .duration(200)
        .attr('x', d => x(d[0]))
        .attr('width', d => x(d[1]) - x(d[0]))
        .attr('height', y.bandwidth()),
      exit => exit.remove(),
    );
  rects
    .on('mouseover', function (e, d) {
      hover.value = {
        cause: select(this.parentNode).data()[0].key,
        detail: d.data,
      };
      tooltip.value.style.top = `${e.clientY + 20}px`;
      tooltip.value.style.left = `${e.clientX + 20}px`;
    })
    .on('mouseout', () => hover.value = null);
};
</script>

<template>
  <main>
    <YearSelector
      :default="stackState.year"
      @change="onChangeYear"
    />
    <section>
      <div>
        <input type="range" id="left" name="left" v-model="leftBound"
          :min="1" :max="Math.min(204, rightBound)" v-on:input="draw">
        <label for="left">{{leftBound}}</label>
        <input type="range" id="right" name="right" v-model="rightBound"
          :min="Math.max(1, leftBound)" :max="204" v-on:input="draw">
        <label for="right">{{rightBound}}</label>
      </div>

      <div ref="wrapper">
          <svg
              ref="svg"
              :width="stackState.width"
              :height="stackState.height"
          ></svg>
      </div>
    </section>
    <Teleport to="body">
      <div ref="tooltip" v-show="hover" class="tooltip">
        <h4>{{hover?.detail.country_name}}</h4>
        <p>Year: {{stackState.year}}</p>
        <p>Cause: {{hover?.cause}}</p>
        <p>Death: {{hover?.detail[hover?.cause]}}</p>
      </div>
    </Teleport>
  </main>
</template>

<style scoped lang="scss">
main {
  flex: 1;
  display: flex;
  overflow: auto;
}

section {
  flex: 1
}

.tooltip {
  text-align: center;
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
