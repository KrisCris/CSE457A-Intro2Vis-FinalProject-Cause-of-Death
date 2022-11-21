import { defineStore } from 'pinia';

// import data from '../assets/data/cause_of_deaths.csv';
// import meta from '../assets/data/meta_countries.csv';
import deathReasonNames from '../assets/data/death_reasons.json'
import deathReasons from '../assets/data/reasons.json'

export default defineStore('barChart', {
  state: () => ({
    width: 0,
    year: 1990,
  }),

  actions: {
    init(width) {
      this.width = width;
    },

    setYear(year) {
      this.year = year;
    },

    getYearlyData() {
      return deathReasons[this.year];
    },

    getReasonNames() {
      return deathReasonNames;
    }
  }
});