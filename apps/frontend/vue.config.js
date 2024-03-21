module.exports = {
  configureWebpack: {
    devServer: {
      headers: { 'Access-Control-Allow-Origin': '*' },
      disableHostCheck: true,
    },
  },
  chainWebpack: (config) => {
    // Exclude `node_modules` from processing by PostCSS
    config.module.rule('css').exclude.add(/node_modules/);
    config.module.rule('vue').exclude.add(/node_modules/);
  },
};
