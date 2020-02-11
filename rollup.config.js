import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import resolve from "rollup-plugin-node-resolve";
import url from "rollup-plugin-url";
import svgr from "@svgr/rollup";
import json from "rollup-plugin-json";

import pkg from "./package.json";

export default {
  input: "src/index.js",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    postcss({
      modules: true
    }),
    url(),
    svgr(),
    babel({
      exclude: "node_modules/**",
      plugins: [
        "external-helpers",
        "transform-object-rest-spread",
        "transform-remove-console"
      ]
    }),
    resolve({
      extensions: [".web.js", ".js", ".jsx", ".json", ".native.js"]
    }),
    commonjs({
      include: "node_modules/**",
      namedExports: {
        "node_modules/react-is/index.js": [
          "isElement",
          "ForwardRef",
          "isValidElementType"
        ],
        "node_modules/react-native-web/node_modules/fbjs/lib/ExecutionEnvironment.js": [
          "canUseDOM"
        ]
      }
    }),
    json({
      // All JSON files will be parsed by default,
      // but you can also specifically include/exclude files
      include: "node_modules/**",
      exclude: [],

      // for tree-shaking, properties will be declared as
      // variables, using either `var` or `const`
      preferConst: true, // Default: false

      // specify indentation for the generated default export —
      // defaults to '\t'
      indent: "  ",

      // ignores indent and generates the smallest code
      compact: true, // Default: false

      // generate a named export for every property of the JSON object
      namedExports: true // Default: true
    })
  ],
  external: [
    "styled-components",
    "react",
    "react-spring",
    "react-native",
    "react-native-web"
  ],
  globals: {
    react: "React",
    "styled-components": "styled"
  }
};
