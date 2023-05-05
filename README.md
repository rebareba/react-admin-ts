### 介绍

一个简单的React脚手架，函数式编程+ Typescript支持

功能：

- 开发打包有不同配置
- eslint 验证
- 代码风格统一
- 接口mock
- 热更新
- 异步组件

### 目录结构

```bash
➜  tree -L 4  -I "node_modules" 
.
├── README.md                        			--- 说明
├── api-cache                        			--- 后端接口请求缓存 gitignore
├── config
│   ├── conf.json    											--- 前端配置 动态生成，修改配置自动东西
│   ├── config.js                         --- 开发自定义配置替换default, git不跟踪
│   ├── config_default.js              		--- 默认的开发配置
│   ├── index.js
│   └── webpack.config.js             		--- webpack配置
├── index.d.ts             								--- 全局TS的类型定义
├── jsconfig.json                     		--- 编辑器js环境配置
├── mock.json                         		--- 动态生成mock文件 gitignore	
├── package.json
├── public																--- 公共资源目录
├── scripts																--- 无需关心的一些脚本
├── src
│   ├── assets                       			--- 前端静态资源存放
│   ├── common                     				--- 公共代码层
│   │   ├── common.styl
│   │   ├── constant.ts
│   │   └── create-io.ts
│   ├── components                  			--- 公共组件层脚手架拥有
│   │   └── Icon
│   ├── hooks                        			--- 全局的hook
│   │   ├── use-antd-table.ts
│   │   └── use-height.ts
│   ├── icons                        			--- svg-sprite-loader的icon
│   ├── index.html                   			--- html-webpack-plugin 模板
│   ├── index.tsx                    			---入口文件
│   ├── pages
│   │   └── index                     		--- Index页面 包含组件目录hooks目录
│   │       ├── components
│   │       ├── hooks
│   │       ├── index.css									--- 几种样式的定义方式
│   │       ├── index.module.css
│   │       ├── index.module.styl
│   │       ├── index.styl
│   │       ├── index.tsx									--- 规定入口名加载main.tsx
│   │       ├── io.ts
│   │       ├── page_index.d.ts           --- 页面模块的头定义，一般不需要
│   │       └── main.tsx									--- 页面主入口
│   ├── store															--- 全局Store的定义   React.createContext()
│   │   ├── actions.ts
│   │   ├── fetchs.ts
│   │   ├── global-mock.json
│   │   ├── index.ts
│   │   ├── io.ts
│   │   └── reducer.ts
│   └── utils															--- 工具方法一个文件一个方法			
│       ├── check.ts
│       ├── config.ts
│       ├── create-request.ts
│       ├── history.ts
│       ├── index.js 											--- 入口 @utils引入
│       ├── mock-data.ts
│       └── storage.js
└── tsconfig.json												  --- ts的配置文件
```

### 常用命令

-  **开发**

```
$ npm start
```


- **生产打包**

```ssh
$ npm run build
$ ls dist 
public       react-admin-ts                  react-admin-ts_1.0.0_public.tgz
```

打包会输出到 `dist/[package.name]/[package.version]` 下 
拷贝`public`和 ` react-admin`文件夹到后端服务的静态资源目录下或通过压缩包解压部署。


- **cdn部署打包**

配置`config/config_default.js`下对应的publicPathHost的值为：`//cdn.xxx.com`

```ssh
npm run build
```


- **eslint验证**

默认配置了vscode和保存修复和dev的校验报错

```ssh
# 测试
$npm run test
# 修复fix
$npm run fix
```

- **生成mock文件数据**

根据api-cache缓存的后端接口信息和对应的xx-mock.json文件添加mock数据到xx-mock.json

```
# 所有：
npm run build-mock mockAll 
# 单个mock文件：
npm run build-mock login
# 单个mock接口：
npm run build-mock login.logout
# 混合
npm run build-mock login.logout user
```

- 生成接口文档

通过mock的json文件来生成接口文档 

```sh
# 默认生产API.md
npm run build-api
# 指定文件名 api-doc.md
npm run build-api api-doc.md
```

### 项目配置

拉取代码后替换所有react-admin-ts为你自己的的项目名称。 

#### 配置解耦

复制`config/config_default.js`为`config/config.js`( 本地配置)会优先使用config.js的配置， 配置文件是包含了webpack相关配置和前端的相关配置(动态生成`utils/config.js`引用)，及接口mock的开关配置。 `npm start` 后会有动态生成conf.json和mock.json

```
├── config
│   ├── conf.json                                    # git 不跟踪
│   ├── config.js                                    # git 不跟踪  本地个人开发
│   ├── config_default.js
│   ├── index.js
│   └── webpack.config.js
├── mock.json                                        # git utils/mock-data.js
```

#### 配置说明

```js
const pkg = require("../package.json");

module.exports = {
  // 名称
  projectName: pkg.name,
  version: pkg.version,
 // build情况下打包输出的output.path是`dist/${config.projectName}/${config.version}`
  // 取值 . 一般是使用hash路由, //cdn.xxx.com 是资源上传到cdn的情况
  publicPathHost: '', // 最终build情况下output.publicPath对应的路径为`${config.publicHost}/${config.projectName}/${config.version}`
  port: 8765, // 端口
  // 接口匹配转发 devServer.proxy
  proxy: {
    "/api/*": {
      target: `http://127.0.0.1:8888`,
      changeOrigin: true, // 支持跨域请求
      secure: true,
    },
  },
  // webpack 打包忽略配置 要在index.html引入public资源
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  // 多入口情况的重定向
  rewrites: [
    // {
    //   from: /^\/admin/, to: '/admin.html'
    // },
  ],
  // 前端代码配置 动态生成config/conf.json中的数据， 也是html-webpack-plugin模板的数据
  conf: {
    // 开发模式配置
    dev: {
      title: "React admin",
      pathPrefix: "",
      // 统一接口前缀 没有写""
      apiPrefix: "/api",
      // 影响mock的处理和log的日志打印
      debug: true,
      // 是否全mock
      mockAll: false, 
      // mock开关配置 
      mock: {
        // 对应global-mock.json的内容login.success 的内容
        "global.login": "success", // failed success
        "global.loginInfo": "failed", // success failed
        "global.logout": "success",
        "login.login": "success",
      },
      // 模板index.html 指定public资源的域名比如生产是cdn的资源 
      publicHost: ''
    },
    // 打包模式配置
    build: {
      title: "React admin",
      pathPrefix: "",
      apiPrefix: "/api",
      debug: false,
      // 前端mock的延迟模拟100毫秒
      delay: 100,
      // 生产走前端mock不走接口
      mock: {},
      publicHost:''
    }
  }
};
```

### 接口请求

#### 接口封装

接口在`src/common/create-request.ts` 中去封装`src/utils/create-request.ts` 

- create-request.ts 对axios的进一步封装，返回了axios的实例instance。 不会 throw error
- create-io.ts  创建axios的实例，并对接口定义和mock进行处理和封装

#### io定义

```ts
// pages/index/io
import {createIo, IApiConf} from '@common/create-io'

export type TDeployInfoItem = {
  deployId: number
  projectId: number
  codeLinkId: number
  name: string
  template: string
  pathPrefix: string
  createUserId: number
  modifyUserId: number
  ctime: string
  mtime: string
}
const apis: Record<'searchProject' | 'generateProject', IApiConf> = {
  searchProject: {
    name: '搜索项目列表',
    method: 'POST',
    url: 'search/projects/:projectId',
  },
  generateProject: {
    method: 'POST',
    name: '生成前端脚手架',
    url: 'generate',
  },
}

export default createIo(apis, 'index')// 对应有index-mock.josn

```

#### 组件中使用

```ts
// /pages/index/main.tsx
import io from './io'
import type {TListItem} from './io'
import {useGlobalStore, EActions} from '@src/store'

const Main: React.FC<TProps> = (props) => {
 const [dataList, setDataList] = useState<TListItem[]>([])
 useEffect(() => {
   	async function fetchData() {
      const {content, success} = await io.searchProject({
        ':projectId': projectId,
        keywords: '其他参数'
      })
      if (success)
        setDataList(
          content.map((item:TListItem) => {
            item.name = item.template
            return item
          }),
        )
    }
    fetchData()
 }, [])
}
export default Main
```

#### 下载实现

```js
import {rejectToData} from '@common/create-io'
 // 生成下载操作
 const generateProject = async () => {
    try {
      const data = await form.validateFields()
      setGenerating(true)
      const content: any = await io.generateProject({
        [rejectToData]: true,
        responseType: 'blob',
        data: {...data, modules: menuData},
      })
      setGenerating(false)
      if (content.success === false) return message.error(content.message)
      const url = window.URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = `${data.packageName}.zip`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {}
}
```

### Mock实现

`npm run dev/build` 会自动在`/` 目录下生成`mock.json`, 是根据src目录下所有以`-mock.json`结尾的文件合成

如存在 `login-mock.json` 可以配置一个name属性值作为接口文档生产使用

```json
// src/pages/login/login-mock.json
{
  "name": "登录模块",
  "login": {
		"failed": {
			"success": false,
			"code": "ERROR_PASS_ERROR",
			"content": null,
			"message": "账号或密码错误!"
		},
		"success": {
			"success": true,
			"code": 0,
			"content": {
				"name": "admin",
				"nickname": "超级管理员",
				"permission": 15
			},
			"message": ""
		}
	}
}
```

则生成的`mock.json`内容为

```json
{
	"login": {
		"login": {
			"success": {
				"success": true,
				"code": 0,
				"content": {
					"name": "admin",
					"nickname": "超级管理员",
					"permission": 15
				},
				"message": ""
			}
		}
	}
}
```

```js
// login-store.js
// 这里的第二个参数就是去对应 login-mock.json文件的内容
const io = createIo(apis, 'login')
```

这里`login-mock.json`对应的login有两种情况 `success` 和 `failed` 在配置文件配置使用个数据

```js
// config.js或 config_default.js
module.exports = {
  // 开发配置
  conf: {
    dev: {
			...
      debug: true,
      mockAll: false,
      // 只有配置了mock的才会使用
      mock: {
        "global": "success", // 表示global全部使用success, 下面可以特殊配置使用其他
        "global.loginInfo": "failed", // 特殊指定
        "login.login": "success" // 也可以改为failed模拟请求失败, 会热更新替换mock.json内容
      }
    },
  }
};
```

mockAll 的值 让所有请求使用success的mock值， 如果mock配置里面有指定配置则使用指定值， 如果指定的值不存在json中 则不使用mock处理


> 这是我们最终要实现的效果，这里有一个约定：**项目目录下所有以`-mock.jsom`文件结尾的文件为mock文件，且文件名不能重复**。

如何实现可以查看`script/api-proxy-cache.js`

每个mock需要新建一个xx-mock.json文件, 至少初始化内容为`{}` 或者`{"name": "模块名称"}`

### 其他

#### 常用实现

##### 使用useContent来实现全局Store

在`src/store`中通过`React.createContext`封装React.useReducer

```tsx
const Store = React.createContext<TContext>({} as TContext)

export const useGlobalStore = (): TContext => {
  const context = useContext(Store)
  return context
}
export default Store
```



```tsx
// src/index.tsx
import Store, {fetchs, TFetch, reducer, defaultState} from './store'

const App = () => {
  // 全局的 store
  const [state, dispatch] = useReducer(reducer, defaultState)

  const fetch = useMemo(() => {
    // 只会执行一次的
    const temp: Partial<TFetch> = {}
    let key: keyof TFetch
    for (key in fetchs) {
      temp[key] = fetchs[key](dispatch)
    }
    return temp as TFetch
  }, [dispatch])

  return (
    <Store.Provider value={{state, dispatch, fetch}}>
      <Suspense
        fallback={
          <div className="fac">
            <Spin />
          </div>
        }
      >
        <Router history={history}>
          <Switch>
            <Route exact path="/index" component={Index}></Route>
            <Route exact path="/404" component={() => <div>404</div>}></Route>
            <Redirect exact from="/" to="/index" />
            <Redirect from="/" to="/404" />
          </Switch>
        </Router>
      </Suspense>
    </Store.Provider>
  )
}
```

页面中

```tsx
import {useGlobalStore, EActions} from '@src/store'

const Main: React.FC<TProps> = (props) => {
  // const a: string = props.cdc
  const {
    state: {userInfo, breadcrumb},
    fetch,
    dispatch,
  } = useGlobalStore()
  // 导航栏变化
  useEffect(() => {
    dispatch({
      type: EActions.SET_BREADCRUMB,
      payload: [{name: '首页'}, {name: '个人中心'}],
    })
  }, [dispatch])
  // 获取用户信息
  useEffect(() => {
    if (!userInfo) {
      fetch.getUserInfo()
    }
  }, [userInfo, fetch])
 return (
    <div className="h100 fbv fbac fbjc">
       <div className={styl.test}>
        接口获取数据：{userInfo?.nickname}-{userInfo?.roleName}
      </div>
  	</div>
  )
}
Main.defaultProps = {
  page: '首页',
}

export default Main
```



##### 使用拦截器和本地缓存实现token请求头会话

在登录接口的返回token存入本地存储 `sessionStorage.get('token', tokenValue) `

在`src/common/create-io.ts`的拦截器通过本地存储注入token请求头

```tsx
import {localStorage} from '@utils'

export const request = creatRequest({
  requestInterceptor: (conf) => {
  	conf.headers.aiApiToken = sessionStorage.get('token') || ''
		return conf
  },
})
```

#### 项目部署

```
$ npm run build
$ ls dist 
public                                 react-admin                  react-admin_0.1.0_public.tgz
$ ls dist/react-admin-ts                                                        
0.0.0      index.html
```

这里build会自动拷贝出打包出来的html文件到`dist/react-admin` 作为模板文件， 在配置模板路径`viewPath: "react-admin/index.html"`

##### Nginx部署

假设Nginx web目录在`/data/nginx/web/`上传打包的静态文件到该目录下

```
$scp -r dist/react-admin-ts deploy@127.0.0.1:/data/nginx/web/

# 这个后续没有修改只需上传一次
$scp -r dist/public deploy@127.0.0.1:/data/nginx/web/
```

nginx配置

```
server {
        listen       80;
        server_name  test.com;
        access_log  /opt/third/nginx/logs/vhosts/test.access.log main;

        location ^~ /api/ {
          proxy_redirect off;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          client_max_body_size 100M;
          proxy_buffering on;
          proxy_buffer_size          128k;
          proxy_buffers              4 256k;
          proxy_busy_buffers_size    256k;
          proxy_pass http://127.0.0.1:8881/api;
        }
        
        location / {
        	root /data/nginx/web/;
        	index index.html;
        	try_files $uri $uri /react-admin-ts/index.html =500;
        	
        }
}
```

#### Commit 规范

```js
<type>: <description>
```

格式说明：
`<type>`(必须)：代表某次提交的类型，所有的type类型如下

- `build`：修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
- `ci`：修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
- `docs`：文档更新，如README, CHANGELOG等
- `feat`：新增功能
- `fix`：修复bug
- `perf`：优化相关，如提升性能、体验等
- `refactor`：重构代码，既没有新增功能，也没有修复 bug
- `style`：不影响程序逻辑的代码修改(修改空白字符，格式缩进、补全缺失的分号等)
- `test`：新增测试用例或是更新现有测试
- `revert`：回滚某个更早之前的提交
- `chore`：其他类型，如改变构建流程、或者增加依赖库、工具等

`<description>`(必须)： 描述简要描述本次改动，概述就好了

示例

```
# 增加一个的导出功能
git commit -m "feat: 增加预测用户列表导出功能"

# 修改了翻页bug
git commit -m "fix: 修改了预测用户翻页bug"

# 优化某某功能
git commit -m "perf: 优化了预测用户接口响应太慢"

# 修改了xx处缺少分号问题
git commit -m "style: 修改xx处缺少分号问题"
```

#### 通用组件开发

目录`src/components` 下
通用组件推荐使用react hooks编写，组件尽量写成纯函数

```js
import React, { useState } from "react";

export default function  Button()  {
  const  [buttonText, setButtonText] =  useState("Click me,   please");

  function handleClick()  {
    return setButtonText("Thanks, been clicked!");
  }

  return  <button  onClick={handleClick}>{buttonText}</button>;
}
```

#### 常用网站

- [CDN资源](https://www.bootcdn.cn)

  到CDN 下载第三方product的min文件到 src/pubic/xxx/version/xx.js 然后resov

- [Antd  组件](https://ant.design/components/overview-cn/) Web 应用提供了丰富的基础UI 组件

- [ProComponents](https://procomponents.ant.design/components) 是基于 Ant Design 而开发的模板组件，提供了更高级别的抽象支持，开箱即用。可以显著的提升制作 CRUD 页面的效率，更加专注于页面

- [React官网文档](https://zh-hans.reactjs.org/docs/getting-started.html)

- [prettier-eslint](https://github.com/prettier/prettier-eslint)

- [ahooks](https://ahooks.js.org/zh-CN/guide)一套高质量可靠的 React Hooks 库

### NPM 包选择

- hook库  [ahooks](https://ahooks.js.org/zh-CN/guide)
- 组件库  [Antd  组件](https://ant.design/components/overview-cn/)
- 富文本编辑器 [react-quill](https://github.com/zenoamaro/react-quill) [quill接口文档](https://quilljs.com/docs/api/)
- 前端压缩图片 [compressorjs](https://github.com/fengyuanchen/compressorjs)

### 问题

