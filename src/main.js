import { createApp } from 'vue';
import App from './App.vue';
import './assets/styles/index.scss';
import Icon from './components/Icon.vue';
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register';

createApp(App)
  .component('icon', Icon)
  .mount('#app');
