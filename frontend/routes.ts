import { Router } from '@vaadin/router';

const routes = [
  {
    path: 'admin',
    component: 'main-view',
    action: async () => {
      await import('./views/main/main-view');
    },
    children: [
      {
        path: '',
        component: 'settings-view',
        action: async () => {
          await import('./views/settings/settings-view');
        },
      },
      {
        path: 'settings',
        component: 'settings-view',
        action: async () => {
          await import('./views/settings/settings-view');
        },
      },
      {
        path: 'posts',
        component: 'posts-view',
        action: async () => {
          await import('./views/posts/posts-view');
        },
      },
    ],
  },
];

export const router = new Router(document.querySelector('#outlet'));
router.setRoutes(routes);
