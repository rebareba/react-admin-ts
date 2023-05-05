// import 'core-js/stable' //如果IE浏览器报错说明 有些组件polyfill有问题 比如@ant-design/pro-components 无需修改 useBuiltIns: 'entry'这个值，保留usage也能解决
import React, {Suspense, useEffect, useMemo, useReducer} from 'react'
import {createRoot} from 'react-dom/client'
import '@common/common.styl'
import {ConfigProvider, Button, Empty, theme} from 'antd'
import {Spin} from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import zhCN from 'antd/locale/zh_CN'
dayjs.locale('zh-cn')
import '@icons' // 导入雪碧图的所有会按需加载

import {history, config, getPageRoutes, getUserMenuMore} from '@utils'
import {Router, Route, Switch, Link, Redirect, RouteComponentProps} from 'react-router-dom'
import './index.css'
import menuData from '@pages/menu-data'

import Frame from '@src/components/Frame'

import Login from '@components/Login'

import Store, {io, fetchs, TFetch, reducer, EActions, useGlobalStore, defaultState} from './store'
import {IMenuItemNew} from './utils/get-page-routes'
import {TProduct} from './store/global.type'
const {pathPrefix} = config

// 动态菜单跳转到第一个
const GoFirst = () => {
  const {state} = useGlobalStore()
  useEffect(() => {
    const routes = getPageRoutes(state.userMenu)
    if (routes[0]) history.replace(routes[0].url)
  }, [state.userMenu])
  return (
    <div className="fac">
      <Spin />
    </div>
  )
}
// 如果模块需要校验登录或全的的高级组件
const CheckLogin: React.FC<RouteComponentProps & {menuItem: IMenuItemNew}> = ({menuItem, ...props}) => {
  const {
    state: {userInfo, loadedUserInfo},
    fetch,
  } = useGlobalStore()
  // 获取用户信息
  useEffect(() => {
    if (!loadedUserInfo) fetch.getUserInfo()
  }, [fetch, loadedUserInfo])

  const {component, permissionKey, permission} = menuItem

  if (loadedUserInfo) {
    if (userInfo) {
      // 这块可以有组件权限的判断
      if (
        !permissionKey ||
        !permission ||
        (userInfo.permissionMap[permissionKey] && userInfo.permissionMap[permissionKey] & (permission as number))
      ) {
        return React.createElement(component, {...props})
      } else {
        return (
          <Empty
            className="mt30"
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: 60,
            }}
            description={<span>没有权限</span>}
          ></Empty>
        )
      }
    } else {
      return (
        <Empty
          className="mt30"
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 60,
          }}
          description={<span>未登录</span>}
        >
          <Button
            type="primary"
            onClick={() => {
              history.push(`${config.pathPrefix}/login`)
            }}
          >
            登录
          </Button>
        </Empty>
      )
    }
  } else {
    return <Spin />
  }
}

const App = () => {
  // 全局的 store
  const [state, dispatch] = useReducer(reducer, Object.assign(defaultState, {userMenu: getUserMenuMore(menuData, {})}))
  // 只会执行一次的
  const fetch = useMemo(() => {
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
            <Route path={`${pathPrefix}/login`} exact component={Login} />
            <Frame>
              <Switch>
                {getPageRoutes(menuData).map((route) => {
                  if (route.needLogin) {
                    return (
                      <Route
                        path={route.url || '/'}
                        render={(props) => <CheckLogin {...props} menuItem={route} />}
                        exact={route.exact}
                        key={route.url}
                      />
                    )
                  }
                  return <Route path={route.url || '/'} component={route.component} exact={route.exact} key={route.url} />
                })}
                <Route exact path="/" component={GoFirst} />
                <Route exact path={`${pathPrefix}`} component={GoFirst} />
                <Route path="/" component={() => <div>404</div>}></Route>
              </Switch>
            </Frame>
          </Switch>
        </Router>
      </Suspense>
    </Store.Provider>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(
  <ConfigProvider
    locale={zhCN}
    theme={{
      // algorithm: theme.compactAlgorithm, //紧凑算法
      token: {
        colorPrimary: '#5A50FF',
      },
    }}
  >
    <App />
  </ConfigProvider>,
)
