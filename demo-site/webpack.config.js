module.exports = {
  entry: ['babel-polyfill', './index.js'],
  output: {
    path: __dirname + '/build',
    filename: 'index.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: [
                'env',
                'react',
                'stage-0'
              ],
              plugins: [
                'transform-decorators-legacy'
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
}
