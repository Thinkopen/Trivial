const path = require('path');
const config = require('config');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

const isProd = config.get('environment') === 'production';

const rootDir = path.join(__dirname, '..', '..');
const srcDir = path.join(rootDir, 'public', 'src');

function cssLoaders(options = {}) {
  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap,
    },
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
    },
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

    if (loader) {
      loaders.push({
        loader: `${loader}-loader`,
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap,
        }),
      });
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
      });
    }

    return ['vue-style-loader'].concat(loaders);
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus'),
  };
}

const webpackConfig = {
  mode: isProd ? 'production' : 'development',

  context: rootDir,

  entry: {
    app: path.join(srcDir, 'main.js'),
  },

  output: {
    path: path.join(rootDir, 'public', 'dist'),
    filename: isProd ? '[name].[chunkhash].js' : '[name].js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': srcDir,
    },
  },

  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: cssLoaders({
          sourceMap: true,
          extract: isProd,
        }),
        cssSourceMap: true,
        cacheBusting: true,
        transformToRequire: {
          video: ['src', 'poster'],
          source: 'src',
          img: 'src',
          image: 'xlink:href',
        },
      },
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      include: [srcDir],
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'static/img/[name].[hash:7].[ext]',
      },
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'static/media/[name].[hash:7].[ext]',
      },
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'static/fonts/[name].[hash:7].[ext]',
      },
    }],
  },

  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },

  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify(config.get('environment')),
      IS_PROD: isProd,
      BASE_URL: JSON.stringify(config.get('server.baseUrl')),
      QUIZ: JSON.stringify(config.get('quiz')),
      FB_CLIENT_ID: JSON.stringify(config.get('facebook.clientId')),
    }),
  ],
};

if (isProd) {
  webpackConfig.plugins = [
    ...webpackConfig.plugins,

    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
        },
      },
      sourceMap: true,
      parallel: true,
    }),

    new ExtractTextPlugin({
      filename: 'static/css/[name].[contenthash].css',
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),

    new OptimizeCSSPlugin({
      cssProcessorOptions: { safe: true, map: { inline: false } },
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
    }),

    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(path.join(__dirname, '../../node_modules')) === 0
        );
      },
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3,
    }),
  ];
} else {
  webpackConfig.devtool = 'cheap-module-eval-source-map';
  webpackConfig.plugins = [
    ...webpackConfig.plugins,

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),

    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
    }),
    // // copy custom static assets
    // new CopyWebpackPlugin([{
    //   from: path.resolve(__dirname, '../static'),
    //   to: config.dev.assetsSubDirectory,
    //   ignore: ['.*'],
    // }]),
  ];
}

module.exports = webpackConfig;
