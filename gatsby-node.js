exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "react-native$": "react-native-web"
      }
    }
  });
};
