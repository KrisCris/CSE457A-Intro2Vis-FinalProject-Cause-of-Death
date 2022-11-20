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
