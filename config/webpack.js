const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv !== 'production';

const USE_CSS_MODULES = true;

const getPlugins = () => {
  const plugins = [
    new ManifestPlugin({
      fileName: path.resolve(process.cwd(), 'public/webpack-assets.json'),
      filter: file => file.isInitial
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : '[name].[contenthash:8].css',
      chunkFilename: isDev ? '[id].chunk.css' : '[id].[contenthash:8].chunk.css'
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: JSON.stringify(nodeEnv) }),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEV__: isDev
    })
  ];

  if (isDev) {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
    );
  } else {
    plugins.push(
      new webpack.HashedModuleIdsPlugin(),

      new CompressionPlugin({
        test: /\.jsx?|tsx?$|\.css$|\.(scss|sass)$|\.html$/,
        threshold: 10240
      }),
      new OptimizeCssAssetsPlugin(),
      new LodashModuleReplacementPlugin(),
      new BundleAnalyzerPlugin({
        analyzerMode: process.env.NODE_ENV === 'analyze' ? 'server' : 'disabled'
      })
    );
  }

  return plugins;
};

const getEntry = () => {
  let entry = [
    'webpack-hot-middleware/client?reload=true',
    './src/client'
  ];
  if (!isDev) entry = ['./src/client']

  return entry;
};

const config = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval' : '',
  context: path.resolve(process.cwd()),
  entry: getEntry(),
  optimization: {
    splitChunks: {
      chunks: isDev ? 'async' : 'all'
    }
  },
  output: {
    path: path.resolve(process.cwd(), 'public/assets'),
    publicPath: '/assets/',
    filename: isDev ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDev ? '[id].chunk.js' : '[id].[chunkhash:8].chunk.js',
    pathinfo: isDev
  },
  module: {
    rules: [
      {
        test: /\.mjsx?|\.jsx?|tsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.css$/,
        use: [
          'css-hot',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css',
            options: {
              importLoaders: 1,
              modules: USE_CSS_MODULES,
              localIdentName: '[name]__[local]--[hash:base64:5]',
              context: path.resolve(process.cwd(), 'src'),
              sourceMap: true
            }
          },
          { loader: 'postcss', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          'css-hot',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css',
            options: {
              importLoaders: 2,
              modules: USE_CSS_MODULES,
              localIdentName: '[name]__[local]--[hash:base64:5]',
              context: path.resolve(process.cwd(), 'src'),
              sourceMap: true
            }
          },
          { loader: 'postcss', options: { sourceMap: true } },
          {
            loader: 'sass',
            options: {
              outputStyle: 'expanded',
              sourceMap: true,
              sourceMapContents: !isDev
            }
          }
        ]
      },
      {
        test: /\.(woff2?|ttf|eot|svg)$/,
        loader: 'url',
        options: { limit: 10240, name: '[name].[hash:8].[ext]' }
      },
      {
        test: /\.(gif|png|jpe?g|webp)$/,
        // Any image below or equal to 10K will be converted to inline base64 instead
        loader: 'url',
        options: { limit: 10240, name: '[name].[hash:8].[ext]' }
      }
    ]
  },
  plugins: getPlugins(),
  resolveLoader: {
    // Use loaders without the -loader suffix
    moduleExtensions: ['-loader']
  },
  resolve: {
    modules: ['src', 'node_modules'],
    descriptionFiles: ['package.json'],
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  },
  cache: isDev,
};

module.exports = config;
