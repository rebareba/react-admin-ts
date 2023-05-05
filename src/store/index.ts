import {useCallback} from 'react'
// 全局的stroe定义
import React, {Dispatch, useContext} from 'react'

export {EActions} from './actions'
export {default as fetchs} from './fetchs'

export {default as reducer, defaultState} from './reducer'

export {default as io} from './io'

import {ReducerAction, TState} from './reducer'

import fetchs, {TFetchs} from './fetchs'

export type TFetch = {
  [k in keyof TFetchs]: (data?: any) => Promise<any>
}

export interface TContext {
  dispatch: Dispatch<ReducerAction>
  state: TState
  fetch: TFetch
}

const Store = React.createContext<TContext>({} as TContext)

export const useGlobalStore = (): TContext => {
  const context = useContext(Store)
  return context
}
export const usePermission = (): TContext & {checkPermission: (permission: string | string[]) => boolean} => {
  const context = useContext(Store)
  const checkPermission = useCallback(
    (permission: string | string[]): boolean => {
      const checkPermissions: string[] = typeof permission === 'string' ? [permission] : permission
      for (const permissionCode of checkPermissions) {
        if (!context.state.permissions.includes(permissionCode)) return false
      }
      return true
    },
    [context.state.permissions],
  )
  return {
    checkPermission,
    ...context,
  }
}
export default Store
