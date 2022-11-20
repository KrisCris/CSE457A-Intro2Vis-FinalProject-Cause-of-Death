import { createRouter, createWebHashHistory } from 'vue-router';

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/geo-graph',
      component: () => import('../pages/GeoGraph/index.vue'),
    },
    {
      // to be replaced
      path: '/test-graph',
      component: () => import('../pages/TestGraph/TestGraph.vue'),
    },
    {
      path: '/process-book',
      component: () => import('../pages/ProcessBook/index.vue'),
    },
    {
      path: '/about',
      component: () => import('../pages/About/index.vue'),
    },
    {
      path: '/',
      redirect: '/geo-graph',
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/',
    },
  ],
});
