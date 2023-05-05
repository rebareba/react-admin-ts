import React, {useEffect, useMemo, useRef, useState} from 'react'
import {Layout, Spin} from 'antd'
import SiderMenu from './sider-menu'
import FrameHeader from './header'
import {useLocation, useRouteMatch} from 'react-router-dom'
import {useGlobalStore, EActions} from '@src/store'
import {getHeaderMenu, getSiderMenu, getHeaderSelectKey, useSelectKeys} from './utils'
import {IMenuItem} from '@pages/menu-data'

const {Sider, Header, Content} = Layout

type TProps = {
  showBreadcrumb?: boolean
  theme?: 'light' | 'dark'
}

const Frame: React.FC<TProps> = ({showBreadcrumb = true, theme = 'dark', children}) => {
  const {state, dispatch, fetch} = useGlobalStore()
  const {userInfo, userMenu} = state
  // console.log('userMenu', userMenu)
  // 获取用户信息
  useEffect(() => {
    if (!userInfo) fetch.getUserInfo()
  }, [userInfo, fetch])

  // location.pathname 和菜单比较 获取到路由配置的菜单选中key
  const location = useLocation()

  console.log('location', location)
  const selectedkeys = useSelectKeys(location.pathname)

  // 获取头部的菜单
  const headerMenuData: IMenuItem[] = useMemo(() => {
    return getHeaderMenu(userMenu || [])
  }, [userMenu])

  // console.log('headerMenuData', headerMenuData)
  // 获取头部选中的菜单
  const headerSelectdKey: string | undefined = getHeaderSelectKey(selectedkeys, headerMenuData)
  // 侧边的菜单信息
  const [siderMenuData, setSiderMenuData] = useState<IMenuItem[]>([])
  useEffect(() => {
    if (headerSelectdKey === undefined || userMenu?.length === 0) {
      return setSiderMenuData([])
    }
    setSiderMenuData(getSiderMenu(userMenu, headerSelectdKey))
    dispatch({type: EActions.SET_STATE, payload: {collapsed: false}})
  }, [headerSelectdKey, dispatch, userMenu])

  console.log('selectedkeys', headerSelectdKey, selectedkeys)
  return (
    <>
      <Layout className="framePro" style={{minHeight: '100%'}}>
        <Header className="header">
          <FrameHeader
            theme={theme}
            menuData={headerMenuData}
            selectedKey={headerSelectdKey}
            changeSelectKey={() => {
              setSiderMenuData([])
            }}
          />
        </Header>
        <Layout style={{height: 0}}>
          {siderMenuData.length > 0 && (
            <Sider className="sider" collapsed={state.collapsed} theme={theme} collapsedWidth="48" width="208">
              <SiderMenu menuData={siderMenuData} selectedKeys={selectedkeys} />
            </Sider>
          )}
          <Content style={{overflow: 'scroll'}}>{children}</Content>
        </Layout>
      </Layout>
    </>
  )
}

export default Frame
