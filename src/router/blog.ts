const lazyLoad = (file: any) =>
  import(/* webpackChunkName: "[request]" */ `@/views/blog/${file}.vue`)

export default [
  {
    path: 'blog-list',
    name: 'blog-list',
    component: () => lazyLoad('blog'),
  },
  {
    path: 'blog-post/:id',
    name: 'blog-post-by-id',
    component: () => lazyLoad('blog-post'),
  },
]
