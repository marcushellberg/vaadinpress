import { Route, Router } from '@vaadin/router';

import './views/list-view';
import './views/post-view';
import './views/admin/admin-view';
import './views/admin/posts/posts-view';
import './views/admin/posts/post-edit-view';
import './views/admin/settings/settings-view';

const routes: Route[] = [
  {
    path: 'admin',
    component: 'admin-view',
    children: [
      { path: '/', component: 'settings-view' },
      { path: '/settings', component: 'settings-view' },
      { path: '/posts', component: 'posts-view' },
      { path: '/posts/:postId', component: 'post-edit-view' },
    ],
  },
  { path: '/:slug', component: 'post-view' },
  { path: '/', component: 'list-view' },
];

export const router = new Router(document.querySelector('#outlet'));
router.setRoutes(routes);
