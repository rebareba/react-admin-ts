/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2023-05-05 18:22:42
 * @Description: 页面配置文件
 */
import React from 'react'
import {GlobalOutlined} from '@ant-design/icons'
import type {RouteComponentProps} from 'react-router-dom'
import {config} from '@utils'

import Index from '@pages/index'

const {pathPrefix} = config

/**
 * 关于菜单的配置
 * @param (string)    name        名称
 * @param (string)    url         访问路径也是key， 菜单是key 确保唯一
 * @param (string)    icon        图标 第一层菜单才需要
 * @param (Component) component？ 组件 菜单不需要
 * @param (Array)     children    子菜单
 * @param (Boolean)   isMenu      是否是菜单还是功能页面 功能也可以在子页面做
 * @param (string)    module         权限key   无表示通用页面大家都有权限
 * @param (number)    permission？  和用户对于的权限key 进行&运算 确定是否有访问权限
 *
 */

export interface IMenuItem {
  name: string //  名称
  url: string // 访问路径也是key， 菜单是key 确保唯一
  route?: string // 头部导航优先使用跳转，没有就会使用侧边菜单的第一个地址
  icon?: React.ReactNode | {(selected: boolean): React.ReactNode} //  图标 第一层菜单才需要
  component?: React.ComponentType<RouteComponentProps> // 组件 菜单不需要
  children?: IMenuItem[]
  isMenu?: boolean //是否是菜单
  isHeader?: boolean
  disabled?: boolean // 菜单是否是disable的
  needLogin?: boolean
  exact?: boolean // 路径是否全匹配
  permissionKey?: string // 权限key 另外一种权限判断无表示通用页面大家都有权限
  permission?: string | number // 权限数组是string[] 判断是否在里面 未定义不需要权限判断 或者是使用utils.getSiderMenuMore基于key的权限的逻辑是位运算是 permission & permissions.module 如 Boolean(1 & 3) = true
}

export const menu: IMenuItem[] = [
  {
    name: '',
    url: `${pathPrefix}`,
    isHeader: true,
    disabled: false,
    isMenu: true,
    component: Index,
  },
]

export default menu
