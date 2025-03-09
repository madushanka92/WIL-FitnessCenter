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
  {
    path: 'verify-email/:token',
    name: 'verify-email',
    component: () => lazyLoad('verify-email'),
  },
  {
    path: 'forgot-password',
    name: 'forgot-password',
    component: () => lazyLoad('forgot-password'),
  },
  {
    path: 'reset-password/:token',
    name: 'reset-password',
    component: () => lazyLoad('reset-password'),
  },
  {
    path: 'membership-list',
    name: 'membership-list',
    component: () => lazyLoad('membership'),
  },
  {
    path: 'checkout',
    name: 'checkout',
    component: () => lazyLoad('checkout'),
  },
  {
    path: 'my-bookings',
    name: 'my-bookings',
    component: () => lazyLoad('my-bookings'),
  },
]
