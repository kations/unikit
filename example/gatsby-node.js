const path = require('path');
const { resolver } = require('./metro.config');

const root = path.resolve(__dirname, '..');
const node_modules = path.join(__dirname, 'node_modules');

exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        ...resolver.extraNodeModules,
        'react-native-web': path.join(node_modules, 'react-native-web'),
      },
    },
  });
};
