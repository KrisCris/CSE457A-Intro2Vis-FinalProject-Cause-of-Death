import { createRouter, createWebHistory } from 'vue-router';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/geo-graph',
      component: () => import('../pages/GeoGraph.vue'),
    },
    {
      path: '/',
      redirect: '/geo-graph',
    },
  ],
});
