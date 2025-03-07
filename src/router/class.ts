const lazyLoad = (file: any) =>
  import(/* webpackChunkName: "[request]" */ `@/views/class/${file}.vue`)

export default [
  {
    path: 'class-list',
    name: 'class-list',
    component: () => lazyLoad('class'),
  },
]
