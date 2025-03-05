const lazyLoad = (file: any) =>
  import(/* webpackChunkName: "[request]" */ `@/views/class/${file}.vue`)

export default [
  {
    path: 'class-list',
    name: 'user-roles',
    component: () => lazyLoad('class'),
  },
]
