import creatRequest, {IReqOptions, TResponseData} from '@utils/create-request'
import {Modal, message} from 'antd'
import cloneDeep from 'lodash/cloneDeep'
import history from '@utils/history'
import config from '@utils/config'
import {localStorage} from '@utils'
import mockData from '@utils/mock-data'
import {ERROR_CODE} from './constant'
// 这个表示登陆的弹框只弹出一次
let reloginFlag = false

// 创建一个request
export const request = creatRequest({
  // 最后的数据处理和response拦截器处理位置不一样
  endAction: (responseData) => {
    // 统一处理未登录的弹框
    // console.log(responseData)
    // 统一处理未登录的弹框
    if (responseData.success === false && responseData.code === ERROR_CODE.UN_LOGIN && !reloginFlag) {
      reloginFlag = true
      // sessionStorage.remove('userInfo')
      return Modal.confirm({
        title: '重新登录',
        content: '',
        onOk: () => {
          // location.reload()
          history.push(`${config.pathPrefix}/login?redirect=${window.location.pathname}${window.location.search}`)
          reloginFlag = false
        },
      })
    }
    if (responseData.message) message.warning(responseData.message)
  },
  // mock 数据请求的等待时间
  mockDelay: 1000,
  // requestInterceptor: (conf) => {
  //   conf.headers.aiApiToken = sessionStorage.get('token') || ''
  //   return conf
  // },
  // responseInterceptor: (response) => {
  //   return response
  // },
})

export const rejectToData = Symbol('flag')

export interface IApiConf extends IReqOptions {
  name?: string
  description?: string
}

type IApiReqOptions = Pick<IReqOptions, 'data' | 'headers' | 'cancelToken' | 'params' | 'timeout' | 'responseType'> & {
  [rejectToData]: boolean
}
export interface IFCall {
  (options?: any): Promise<TResponseData>
}

//
export type IIOMap<T> = {
  [P in keyof T]: IFCall
}

export type IIOConf = {
  [propName: string]: IApiConf
}

/**
 * 通过请求配置转换为请求方法
 * @param ioConfs 自定义对接口的
 * @param name
 * @returns
 */
export const createIo = <T extends IIOConf>(ioConfs: T, name?: string): Record<keyof T, IFCall> => {
  const content: Partial<IIOMap<T>> = {}
  for (const key in ioConfs) {
    const apiConf = ioConfs[key]
    content[key] = async (options?: any) => {
      // 这里判断简单请求封装 [rejectToData] :true 表示复杂封装
      if (!options || !options[rejectToData]) {
        options = {
          mix: options,
        }
      }
      delete options[rejectToData]
      if (config.debug === false && name && mockData[name] && mockData[name][key]) {
        // 生产情况可能是纯前端mock返回
        options.mock = cloneDeep(mockData[name][key])
      } else if (config.debug === true && name) {
        // 开发情况下传递生成mock数据的
        const mockHeader = {
          'mock-key': name,
          'mock-method': key,
          name: encodeURIComponent(apiConf.name || ''),
          description: encodeURIComponent(apiConf.description || ''),
          path: apiConf.url,
        }
        options.headers = options.headers ? {...mockHeader, ...options.headers} : mockHeader
      }
      // 如果配置也有定义请求头则合并
      // if (apiConf['headers']) {
      //   options.headers = options.headers ? {...apiConf['headers'], ...options.headers} : apiConf['headers']
      // }

      // 合并参数
      const option = {...apiConf, ...options}

      delete option.name
      delete option.description

      // url / 开头使用绝对路径不是拼接统一前缀
      if (option.url[0] !== '/') {
        option.url = `${config.apiPrefix || ''}/${option.url}`
      }
      return request(option)
    }
  }
  return content as Record<keyof T, IFCall>
}
