/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2022-07-05 19:14:49
 * @Description: 通过配置获取页面的路由
 */
import React from 'react'
import {IMenuItem} from '@pages/menu-data'
import {RouteComponentProps} from 'react-router-dom'
export type IMenuItemNew = IMenuItem & {component: React.ComponentType<RouteComponentProps<any>>}

function getPageRoutes(menu: IMenuItem[] = []): IMenuItemNew[] {
  let arr: IMenuItemNew[] = []
  menu.forEach((item) => {
    if (item.component) {
      arr.push(item as IMenuItemNew)
    }
    if (item.children) {
      const temp = getPageRoutes(item.children)
      arr = arr.concat(temp)
    }
  })
  return arr
}

export default getPageRoutes
