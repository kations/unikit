const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---readme-md": hot(preferDefault(require("/Users/kations/Projekte/unikit/README.md"))),
  "component---src-flex-flex-mdx": hot(preferDefault(require("/Users/kations/Projekte/unikit/src/Flex/flex.mdx"))),
  "component---src-button-button-mdx": hot(preferDefault(require("/Users/kations/Projekte/unikit/src/Button/button.mdx"))),
  "component---src-pages-404-js": hot(preferDefault(require("/Users/kations/Projekte/unikit/.docz/src/pages/404.js")))
}

