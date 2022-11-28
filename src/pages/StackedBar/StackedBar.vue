<script setup>
import {
  ref, onMounted, reactive,
} from 'vue';
import stackStore from '../../stores/stack';
import YearSelector from '../../components/YearSelector.vue';
import Tooltip from '../../components/Tooltip.vue';
import Legend from '../../components/Legend.vue';

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
const containers = [];

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
  containers.forEach((div, i) => {
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
        <div class="search-wrapper">
          <input type="text" v-model="stack.search">
          <button @click="stack.updateData">Search</button>
        </div>
        <Legend/>
      </header>
      <div ref="wrapper">
        <p class="stories">Placeholder</p>
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
            :ref="el => containers[i] = el"
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
p.stories {
  margin:0px;
  margin-bottom: 1.5rem;
  background-color:#99D594;
  padding: 1rem 1.5rem;;
  border-radius: 1rem;
}

main {
  flex: 1;
  display: flex;
  overflow: auto;
}

section {
  flex: 1;
  padding-right: 2rem;
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
