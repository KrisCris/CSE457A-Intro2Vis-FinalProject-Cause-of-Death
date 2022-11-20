<script setup>
import { select } from 'd3-selection';
import { stack } from 'd3-shape';
import { ref, onMounted } from 'vue';
import stackStore from '../../stores/stack'

const stackState = stackStore();

const wrapper = ref();
const svg = ref();

onMounted(() => {
  const { width } = wrapper.value.getBoundingClientRect();
  stackState.init(width);
  draw();
});

const draw = () => {
  const data = stack().keys([

  ])
}

const years = [];

for (let i = 1990; i < 2020; i++) {
  years.push(i);
}

</script>
<template>
  <!-- would be better to put this selector into a parent page and store the year and other data globally -->
  <div class="year-selector-wrapper">
    <div v-for="year in years"
      :key="year"
      :class="`year-wrapper${stackState.year === year ? ' active-year-wrapper' : ''}`"
      @click="stackState.setYear(year)">
      <div></div>
      <p>{{year}}</p>
    </div>
  </div>


  <div ref="wrapper">
    <svg ref="svg" :width="stackState.width" :height="stackState.width">
      
    </svg>
  </div>
</template>

<style scoped lang="scss">
@mixin year-hover {
  div {
    border-width: 0.25rem;
  }

  p {
    color: black;
  }
}

.year-selector-wrapper {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  overflow: auto;

  .year-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    cursor: pointer;

    div, p {
      pointer-events: none;
    }

    div {
      box-sizing: border-box;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background-color: #E6A23C;
      border: 0px solid black;
      transition: all .3s;
    }

    p {
      margin: 0;
      color: gray;
      transition: all .3s;
      font-weight: bold;
    }

    &:hover {
      @include year-hover
    }
  }

  .active-year-wrapper {
    @include year-hover
  }
}
</style>