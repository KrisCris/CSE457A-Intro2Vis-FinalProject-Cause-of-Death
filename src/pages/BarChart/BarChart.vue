<script setup>
import { max } from 'd3-array';
import { axisLeft } from 'd3-axis';
import { scaleBand, scaleSqrt, scaleOrdinal } from 'd3-scale';
import { select } from 'd3-selection';
import { stack } from 'd3-shape';
import { ref, onMounted } from 'vue';
import barChart from '../../stores/barChart'
import worldStore from '../../stores/world'

const barState = barChart();
const worldState = worldStore();

const years = [];
const colorSet = [];

const reasons = barState.getReasonNames();

for (let i = 0; i < reasons.length; ++i) {
  colorSet.push(worldState.getRandomColor())
}
for (let i = 1990; i < 2020; i++) {
    years.push(i);
}


const hover = ref(null);

const wrapper = ref();
const svg = ref();
const tooltip = ref();


const colorScale = scaleOrdinal(colorSet).domain(reasons);
let barGrp = undefined;
let axisGrp = undefined;

onMounted(() => {
    const { width } = wrapper.value.getBoundingClientRect();
    barState.init(width);
    draw();
});

const onChangeYear = (year) => {
    barState.setYear(year);
    draw();
}

const draw = async () => {
    barGrp = barGrp || select(svg.value).append("g");
    axisGrp = axisGrp || select(svg.value).append("g");


    const rawData = barState.getYearlyData();


    let data = Object.values(rawData).sort((a, b) => {
        return b[0] - a[0];
    });
   

    const diseaseNames = data.map(d => d[1]);

    const eachHeight = 50;

    barState.height = eachHeight * diseaseNames.length;

    const y = scaleBand()
        .domain(diseaseNames)
        .range([0, eachHeight * diseaseNames.length])
        .padding([0.2])
    const yAxis = axisLeft(y);
    const x = scaleSqrt()
        .domain([0, max(data, d => d[0])])
        .range([0, barState.width - 220]);

    axisGrp
        .attr("transform", `translate(${170}, ${0})`)
        .transition()
        .duration(500)
        .call(yAxis)
        
    const  rects = barGrp
        .attr("transform", `translate(${170}, ${0})`)
        .selectAll("rect")
        .data(data, d => d[1])
        .join(
            enter => enter
                .append("rect")
                .attr("fill", d => colorScale(d[1]))
                .attr("y", d => y(d[1]))
                .transition()
                .duration(500)
                .attr("x", 0)
                .attr("width", d => x(d[0]))
                .attr("height", y.bandwidth()),
            update => update
                .attr("fill", d => colorScale(d[1]))
                .transition()
                .duration(500)
                .attr("x", 0)
                .attr("y", d => y(d[1]))
                .attr("width", d => x(d[0]))
                .attr("height", y.bandwidth()),
            exit => exit.remove()
        )
    rects
        .on("mouseover", function (e, d) {
            hover.value = d
            tooltip.value.style.top = `${e.clientY + 20}px`;
            tooltip.value.style.left = `${e.clientX + 20}px`;
        })
        .on("mouseout", () => hover.value = null)
}
</script>

<template>
    <!-- would be better to put this selector into a parent page and store the year and other data globally -->
    <div class="year-selector-wrapper">
        <div v-for="year in years" :key="year" :class="`year-wrapper${barState.year === year ? ' active-year-wrapper' : ''
        }`" @click="onChangeYear(year)">
            <div></div>
            <p>{{ year }}</p>
        </div>
    </div>

    <div ref="wrapper">
        <svg ref="svg" :width="barState.width" :height="barState.height"></svg>
    </div>

    <Teleport to="body">
        <div ref="tooltip" v-show="hover" class="tooltip">
            <h4>{{ hover?.[1]}}</h4>
            <p>Year: {{ barState.year }}</p>
            <p>Death: {{ hover?.[0] }}</p>
            <p>Death Percentage: {{ hover?.[2] }}</p>
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

    h4,
    p {
        margin: 0;
    }

    p {
        color: gray;
    }
}
</style>