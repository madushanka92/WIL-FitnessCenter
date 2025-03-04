const lazyLoad = (file: any) =>
  import(/* webpackChunkName: "[request]" */ `@/views/admin/${file}.vue`)

export default [
  {
    path: 'user-roles',
    name: 'user-roles',
    meta: {
      isAdmin: true,
    },
    component: () => lazyLoad('user-roles'),
  },
  {
    path: 'trainers',
    name: 'trainers',
    meta: {
      isAdmin: true,
    },
    component: () => lazyLoad('trainers'),
  },
]
