import VueRouter from 'vue-router';

/* eslint-disable import/no-dynamic-require */
export const routes = [
  {
    path: '/',
    component: resolve => require(['../../pages/layout/layout.vue'], resolve),
    children: [
      {
        name: 'index',
        path: '',
        component: resolve => require(['../../pages/index/index.vue'], resolve)
      },
      {
        name: 'next',
        path: '/next',
        component: resolve => require(['../../pages/next/next.vue'], resolve)
      }
    ]
  }
];

export const createRouter = () => (
  new VueRouter({
    mode: 'history',
    base: '/',
    scrollBehavior: () => {
      setTimeout(() => ({ y: 0 }), 100);
    },
    routes
  })
);
