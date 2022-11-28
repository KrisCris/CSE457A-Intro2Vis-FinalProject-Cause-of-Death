<script setup>
import Graph from './components/Graph.vue';
import useWorldStore from '../../stores/world';
import YearSelector from '../../components/YearSelector.vue';

const world = useWorldStore();

</script>

<template>
  <main>
    <YearSelector :default="world.year" @change="world.setYear"/>
    <section>
      <div class="selector-wrapper">
        <h1 class="title">{{world.year}}</h1>
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
  overflow-y: auto;
}

.selector-wrapper {
  display: flex;
  justify-content: center;
  user-select: none;
  position: relative;

  .title {
    position: absolute;
    margin: 0;
    top: 50%;
    transform: translateY(-50%);
    left: 3rem;
    font-size: 3rem;

  }

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
