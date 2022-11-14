import { defineStore } from 'pinia';
import { geoOrthographic, geoPath, geoMercator } from 'd3';
// import world from '../assets/data/countries.json';
import world from '../assets/data/custom.geo.json';

const projection = {
  '3D': width => geoOrthographic()
    .rotate([-15, -40])
    .fitSize([width, width], world)
    .translate([width / 2, width / 2]),
  '2D': width => geoMercator()
    .fitWidth(width, world)
    .translate([width / 2, width / 2]),
};

console.log(world);

export default defineStore('world', {
  state: () => ({
    type: '3D',
    year: 1990,
    width: 0,
    pathGenerator: null,
    countries: null,
    data: null,
    group: null,
    projection: null,
  }),

  actions: {
    getRandomColor: () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    setType(type) {
      if (this.type === type) {
        return;
      }
      this.type = type;
      this.projection = projection[this.type](this.width);
      this.pathGenerator = geoPath(this.projection);
    },
    init(width, group) {
      this.width = width;
      this.projection = projection[this.type](this.width);
      this.pathGenerator = geoPath(this.projection);
      this.countries = world.features;
      this.group = group;
      // this.data = data[this.year];
    },
    setYear(year) {
      this.year = year;
      // this.data = data[this.year];
    },
    newPathGenerator() {
      this.pathGenerator = geoPath(this.projection);
    },
  },
});
