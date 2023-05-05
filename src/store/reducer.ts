import {EActions} from './actions'
import {config, getUserMenu, getUserMenuMore} from '@utils'
import menuData, {IMenuItem} from '@pages/menu-data'
import type {TProduct, TUserInfo} from './global.type'
//全局store的类型
export interface TState extends Record<string, unknown> {
  title?: string
  userMenu?: IMenuItem[]
  remoteMenu?: IMenuItem[]
  userInfo?: TUserInfo
  breadcrumb: {name: string; href?: string}[]
  collapsed: boolean
  loadedUserInfo: boolean // 已经已经查询过用户信息
  productList: TProduct[]
  selectedProductCode?: string | null
  permissions: string[]
}

//
export type ReducerAction =
  | {type: EActions.SET_STATE | EActions.RESET_STATE; payload: any}
  | {type: EActions.RECEIVE_USERINFO; payload: TUserInfo}
  | {type: EActions.REMOTE_MENU; payload: IMenuItem[]}
  | {
      type: EActions.SET_BREADCRUMB
      payload: TState['breadcrumb']
    }

// 默认配置
const defaultData = {
  title: config.title,
  breadcrumb: [],
  userMenu: [],
  productList: [],
  collapsed: false,
  loadedUserInfo: false,
  // selectedProductCode: localStorage.getItem('productCode'),
  permissions: [],
}

// const userCurrentInfo = JSON.parse(localStorage.getItem('userCurrentConfig') || '{}')
// const defaultState: TState = Object.assign(defaultData)

export const defaultState: TState = defaultData

// 全局的 reducer的定义
export default (state = defaultState, action: ReducerAction): TState => {
  switch (action.type) {
    case EActions.RECEIVE_USERINFO:
      return {
        ...state,
        userInfo: action.payload,
        // userMenu: getUserMenu(menuData, action.payload?.permissions),
        userMenu: getUserMenuMore(
          menuData.map((item) => {
            if (item.name === '交付规范') item.children = state.remoteMenu || []
            return item
          }),
          action.payload.permissionMap,
        ),
        //  userMenu: getUserMenuMore(menuData, action.payload.permissionMap)
      }
    case EActions.REMOTE_MENU:
      return {
        ...state,
        remoteMenu: action.payload,
        userMenu: getUserMenuMore(
          menuData.map((item) => {
            if (item.name === '交付规范') item.children = action.payload
            return item
          }),
          state.userInfo?.permissionMap || {},
        ),
      }
    case EActions.SET_STATE:
      return {...state, ...action.payload}
    case EActions.SET_BREADCRUMB:
      return {...state, breadcrumb: action.payload || []}
    case EActions.RESET_STATE:
      return {...defaultData}
    default:
      return state
  }
}
