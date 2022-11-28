<script setup>
import {
  ref, onMounted, reactive,
} from 'vue';
import stackStore from '../../stores/stack';
import YearSelector from '../../components/YearSelector.vue';
import Tooltip from '../../components/Tooltip.vue';
import Legend from '../../components/Legend.vue';
import Story from '../../components/Story.vue';

const stack = stackStore();
const wrapper = ref();
const size = reactive({
  width: 0,
  height: stack.base,
});

onMounted(() => {
  const { width } = wrapper.value.getBoundingClientRect();
  size.width = width;
  stack.setXScale(width);
});

const main = ref();
const header = ref();

const isVisible = i => {
  const offset = header.value?.getBoundingClientRect().height;
  const upper = main.value?.scrollTop ?? 0;
  const lower = upper + window.innerHeight;
  const top = i * stack.base + offset;
  const bottom = top + stack.base;

  return (upper <= top && bottom <= lower)
    || (top < upper && upper < bottom)
    || (top < lower && lower < bottom);
};

const test = () => {
  stack.containers.forEach((div, i) => {
    if (!div) return;

    if (isVisible(i)) {
      div.classList.remove('hidden');
    } else {
      div.classList.add('hidden');
    }
  });
};
</script>

<template>
  <main @scroll="test" ref="main">
    <YearSelector :default="stack.year" @change="stack.setYear" />
    <section>
      <header ref="header">
        <div class="legend-and-search-wrapper">
          <Legend/>
          <div class="search-wrapper">
            <input type="text" v-model="stack.search">
            <button @click="stack.updateData">Search</button>
          </div>
        </div>
        <Story>
          <template #title>
            This graph shows the total number of deaths and the percentage of different death reasons for each country.
          </template>
          <template #content>
            Overall, the total number of deaths in most countries shows an upward trend with each year.
            This roughly stems from the rise in world population, which is predictable. Each country shows different percentages of death reasons while Cardiovascular Diseases and Neoplasms remain the leading causes of death in the majority of countries.
            Some countries do not have very high threat level death reasons, only some relatively high threat death reasons, while some countries have much more serious death reasons.
            This may be closely related to each country's situation, people's diet, climate, and other factors.
          </template>
        </Story>
      </header>
      <div ref="wrapper">
        <div
          class="container"
          v-for="(country, i) in stack.data"
          :key="country[0]"
        >
          <svg
            :width="size.width"
            :height="stack.base"
            :class="[{
              hidden: !isVisible(i),
            }]"
            :ref="el => stack.containers[i] = el"
          >
              <text dominant-baseline="hanging">
                {{country[1][0]}}
              </text>
              <text
                dominant-baseline="hanging"
                text-anchor="end"
                fill="gray"
                :x="size.width"
              >
                Total Death: {{country[1][2]}}
              </text>
              <Tooltip
                v-for="d in stack.getStackedData(country[1])"
                :key="d.key"
              >
                <template #target="{onMouseEnter, onMouseLeave}">
                  <rect
                    :fill="stack.scaleColor(d[0][1] - d[0][0])"
                    stroke="white"
                    :x="stack.x?.(d[0][0]) ?? 0"
                    y="25"
                    :width="stack.x?.(d[0][1] - d[0][0]) ?? 0"
                    height="50"
                    @mouseenter="onMouseEnter"
                    @mouseleave="onMouseLeave"
                  />
                </template>
                <template #content>
                  <div class="tooltip-content">
                    <h4>{{stack.meta[d.key]}}</h4>
                    <p>Year: {{stack.year}}</p>
                    <p>Population: {{country[1][1]}}</p>
                    <p>Death: {{country[1][d.key]}}</p>
                    <p>Death / Population: {{(country[1][3] * 100).toFixed(2)}}%</p>
                    <p>Death / Total Death {{((d[0][1] - d[0][0]) * 100).toFixed(2)}}%</p>
                  </div>
                </template>
              </Tooltip>
          </svg>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">

main {
  flex: 1;
  display: flex;
  overflow: auto;
}

section {
  flex: 1;
  padding-right: 2rem;
}

.legend-and-search-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

rect {
  cursor: pointer;
  transition: all .5s;
}

.hidden {
  display: none;
}

.container {
  height: 100px;
}

.search-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 0;

  input {
    box-sizing: border-box;
    height: 2.5rem;
    outline: none;
    border: 1px solid #DCDFE6;
    border-radius: 8px;
    padding: 0 1rem;
    font-size: 1rem;
    transition: all .3s;

    &:hover {
      border-color: gray;
    }

    &:focus {
      border-color: #409EFF;
    }
  }

  button {
    box-sizing: border-box;
    height: 2.5rem;
    outline: none;
    border: none;
    border-radius: 8px;
    padding: 0 1rem;
    font-size: 1rem;
    transition: all .3s;
    background-color: #409EFF;
    color: white;
    cursor: pointer;

    &:hover {
      background-color: #79bbff;
    }

    &:active {
      background-color: #337ecc;
    }
  }
}
</style>
