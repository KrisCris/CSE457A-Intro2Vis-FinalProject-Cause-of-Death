import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './assets/styles/index.scss';
import Icon from './components/Icon.vue';
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register';
import router from './router';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { RecycleScroller } from 'vue-virtual-scroller'


createApp(App)
  .component('icon', Icon)
  .use(router)
  .use(createPinia())
  .component('RecycleScroller', RecycleScroller)
  .mount('#app');
