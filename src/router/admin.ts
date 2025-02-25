const lazyLoad = (file: any) =>
  import(/* webpackChunkName: "[request]" */ `@/views/admin/${file}.vue`)

export default [
  {
    path: 'user-roles',
    name: 'user-roles',
    component: () => lazyLoad('user-roles'),
  },
]
