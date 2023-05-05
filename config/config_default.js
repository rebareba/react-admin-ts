const pkg = require('../package.json')

// 可以新建config/config.js 来配置本地的配置项来覆盖

module.exports = {
  projectName: pkg.name,
  version: pkg.version,
  // build情况下打包输出的output.path是`dist/${config.projectName}/`
  publicPath: 'auto', // hash路由可以这样 刷新没有问题
  // publicPath: `//cdn.xxx.com/${pkg.name}/`, //cdn.xxx.com 是资源上传到cdn的情况
  publicPath: `/dist/${pkg.name}/`,
  port: 9999, // 端口
  analyzerPort: 8888, // 打包分析的端口 npm run analyzer
  // 接口匹配转发 devServer.proxy
  proxy: {
    '/api/*': {
      target: `http://127.0.0.1:8888`,
      changeOrigin: true, // 支持跨域请求
      secure: true,
    },
  },
  // webpack.externals 打包忽略配置 要在index.html引入public资源
  externals: {
    // react: 'React',
    // 'react-dom': 'ReactDOM',
    // echarts: 'echarts',
  },
  // 多入口情况的重定向
  rewrites: [
    // {
    //   from: /^\/admin/, to: '/admin.html'
    // },
  ],
  // 部署的服务器 在tar时候打印使用
  deployHost: '127.0.0.1',
  // 拉取代码的配置
  pullConf: {
    host: '',
    token: '',
  },
  // 前端代码配置 动态生成config/conf.json中的数据， 也是index.html模板的数据
  conf: {
    // 开发配置
    dev: {
      title: '管理后台',
      pathPrefix: '/admin',
      apiPrefix: '/api',
      debug: true,
      mockAll: true, // 所有有mock数据的接口都使用success的数据
      mock: {
        global: 'success',
        // "global.loginInfo": "failed", // success failed  特殊指定loginInfo方法使用的值
      },
      // 指定index.html public资源的域名 是否是cdn的资源
      publicHost: '',
      // historyType: 'hash',
    },
    // 打包配置
    build: {
      title: '管理后台',
      pathPrefix: '/admin',
      apiPrefix: '/api',
      debug: false,
      mockAll: false,
      mock: {},
      // 指定public资源的域名 是否是cdn的资源
      publicHost: '',
      // historyType: 'hash',
    },
  },
}
