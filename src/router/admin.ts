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
    path: 'admin-class',
    name: 'admin-class',
    meta: {
      isAdmin: true,
    },
    component: () => lazyLoad('class-info'),
  },
  {
    path: 'view-users',
    name: 'view-users',
    meta: {
      isAdmin: true,
    },
    component: () => lazyLoad('view-users'),
  },
  {
    path: 'trainers',
    name: 'trainers',
    meta: {
      isAdmin: true,
    },
    component: () => lazyLoad('trainers'),
  },
  {
    path: 'promotionAdmin',
    name: 'promotionAdmin',
    meta: {
      isAdmin: true,
    },
    component: () => lazyLoad('promotionAdmin'),
  },
]
