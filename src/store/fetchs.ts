import {ReducerAction, defaultState} from './reducer'
import {rejectToData} from '@common/create-io'
/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2022-08-05 11:32:56
 * @Description: 全局请求处理
 */
import io from './io'
import {receiveUserInfo, EActions} from './actions'
import {Dispatch} from 'react'
import {history, config} from '@utils'

// 全局的已经查询接口
const fetchs = {
  // 获取用户信息
  getUserInfo: (dispatch: Dispatch<ReducerAction>): {(): Promise<void>} => {
    let loading = false
    return async (): Promise<void> => {
      if (loading) return
      loading = true
      const {success, content} = await io.loginInfo({
        [rejectToData]: true,
        tip: () => {
          return null
        },
        endAction: () => {
          return null
        },
      })
      loading = false
      dispatch({type: EActions.SET_STATE, payload: {loadedUserInfo: true}})
      if (!success) return
      dispatch(receiveUserInfo(content))
      // 这里可以进一步根据用户信息生成用户的权限和菜单等
    }
  },
  // 获取可配置的菜单
  getMenu: (dispatch: Dispatch<ReducerAction>): {(): Promise<void>} => {
    return async (): Promise<void> => {
      const {success, content} = await io.getCondition({names: 'menu'})
      if (!success) return
      dispatch({type: EActions.REMOTE_MENU, payload: content.menu || []})
    }
  },

  logout: (dispatch: Dispatch<ReducerAction>): {(): Promise<void>} => {
    return async (): Promise<void> => {
      const {success, content} = await io.logout()
      if (!success) return
      history.push(`${config.pathPrefix}/login`)
      dispatch({type: EActions.RESET_STATE, payload: defaultState})
    }
  },
}

export type TFetchs = typeof fetchs

export default fetchs
