const lazyLoad = (file: any) =>
    import(/* webpackChunkName: "[request]" */ `@/views/trainer/${file}.vue`)
  
  export default [
    {
      path: 'trainers-list',
      name: 'trainer-profile',
      component: () => lazyLoad('trainer'),
    },
  ]
  