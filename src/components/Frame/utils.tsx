/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2023-04-18 20:36:50
 * @Description:
 */

import {config} from '@utils'
import pathToRegexp from 'path-to-regexp'
import menuData, {IMenuItem} from '@pages/menu-data'
import {useEffect, useState} from 'react'

// 判断路径是否匹配
const matchPath = (path: string, pathname: string, exact = false): boolean => {
  const keys: pathToRegexp.Key[] = []
  const regexp = pathToRegexp(path, keys, {
    // end: exact,
    end: exact,
    strict: false,
    sensitive: false,
  })
  const match = regexp.exec(pathname)
  if (!match) return false
  const url = match[0]
  const isExact = pathname === url
  if (exact && !isExact) return false // 如果是全匹配且不等说明也不是匹配的
  return true
}
// 根据url路径 获取匹配的菜单树的url数组
const getSelectKeys = (menu: IMenuItem[] = [], pathname = '') => {
  const keys: string[] = []
  for (let i = 0; i < menu.length; i++) {
    const item = menu[i]
    if (item.component && matchPath(item.url, pathname, item.exact)) {
      keys.push(item.url)
      return keys
    } else if (item.children) {
      const temp = getSelectKeys(item.children, pathname)
      if (temp.length > 0) {
        keys.push(item.url, ...temp)
        return keys
      }
    }
  }
  return keys
}
// 通过请求路径获取选中的菜单配置关联的key
export const useSelectKeys = (pathname: string): string[] => {
  const [selectkeys, setSelectkeys] = useState<string[]>([])
  useEffect(() => {
    setSelectkeys(getSelectKeys(menuData, pathname))
  }, [pathname])

  return selectkeys
}
export const getHeaderSelectKey = (selectedkeys: string[], headerMenuData: IMenuItem[]): string | undefined => {
  let selectKey: string | undefined
  for (let i = 0; i < headerMenuData.length; i++) {
    const item = headerMenuData[i]
    if (selectedkeys.includes(item.url) && !item.children) {
      selectKey = item.url
      return selectKey
    } else if (item.children) {
      const temp = getHeaderSelectKey(selectedkeys, item.children)
      if (temp !== undefined) return temp
    }
  }
  return selectKey
}
export const getSelectOpenKeys = (userMenu: IMenuItem[] = [], path = ''): {selectkeys: string[]; openKeys: string[]} => {
  let selectkeys: string[] = []
  let openKeys: string[] = []

  userMenu.forEach((item) => {
    if (item.children) {
      const temp = getSelectOpenKeys(item.children, path)
      selectkeys = selectkeys.concat(temp.selectkeys)
      openKeys = openKeys.concat(temp.openKeys)
      if (temp.selectkeys.length > 0 || temp.openKeys.length > 0) {
        openKeys.push(item.url)
      }
    } else if ((item.url !== `${config.pathPrefix}` && path.indexOf(item.url) === 0) || path === (item.url || '/')) {
      selectkeys.push(item.url)
    }
  })
  return {selectkeys, openKeys}
}
// 获取头部菜单
export const getHeaderMenu = (menu: IMenuItem[] = []): IMenuItem[] => {
  const arr: IMenuItem[] = []
  menu.forEach((item) => {
    if (item.children) {
      const temp = getHeaderMenu(item.children)
      if (temp.length > 0) {
        // item.children = temp // 这里会改变原有的item的children的值
        // arr.push(item)
        arr.push(Object.assign({}, item, {children: temp})) // 只需要浅拷贝
      } else if (item.isMenu && item.isHeader) {
        arr.push(Object.assign({}, item, {children: undefined})) // 只需要浅拷贝
      }
    } else if (item.isMenu && item.isHeader) {
      arr.push(item)
    }
  })
  return arr
}
// 根据路由获取侧边菜单
export const getSiderMenu = (menu: IMenuItem[] = [], selectKey: string): IMenuItem[] => {
  let arr: IMenuItem[] = []
  for (let i = 0; i < menu.length; i++) {
    const item = menu[i]
    if (item.isHeader && item.url === selectKey) {
      if (item.children) {
        arr = item.children
      }
      break
    } else if (item.children) {
      arr = getSiderMenu(item.children, selectKey)
      if (arr.length > 0) break
    }
  }
  return arr
}
