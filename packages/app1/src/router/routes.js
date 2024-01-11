
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'user', component: () => import('pages/UserPage.vue') },
      { path: 'commit', component: () => import('pages/CommitPage.vue') },
      { path: 'look_single', component: () => import('pages/LookSingleCommitPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
