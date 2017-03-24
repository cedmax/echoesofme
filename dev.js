const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const backEndServer = require('./server')
const webpackConfig = require('./webpack.config')
const config = require('./settings')


function frontEndServer (port) {
  new WebpackDevServer(webpack(webpackConfig), {
    proxy: {
      '*': `http://localhost:${port}`
    },
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true
  }).listen(port - 1, webpackConfig.host, (err) => {
    if (err) {
      console.log(err)
    }

    console.log(`Listening at http://${webpackConfig.host}:${port - 1}`)
  })
}

frontEndServer(config.port)
backEndServer(config.port)
