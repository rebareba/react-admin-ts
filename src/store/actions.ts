import {TUserInfo} from './global.type'
/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2023-04-18 21:40:55
 * @Description: 定义所有的 Action 处理
 */

import {ReducerAction} from './reducer'

export enum EActions {
  SET_STATE, // setState 设置state值
  RECEIVE_USERINFO,
  SET_BREADCRUMB, // 设置导航面包
  SET_PRODUCTS,
  CHANGE_PRODUCT,
  RESET_STATE, //重置state
  REMOTE_MENU, // 服务端的header配置
}

// 收到用户信息
export const receiveUserInfo = (data: TUserInfo): ReducerAction => {
  return {
    type: EActions.RECEIVE_USERINFO,
    payload: data,
  }
}
