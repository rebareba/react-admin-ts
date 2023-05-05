import React, {useEffect} from 'react'
import {history, check} from '@utils'
import {Menu, MenuProps} from 'antd'
import {useGlobalStore, EActions} from '@src/store'
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons'
import {IMenuItem} from '@pages/menu-data'
const {SubMenu} = Menu

type TProps = {
  menuData: IMenuItem[]
  theme?: 'light' | 'dark'
  selectedKeys?: string[]
}
const SiderMenu: React.FC<TProps> = ({menuData, theme = 'dark', selectedKeys}) => {
  // console.log('SiderMenu', selectedKeys, menuData)
  const {state, dispatch} = useGlobalStore()
  const {collapsed} = state

  // 全局state数据
  const onMenuSelect = (item: IMenuItem) => {
    // 这里要判断是否是http跳转
    if (check('url', item.route || item.url)) {
      window.open(item.route || item.url, '_blank') //注意第二个参数
    } else {
      history.push(item.route || item.url)
    }
  }
  // 渲染菜单
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
          <Menu.Item key={item.url} onClick={() => onMenuSelect(item)}>
            {item.icon ? item.icon : null}
            <span>{item.name}</span>
          </Menu.Item>,
        )
      }
    })
    return arr
  }

  return (
    <div className="h100 fbv">
      <div className="fb1" style={{height: 0, overflow: 'scroll'}}>
        <Menu
          theme={theme}
          mode="inline"
          inlineIndent={10}
          // onSelect={onMenuSelect}
          openKeys={selectedKeys}
          selectedKeys={selectedKeys}
        >
          {renderMenu(menuData)}
        </Menu>
      </div>
      {/* 底部的收缩 */}
      <div className="p6">
        <div onClick={() => dispatch({type: EActions.SET_STATE, payload: {collapsed: !collapsed}})} className="tal">
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {className: 'fs20 ml10 fcw'})}
        </div>
      </div>
    </div>
  )
}

export default SiderMenu
