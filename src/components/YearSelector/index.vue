<script setup>
import { defineEmits, defineProps, ref } from 'vue';

const years = [];

for (let i = 1990; i < 2020; i++) {
  years.push(i);
}

const emit = defineEmits(['change']);

const props = defineProps({
  default: Number,
});

const selectedYear = ref(props.default || 1990);

const onChange = year => {
  selectedYear.value = year;
  emit('change', year);
};

</script>

<template>
  <div class="year-selector-wrapper">
    <div v-for="year in years"
      :key="year"
      :class="`year-wrapper${year === selectedYear ? ' active-year-wrapper' : ''}`"
      @click="onChange(year)"
    >
      <div></div>
      <p>{{year}}</p>
    </div>
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
