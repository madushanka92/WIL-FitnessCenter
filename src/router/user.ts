const lazyLoad = (file: any) =>
  import(/* webpackChunkName: "[request]" */ `@/views/user/${file}.vue`)

export default [
  {
    path: 'signup',
    name: 'user-sign-up',
    component: () => lazyLoad('SignUp'),
  },
  {
    path: 'login',
    name: 'user-log-in',
    component: () => lazyLoad('Login'),
  },
]
