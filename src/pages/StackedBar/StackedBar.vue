<script setup>
import { max } from 'd3-array';
import { axisLeft } from 'd3-axis';
import { scaleBand, scaleSqrt, scaleOrdinal } from 'd3-scale';
import { select } from 'd3-selection';
import { stack } from 'd3-shape';
import { ref, onMounted } from 'vue';
import stackStore from '../../stores/stack'
import worldStore from '../../stores/world'

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

const colorSet = []
for (let i = 0; i < reasons.length; ++i) {
  colorSet.push(worldState.getRandomColor())
}

const colorScale = scaleOrdinal(colorSet).domain(reasons);

let barGrp = undefined;
let axisGrp = undefined;

onMounted(() => {
  const { width } = wrapper.value.getBoundingClientRect();
  stackState.init(width);
  draw();
});

const onChangeYear = (year) => {
  stackState.setYear(year);
  draw();
}

const draw = async () => {
  barGrp = barGrp || select(svg.value).append("g");
  axisGrp = axisGrp || select(svg.value).append("g");

  const rawData = Object.values(stackState.getYearlyData());
  console.log(rawData)
  rawData.sort((a, b) => b.total_death - a.total_death)
  const selectedData = rawData.slice(leftBound.value - 1, rightBound.value)
  const countryNames = selectedData.map(d => d.country_name)
  const eachHeight = 30;

  stackState.height = eachHeight * countryNames.length;

  const y = scaleBand()
      .domain(countryNames)
      .range([0, eachHeight * countryNames.length])
      .padding([0.2])
  const yAxis = axisLeft(y);
  const x = scaleSqrt()
    .domain([0, max(selectedData, d => d.total_death)])
    .range([0, stackState.width - 220]);

  const data = stack().keys(stackState.getReasonNames())(selectedData)
  axisGrp
    .call(yAxis)
    .call(g => g.select('.domain').remove());
  const rects = barGrp
    .attr("transform", `translate(${170}, ${0})`)
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("fill", d => colorScale(d.key))
    .selectAll("rect")
    .data(d => d)
    .join(
      enter => enter
        .append("rect")
        .transition()
        .duration(200)
        .attr("x", d => {
          return x(d[0]);
        })
        .attr("y", d => {
          return y(d.data.country_name)
        })
        .attr("width", d  => x(d[1]) - x(d[0]))
        .attr("height",y.bandwidth()),
        // .on("mouseover", function (e, d) {
        //   hover.value = {
        //     cause: select(this.parentNode).data()[0].key,
        //     detail: d.data
        //   }
        //   tooltip.value.style.top = `${e.clientY + 20}px`;
        //   tooltip.value.style.left = `${e.clientX + 20}px`;
        // })
        // .on("mouseout", () => hover.value = null),
      update => update
        .transition()
        .duration(200)
        .attr("x", d => {
          return x(d[0]);
        })
        .attr("y", d => {
          return y(d.data.country_name)
        })
        .attr("width", d  => x(d[1]) - x(d[0]))
        .attr("height",y.bandwidth()),
        // .on("mouseover", function (e, d) {
        //   hover.value = {
        //     cause: select(this.parentNode).data()[0].key,
        //     detail: d.data
        //   }
        //   tooltip.value.style.top = `${e.clientY + 20}px`;
        //   tooltip.value.style.left = `${e.clientX + 20}px`;
        // })
        // .on("mouseout", () => hover.value = null),
      exit => exit.remove()
    )
    rects
      .on("mouseover", function (e, d) {
          hover.value = {
            cause: select(this.parentNode).data()[0].key,
            detail: d.data
          }
          tooltip.value.style.top = `${e.clientY + 20}px`;
          tooltip.value.style.left = `${e.clientX + 20}px`;
        })
      .on("mouseout", () => hover.value = null)
}

</script>

<template>
    <!-- would be better to put this selector into a parent page and store the year and other data globally -->
    <div class="year-selector-wrapper">
        <div
            v-for="year in years"
            :key="year"
            :class="`year-wrapper${
                stackState.year === year ? ' active-year-wrapper' : ''
            }`"
            @click="onChangeYear(year)"
        >
            <div></div>
            <p>{{ year }}</p>
        </div>
    </div>

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

    <Teleport to="body">
      <div ref="tooltip" v-show="hover" class="tooltip">
        <h4>{{hover?.detail.country_name}}</h4>
        <p>Year: {{stackState.year}}</p>
        <p>Cause: {{hover?.cause}}</p>
        <p>Death: {{hover?.detail[hover?.cause]}}</p>
      </div>
    </Teleport>
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

        div,
        p {
            pointer-events: none;
        }

        div {
            box-sizing: border-box;
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            background-color: #e6a23c;
            border: 0px solid black;
            transition: all 0.3s;
        }

        p {
            margin: 0;
            color: gray;
            transition: all 0.3s;
            font-weight: bold;
        }

        &:hover {
            @include year-hover;
        }
    }

    .active-year-wrapper {
        @include year-hover;
    }
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