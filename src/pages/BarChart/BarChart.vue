<script setup>
import { select, axisLeft } from 'd3';
import {
  ref, onMounted, reactive, watch,
} from 'vue';
import barChart from '../../stores/barChart';
import YearSelector from '../../components/YearSelector.vue';
import Tooltip from '../../components/Tooltip.vue';
import Legend from '../../components/Legend.vue';

const bar = barChart();
const wrapper = ref();
const axisGroup = ref();

const size = reactive({
  width: 0,
  height: bar.base * bar.getCausesCount(),
});

onMounted(() => {
  const { width } = wrapper.value.getBoundingClientRect();
  size.width = width;
  bar.setXScale(width);

  const yAxis = axisLeft(bar.y);
  const axisSelection = select(axisGroup.value);

  const updateAxis = () => {
    axisSelection
      .transition()
      .duration(500)
      .call(yAxis);
  };

  updateAxis();

  watch(
    () => bar.order,
    () => bar.orderData(),
  );
  watch(
    () => bar.data,
    () => updateAxis(),
  );
});
</script>

<template>
  <main>
    <YearSelector
      :default="bar.year"
      @change="bar.setYear"
    />
    <section>
      <header>
        <Legend/>
        <div class="order-wrapper">
          <template
            v-for="order in ['unordered', 'descending', 'ascending']"
            :key="order"
          >
            <input
              type="radio"
              name="order"
              :value="order"
              v-model="bar.order"
              :id="order"
            >
            <label :for="order">{{order}}</label>
          </template>
        </div>
      </header>
      <div ref="wrapper">
        <p class="stories">Overall, deaths caused by man-made or natural disaster factors are much less than those caused by disease. Cardiovascular Diseases and Neoplasms caused the most death in all years. 
          Lower Respiratory Infections and Chronic Respiratory Diseases also caused a lot of death these years. 
          Digestive Diseases should be equally given attention. Additionally, 'Diabetes Mellitus' and 'Alzheimer's Disease and Other Dementias' 's ranking has risen year by year, 
          from both outside the top 15 at the beginning of 1990 to within 10 in 2019. Optimistically, however, we are seeing a gradual decline in the proportion of deaths accounted for by other causes of death besides Cardiovascular Diseases and Neoplasms. 
          This shows the advancement of modern medicine and the importance people place on most causes of death. For humans now, we urgently need to find a cure for Cardiovascular Diseases and Neoplasms.</p>
        <svg
          :width="size.width"
          :height="size.height"
        >
          <g ref="axisGroup" transform="translate(170,0)"></g>
          <g transform="translate(170,0)">
            <Tooltip
              v-for="d in bar.data"
              :key="d[1]"
            >
              <template #target="{onMouseEnter, onMouseLeave}">
                <rect
                  x="0"
                  :y="bar.y(d[1])"
                  :width="bar.x?.(d[0]) ?? 0"
                  :height="bar.y.bandwidth()"
                  :fill="bar.scaleColor(d[0])"
                  @mouseenter="onMouseEnter"
                  @mouseleave="onMouseLeave"
                />
              </template>
              <template #content>
                <div class="tooltip-content">
                  <h4>{{d[1]}}</h4>
                  <p>Year: {{bar.year}}</p>
                  <p>Total Death: {{d[0]}} ({{d[2].toFixed(2)}}%)</p>
                </div>
              </template>
            </Tooltip>
          </g>
        </svg>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
p.stories {
  margin: -1rem 2rem 1.5rem 0px;
  background-color:#99D594;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
}

main {
  flex: 1;
  overflow: auto;
  display: flex;
}

section {
  flex: 1;
}

header {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.order-wrapper {
  display: flex;
  padding: 2rem;
  gap: 1rem;

  label {
    cursor: pointer;
    color: #5F6368;
    font-size: 1rem;
    padding: 1rem;
    border-radius: 8px;
  }

  input {
    display: none;

    &:checked + label {
      background-color: #E8F0FE;
      color: #1967D2;
    }
  }
}

rect {
  transition: all .5s;
  cursor: pointer;
}
</style>
