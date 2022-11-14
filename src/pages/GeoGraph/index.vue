<script setup>
import Graph from './components/Graph.vue';
import useWorldStore from '../../stores/world';

const world = useWorldStore();

const years = [];

for (let i = 1990; i < 2020; i++) {
  years.push(i);
}

</script>

<template>
  <div class="year-selector-wrapper">
    <div v-for="year in years"
      :key="year"
      :class="`year-wrapper${world.year === year ? ' active-year-wrapper' : ''}`"
      @click="world.setYear(year)">
      <div></div>
      <p>{{year}}</p>
    </div>
  </div>
  <div class="selector-wrapper">
    <div class="selector">
      <p v-for="type in ['3D', '2D']"
        :key="type"
        :class="type === world.type ? 'active-type' : ''"
        @click="world.setType(type)">
        {{type}}
      </p>
    </div>
  </div>
  <Graph />
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

.selector-wrapper {
  display: flex;
  justify-content: center;
  user-select: none;

  .selector {
    display: flex;
    margin: 20px 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, .25);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
  }

  p {
    margin: 0;
    padding: 1rem;
  }

  .active-type {
    color: white;
    background-color: #409EFF;
  }
}
</style>
