const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');

const common = {
  mode: process.env.NODE_ENV ? "production" : "development",
  context: __dirname,
  output: {
    path: `${__dirname}/dist`,
    publicPath: './',
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
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: ".", to: ".", context: "public" }]
    })
  ],
  watch: process.env.NODE_ENV === 'development',
  devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : undefined
}

const main = {
  ...common,
  target: 'electron-main',
  entry: {
    main: './src/main/main.ts',
  },
};

const preload = {
  ...common,
  target: 'electron-preload',
  entry: {
    preload: './src/main/preload.ts',
  },
};

const renderer = {
  ...common,
  target: 'web',
  entry: {
    app: './src/app.tsx',
  },
}

const config = process.env.NODE_ENV === 'development' ? [renderer] : [main, preload, renderer];
module.exports = config;
