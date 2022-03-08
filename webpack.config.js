const path = require('path')
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
  mode: process.env.NODE_ENV ? "productions" : "development",
  context: __dirname,
  entry: {
    index: path.join(__dirname, 'src', 'app.ts'),
  },
  output: {
    path: `${__dirname}/dist`,
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        use: "ts-loader",
        exclude: ["/node_modules/"]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  devtool: 'inline-source-map',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: ".", to: ".", context: "public" }]
    })
  ],
}
