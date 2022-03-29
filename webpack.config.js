const path = require('path')
const CopyWebpackPlugin = require("copy-webpack-plugin");

const common = {
  mode: process.env.NODE_ENV === 'development' ? "development" : "production",
  context: __dirname,
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
  watch: process.env.NODE_ENV === 'development',
  cache: true,
  devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : undefined,
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: ".", to: ".", context: "public" }]
    })
  ],
}

const main = {
  ...common,
  entry: {
    background: path.join(__dirname, 'src', 'app.ts'),
  },
};

const settings = {
  ...common,
  entry: {
    settings: path.join(__dirname, 'src', 'views', 'settings.tsx')
  }
}

const popup = {
  ...common,
  entry: {
    popup: path.join(__dirname, 'src', 'views', 'popup.tsx')
  }
}

module.exports = [main, settings, popup];
