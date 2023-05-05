/* eslint-disable no-console */
/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2023-04-25 10:58:58
 * @Description:  基础的webpack 配置
 */
const webpack = require('webpack')
const path = require('path')
const os = require('os')
require('colors')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// 热更新
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
// 静态资源输出
const CopyWebpackPlugin = require('copy-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 提取css到单独文件
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') //压缩css样式
const TerserPlugin = require('terser-webpack-plugin') // 压缩js的
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer') // 打包性能分析

const {getIPAdress, resolve} = require('../scripts/util')
const {init, getConf} = require('../scripts/webpack-init')
init()
// 配置文件
const config = require('.')

const isDev = process.env.BUILD_ENV ? false : true

const publicPath = isDev ? '/' : config.publicPath || ''

console.log('isDev:', isDev)

// 接口请求本地缓存
const apiProxyCache = require('../scripts/api-proxy-cache')
for (const key in config.proxy) {
  config.proxy[key] = Object.assign(config.proxy[key], apiProxyCache)
}

// cpu核数
const threads = os.cpus().length

module.exports = {
  entry: './src/index.tsx',
  target: ['web', 'es5'],
  mode: isDev ? 'development' : 'production',
  output: {
    path: isDev ? resolve('dist') : resolve(`dist/${config.projectName}/`),
    filename: `${config.version}/index.js`,
    // filename: '[name].bundle.js',
    publicPath: publicPath,
    // libraryTarget: "umd"
    chunkFilename: `${config.version}/js/chunk.[id].[name].js`,
  },
  devtool: isDev ? 'cheap-module-source-map' : 'source-map', // 生产可以 "source-map"
  devServer: {
    // v4版本的改变了好多
    static: {
      directory: resolve('public'),
      publicPath: '/public', // 告诉服务器在哪个 URL 上提供 static.directory 的内容
    },
    client: {
      //错误显示全屏
      // overlay: true,
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    // 支持跨域
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Method': '*',
      'Access-Control-Allow-Headers': '*',
    },
    historyApiFallback: {
      // 这个很关键如果是单页面就这样配置 不然不是/ 路由找不到页面
      disableDotRule: true,
      // 指明哪些路径映射到哪个html
      rewrites: config.rewrites,
    },
    proxy: config.proxy,
    compress: true,
    port: config.port,
    host: '0.0.0.0',
    open: {
      target: `http://127.0.0.1:${config.port}`,
    },
    allowedHosts: 'all',
  },
  resolve: {
    modules: [resolve('node_modules')], // 配置 Webpack 去哪些目录下寻找第三方模块。当安装的第三方模块都放在项目根目录下的 ./node_modules 目录下时，没有必要按照默认的方式去一层层的寻找
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    alias: {
      // '@': resolve('.'),
      '@src': resolve('src'),
      '@pages': resolve('src/pages'),
      '@store': resolve('src/store'),
      '@components': resolve('src/components'),
      '@utils': resolve('src/utils'),
      '@i18n': resolve('src/i18n'),
      '@icons': resolve('src/icons'),
      '@assets': resolve('src/assets'),
      '@common': resolve('src/common'),
      '@hooks': resolve('src/hooks'),
    },
  },
  // 配置如何展示性能提示。例如，如果一个资源超过 250kb，webpack 会对此输出一个警告来通知你。
  performance: {
    hints: isDev ? false : 'warning',
    // 针对指定的入口最大体积
    maxEntrypointSize: 400000,
    // webpack 生成的任何文件
    maxAssetSize: 100000,
  },
  // 在开发的命令控制台显示的信息控制
  stats: {
    preset: 'errors-warnings',
  },
  // 第三方库不打包, dev情况要引入所有和热更新有关
  externals: isDev ? {} : config.externals,
  optimization: {
    // splitChunks: {
    //   chunks: 'all',
    //   // 待会直接自己试一下
    //   cacheGroups: {
    //     libs: {
    //       name: 'chunk-libs',
    //       test: /[\\/]node_modules[\\/]/,
    //       priority: 10,
    //       chunks: 'initial',
    //     },
    //     defaultVendors: {
    //       test: /\/src\//,
    //       name: 'rise',
    //       chunks: 'all',
    //       reuseExistingChunk: true,
    //     },
    //     default: {
    //       minChunks: 2,
    //       priority: -20,
    //       reuseExistingChunk: true,
    //     },
    //   },
    // },
    minimize: !isDev,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: false, // 默认false，设置为true, 则会删除所有console.* 相关的代码。
            pure_funcs: ['console.log'], // 单纯禁用console.log
          },
        },
        // parallel: threads, // 开启多进程 大型项目可以配置 默认 true
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        // exclude: /node_modules/,
        // include: [resolve('src')],
        use: [
          // {
          //   loader: 'thread-loader', //开启多进程
          //   options: {
          //     workers: threads, //数量
          //   },
          // },
          {
            loader: 'babel-loader',
            options: {
              // babel 转义的配置选项
              // 只对src目录下的文件使用babel-loader处理，可以缩小命中范围
              include: resolve('src'),
              babelrc: false, // 不使用.babelrc文件
              presets: [
                //按需 polyfill 参考  https://segmentfault.com/a/1190000021188054
                [
                  // https://babeljs.io/docs/en/babel-preset-env
                  '@babel/preset-env',
                  // babel/polyfill + core-js@3
                  {
                    useBuiltIns: 'usage',
                    corejs: {version: 3, proposals: true},
                    // 执行 npx browserslist  查看版本
                    targets: {
                      // browsers: 'last 2 versions',
                      edge: '16',
                      ie: '9',
                      chrome: '49',
                    },
                  },
                ],
                ['@babel/preset-react', {runtime: 'automatic'}],
                '@babel/preset-typescript',
              ],
              plugins: [
                // 如果antd css 引用的是cdn或公共资源就可以注释， 这里的是按需加载css 所以不需要全局引入全量的andt.css
                // ['import', {libraryName: 'antd', style: 'css'}, 'antd'],
                // ["import", { "libraryName": "antd-mobile", "style": 'css'}, "antd-mobile"],
                // ['@babel/plugin-proposal-decorators', {legacy: true}], // 装饰器
                // ['@babel/plugin-proposal-class-properties', {loose: true}], // class
                // ['@babel/plugin-proposal-private-property-in-object', {loose: true}], // 私有属性
                // ['@babel/plugin-proposal-private-methods', {loose: true}],// 私有方法
                isDev && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
              cacheDirectory: true,
              cacheCompression: false, // 缓存文件不要压缩
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: [resolve('src')],
        exclude: /\.module.css$/,
        use: [
          isDev && 'style-loader',
          !isDev && {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              // modules: true, // 启用/禁用 CSS 模块和设置模式 启用的话样式会hash
            },
          },
          'postcss-loader',
        ].filter(Boolean),
      },
      {
        test: /\.module.css$/,
        use: [
          isDev && 'style-loader',
          !isDev && {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              modules: true, // 启用/禁用 CSS 模块和设置模式 启用的话样式会hash
            },
          },
        ].filter(Boolean),
      },
      {
        test: /\.styl$/,
        include: /src/,
        exclude: /node_modules/,
        use: [
          isDev && 'style-loader',
          !isDev && {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                //    // styl 模块的写法格式: xxxx.module.styl
                auto: /\.module\.styl$/,
                localIdentName: '[local]-[hash:5]',
                exportLocalsConvention: 'camelCase',
              },
            },
          },
          'stylus-loader',
        ].filter(Boolean),
      },
      {
        test: /\.less$/,
        use: [
          isDev && 'style-loader',
          !isDev && {
            // MiniCssExtractPlugin 不支持热更新
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {loader: 'css-loader', options: {modules: false}},
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true, // 选择是antd的支持
                // modifyVars: config.antdThemeConfig || {},
              },
            },
          },
        ].filter(Boolean),
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        include: /src/,
        exclude: /src\/icons/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: `${config.version}/static/[name].[hash:8].[ext]`,
              limit: 10000,
              esModule: false, // css url中加载图片问题
            },
          },
        ],
        type: 'javascript/auto', // 解决 css url中加载图片问题
      },
      {
        test: /\.svg$/,
        include: /src\/icons/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              // symbolId:'icon-[name]' // 对应为<use xlinkHref="#icon-user" /> 默认<use xlinkHref="#user" />
            },
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                {name: 'removeTitle'},
                {
                  name: 'convertColors',
                  params: {shorthex: true},
                },
                {name: 'convertPathData'},
                {name: 'removeComments'},
                {name: 'removeDesc'},
                {name: 'removeUselessDefs'},
                {name: 'removeEmptyAttrs'},
                {name: 'removeHiddenElems'},
                {name: 'removeEmptyText'},
                {name: 'removeUselessStrokeAndFill'},
                {name: 'moveElemsAttrsToGroup'},
                {name: 'removeStyleElement'},
                {name: 'cleanupEnableBackground'},
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    !isDev &&
      process.env.BUILD_ENV === 'analyzer' &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: config.analyzerPort || 8888,
        // reportFilename: 'report.html',
        // defaultSizes: 'parsed',
        // openAnalyzer: true,
        // generateStatsFile: false,
        // statsFilename: 'stats.json',
        // statsOptions: null,
        // logLevel: 'info',
      }),
    isDev &&
      new ForkTsCheckerWebpackPlugin({
        async: true,
      }),
    !isDev && // build才需要
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: `${config.version}/css/[name].css`,
        //  filename: 'css/built.[chunkhash:10].css',
        chunkFilename: `${config.version}/css/[name].[chunkhash:10].css`,
        ignoreOrder: true,
      }),
    new HtmlWebpackPlugin({
      //... 这里还可以有配置文件 使用ejs模板引擎
      ...getConf(),
      template: resolve(`src/index.html`), // 要处理的html
      filename: 'index.html', // 处理后的html名称
      inject: 'head', // 自动注入js到什么地方
      minify: {
        // 压缩优化HTML页面
        collapseWhitespace: false, // 合并空白字符
        removeComments: true, // 移除注释
        removeAttributeQuotes: true, // 移除属性上的引号
      },
    }),
    isDev &&
      new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`http://${getIPAdress()}:${config.port} 或 http://127.0.0.1:${config.port}`.green],
        },
        onErrors: (severity, errors) => {
          if (severity !== 'error') {
            console.log(`访问：http://${getIPAdress()}:${config.port} 或 http://127.0.0.1:${config.port} 打开`.green)
            return
          }
        },
        clearConsole: true,
      }),
    isDev && new webpack.HotModuleReplacementPlugin(), // 模块热更新 只能开发配置
    isDev && new ReactRefreshWebpackPlugin(),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      // 指定检查文件的根目录
      context: resolve('src'),
      // exclude: 'node_modules', // 默认值
      cache: true, // 开启缓存
      cacheLocation: resolve('node_modules/.cache/.eslintcache'), // 缓存目录
      // threads, //开启多进程
    }),
    !isDev &&
      new CopyWebpackPlugin({
        patterns: [
          {
            from: resolve('public'),
            to: resolve('dist/public'),
          },
        ],
      }),
    !isDev &&
      new CleanWebpackPlugin({
        verbose: true, // 开启在控制台输出信息
        // dry Use boolean "true" to test/emulate delete. (will not remove files).
        // Default: false - remove files
        dry: false,
        cleanOnceBeforeBuildPatterns: [resolve(`dist/${config.projectName}`), resolve('dist/public')],
      }),
  ].filter(Boolean),
}

// 入口文件 获取src 目录下的js或jsx文件作为入口文件
// const entry = {}
// const entryFiles = fs.readdirSync(path.join(__dirname, '../src'))
// entryFiles.forEach((file) => {
//   const p = path.parse(file)
//   if (['.tsx', '.jsx'].indexOf(p.ext) >= 0) {
//     entry[p.name] = path.join(__dirname, '../src', file)
//   }
// })

// 入口文件 和pages下的html对应
// Object.keys(entry).forEach((fileIndex) => {
//   const filename = fileIndex
//   webpackConf.plugins.push(
//     new HtmlWebpackPlugin({
//       ...getConf(),
//       template:  resolve(`src/${fileIndex}.html`), // 指定模板路径
//       filename: `${filename}.html`,
//       inject: true,
//       chunks: ['vendor', fileIndex],
//       minify: {
//         collapseWhitespace: true,
//         removeComments: true
//       }
//     }),
//   )
// })
// module.exports = webpackConf
