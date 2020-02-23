const { mergeWith } = require('lodash/fp')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/',

  siteMetadata: {
    title: 'Unikit',
    description: 'universal component library for react and react-native',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {},
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
        menu: [],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [],
        typescript: false,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: false,
        o: false,
        open: false,
        'open-browser': false,
        root: '/Users/kations/Projekte/unikit/.docz',
        base: '/',
        source: './',
        src: './',
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: '.docz/dist',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'Unikit',
        description: 'universal component library for react and react-native',
        host: 'localhost',
        port: 3001,
        p: 3000,
        separator: '-',
        paths: {
          root: '/Users/kations/Projekte/unikit',
          templates:
            '/Users/kations/Projekte/unikit/node_modules/docz-core/dist/templates',
          docz: '/Users/kations/Projekte/unikit/.docz',
          cache: '/Users/kations/Projekte/unikit/.docz/.cache',
          app: '/Users/kations/Projekte/unikit/.docz/app',
          appPackageJson: '/Users/kations/Projekte/unikit/package.json',
          gatsbyConfig: '/Users/kations/Projekte/unikit/gatsby-config.js',
          gatsbyBrowser: '/Users/kations/Projekte/unikit/gatsby-browser.js',
          gatsbyNode: '/Users/kations/Projekte/unikit/gatsby-node.js',
          gatsbySSR: '/Users/kations/Projekte/unikit/gatsby-ssr.js',
          importsJs: '/Users/kations/Projekte/unikit/.docz/app/imports.js',
          rootJs: '/Users/kations/Projekte/unikit/.docz/app/root.jsx',
          indexJs: '/Users/kations/Projekte/unikit/.docz/app/index.jsx',
          indexHtml: '/Users/kations/Projekte/unikit/.docz/app/index.html',
          db: '/Users/kations/Projekte/unikit/.docz/app/db.json',
        },
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
