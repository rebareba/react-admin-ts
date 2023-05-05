import React, {useEffect, MouseEvent} from 'react'

import logo from '@assets/svg/logo.svg'
import {useLocation, Link} from 'react-router-dom'
import {Menu, Dropdown, Breadcrumb, Button, Space, Select} from 'antd'
import {DownOutlined} from '@ant-design/icons'
import {useGlobalStore, EActions} from '@src/store'
import {history, config, check} from '@src/utils'
import {IMenuItem} from '@pages/menu-data'

const {SubMenu} = Menu

type TProps = {
  theme?: 'light' | 'dark'
  menuData: IMenuItem[]
  selectedKey?: string
  changeSelectKey?: (selcetKey: string) => void
}
const FrameHeader: React.FC<TProps> = ({menuData, selectedKey, theme = 'dark', changeSelectKey}) => {
  const {state, dispatch, fetch} = useGlobalStore()
  const {userInfo, title} = state

  // 全局state数据
  const onMenuSelect = (e: MouseEvent, item: IMenuItem) => {
    // 这里要判断是否是http跳转
    if (check('url', item.route || item.url)) {
      e.stopPropagation()
      if (item.disabled) return
      window.open(item.route || item.url, '_blank') //注意第二个参数
    } else {
      if (item.disabled || item.url === selectedKey) return
      changeSelectKey && changeSelectKey(item.url)
      history.push(item.route || item.url)
    }
  }
  // 选中菜单 这个可以使用useMeno
  const renderMenu = (menuData: IMenuItem[] = []): React.ReactNode[] => {
    const arr: React.ReactNode[] = []
    menuData.forEach((item) => {
      if (item.children) {
        arr.push(
          <SubMenu
            title={
              <span>
                {item.icon ? item.icon : null}
                <span>{item.name}</span>
              </span>
            }
            key={item.url}
          >
            {renderMenu(item.children)}
          </SubMenu>,
        )
      } else {
        arr.push(
          <Menu.Item key={item.url} style={{padding: '0 0'}} disabled={item.disabled}>
            <div onClick={(e: MouseEvent) => onMenuSelect(e, item)} style={{padding: '0 20px'}}>
              {item.icon ? item.icon : null}
              <span>{item.name}</span>
            </div>
          </Menu.Item>,
        )
      }
    })
    return arr
  }

  return (
    <div className="fbh fbac h100">
      <div className="logo p2 ml10">
        <img className="h100" src={logo} />
      </div>
      <div
        className="fs18 ml10 fw500 hand"
        style={{minWidth: 120}}
        onClick={() => {
          history.push(`${config.pathPrefix}`)
        }}
      >
        {title}
      </div>
      <div className="fb1">
        {menuData.length > 0 && (
          <Menu
            style={{backgroundColor: 'inherit', borderBottom: 'none'}}
            theme={theme}
            mode="horizontal"
            inlineIndent={10}
            // openKeys={openKeys}
            selectedKeys={selectedKey ? [selectedKey] : []}
          >
            {renderMenu(menuData)}
          </Menu>
        )}
      </div>
      <Space className="mr10">
        {/* {userInfo ? (
          <Dropdown
            placement="bottomRight"
            overlay={
              <Menu theme="dark">
                <Menu.Item key="0">
                  <Link to={`${config.pathPrefix}/home`}>个人中心</Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="1" onClick={fetch.logout}>
                  退出登录
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <div className="fbh fbac fbje hand">
              <div className="ml8">
                {userInfo?.nickname} <DownOutlined />
              </div>
            </div>
          </Dropdown>
        ) : (
          <Button
            type="primary"
            onClick={() => {
              history.push(`${config.pathPrefix}/login`)
            }}
          >
            登录
          </Button>
        )} */}
      </Space>
    </div>
  )
}
export default FrameHeader
