// prefer default export if available
const preferDefault = m => m && m.default || m

exports.components = {
  "component---readme-md": () => import("/Users/kations/Projekte/unikit/README.md" /* webpackChunkName: "component---readme-md" */),
  "component---src-flex-flex-mdx": () => import("/Users/kations/Projekte/unikit/src/Flex/flex.mdx" /* webpackChunkName: "component---src-flex-flex-mdx" */),
  "component---src-button-button-mdx": () => import("/Users/kations/Projekte/unikit/src/Button/button.mdx" /* webpackChunkName: "component---src-button-button-mdx" */),
  "component---src-pages-404-js": () => import("/Users/kations/Projekte/unikit/.docz/src/pages/404.js" /* webpackChunkName: "component---src-pages-404-js" */)
}

