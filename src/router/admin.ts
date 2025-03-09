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
    path: 'view-testimonials',
    name: 'view-testimonials',
    meta: {
      isAdmin: true,
    },
    component: () => lazyLoad('view-testimonials'),
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
    path: 'manage-blogs',
    name: 'manage-blogs',
    meta: {
      isAdmin: true,
    },
    component: () => lazyLoad('manage-blogs'),
  },
  {
    path: '/manage-blogs/create',
    name: 'manage-blogs-create',
    meta: {
      isAdmin: true,
    },
    component: () => lazyLoad('blog-form'),
  },
]
