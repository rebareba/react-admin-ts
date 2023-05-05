import {message} from 'antd'
import axios, {AxiosResponse, AxiosRequestConfig} from 'axios'

/**
 * option 字段参数定义
 * @typedef   {Object} Option  字段参数
 * @property  {String} baseURL 字段名
 * @property  {Number} timeout 超时 默认1分钟  60 * 1000
 * @property  {Object} headers 请求头 默认包含有{'X-Requested-With': 'XMLHttpRequest'}
 * @property  {Boolean} withCredentials 设置cross跨域 并设置访问权限 允许跨域携带cookie信息 默认false
 * @property  {Function|null} validateStatus 判断状态码是否promise.reject
 * @property  {Object} auth  Authorization Header设置  {username: 'janedoe',password: 's00pers3cret'}
 * @property  {String} responseType 默认json
 * @property  {Object} cancelToken 取消的token
 * @property  {Function|null} requestInterceptor 请求拦截器  (options) => options
 * @property  {Function|null} requestInterceptorWhen 请求拦截器条件 (options) => options.method === 'get'
 * @property  {Function|null} responseInterceptor 返回拦截器 (response) => { return response}
 * @property  {Function|null} tip 提示消息 (message) => {}
 * @property  {Object} showErrorTip 是否要提示消息
 */

//  | {res: TFormatReturnData | Blob; headers: Record<string, string>} | Blob
// 返回的对象
export type TResponseData = {
  success: boolean // 兼容历史的
  content?: any
  data?: any
  message?: string
  status?: number
  headers?: Record<string, string>
  code?: string
  [key: string]: any
}

export interface IReqOptions extends AxiosRequestConfig {
  mix?: {[propName: string]: any}
  endAction?: (responseData: TResponseData) => void
  url: string
  mock?: any
}

export interface IRequest {
  (options: IReqOptions): Promise<TResponseData>
}

// 创建实例的配置
export interface IRequestConfig extends AxiosRequestConfig {
  formatResponse?: (responseData: TResponseData) => {content?: any; success?: boolean; [key: string]: any}
  endAction?: (responseData: TResponseData) => void
  requestInterceptor?: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>
  requestInterceptorOnRejected?: (error: any) => any
  responseInterceptor?: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
  mockDelay?: number
}

/**
 * 创建一个请求实例
 * @param {Option} option
 * @returns
 */
export default function createRequest({
  formatResponse = (responseData) => {
    if (
      responseData.success &&
      responseData.content &&
      typeof responseData.content.success === 'boolean' &&
      (responseData.content.content !== undefined || responseData.content.message !== undefined)
    ) {
      return {...responseData.content}
    }
    return {}
  },
  requestInterceptor,
  requestInterceptorOnRejected,
  responseInterceptor,
  endAction,
  ...option
}: IRequestConfig = {}): IRequest {
  const instance = axios.create({
    ...option,
    timeout: option.timeout || 60 * 1000, // default is `0` (no timeout)
    headers: option.headers || {'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json'},
    // //设置cross跨域 并设置访问权限 允许跨域携带cookie信息, 注意后端要设置Access-Control-Allow-Origin指定源地址不能是* ?
    // withCredentials: option.withCredentials || false,
    // validateStatus: function (status) {  return status >= 200 && status < 300; // default } // 这是默认 判断状态码觉得是否promise resolved
    // validateStatus: option.validateStatus,
    // auth: option.auth || undefined,
    // responseType: option.responseType || 'json',
    // 手动取消请求 const CancelToken = axios.CancelToken; const source = CancelToken.source(); //   cancelToken: source.token
    // cancelToken: option.cancelToken || undefined,
  })
  // 请求拦截器 requestInterceptor 和 requestInterceptorWhen
  if (requestInterceptor) {
    instance.interceptors.request.use(requestInterceptor, requestInterceptorOnRejected)
  }
  // 响应拦截器 responseInterceptor 和 responseInterceptorWhen
  if (responseInterceptor) {
    instance.interceptors.response.use(responseInterceptor)
  }
  /**
   * 参数axios基本一致，除了这两还有其他axios的参数都支持
   * @typedef   {Object} Options  字段参数
   * @property  {String} url 请求地址
   * @property  {String} method 字段名
   * @property  {Object} headers 请求头
   * @property  {Object} params query参数和router参数的处理 {code: 'query上', ':userId': ‘router参数’}
   * @property  {Object} data body数据
   * @property  {Function} endAction 混合处理get header是params ,其他是data
   * @property  {Boolen} showErrorTip 是否判断提示
   */
  return async (options: IReqOptions) => {
    // 混合请求处理字段
    if (options.mix) {
      if (typeof options.mix === 'object') {
        Object.keys(options.mix).forEach((key) => {
          if (key[0] === ':' && options.mix && typeof options.mix[key] !== 'object') {
            options.url = options.url.replace(key, encodeURIComponent(options.mix[key]))
            delete options.mix[key]
          }
        })
      }
      const method = (options.method || 'get').toLowerCase()
      if (method === 'get' || method === 'head' || method === 'delete') {
        options.params = {...options.params, ...options.mix}
      } else {
        if (Array.isArray(options.mix)) {
          options.data = options.mix
        } else {
          options.data = {...options.data, ...options.mix}
        }
      }
    }
    // 路由参数处理
    if (typeof options.params === 'object') {
      Object.keys(options.params).forEach((key) => {
        if (key[0] === ':') {
          options.url = options.url.replace(key, encodeURIComponent(options.params[key]))
          delete options.params[key]
        }
      })
    }
    let retData: TResponseData = {success: true}
    // mock 处理
    if (options.mock) {
      const {data, headers}: {data: any; headers?: any} = await new Promise((resolve) =>
        setTimeout(() => {
          if (options.mock.headers && options.mock.data) {
            resolve({headers: options.mock.headers, data: options.mock.data})
          } else {
            resolve({data: options.mock})
          }
        }, option.mockDelay || 500),
      )
      retData.data = data
      retData.content = data
      retData.headers = headers
    } else {
      try {
        delete options.mock
        delete options.mix
        const {data, headers} = await instance(options)
        retData.data = data || ''
        retData.content = data || ''
        retData.headers = headers
      } catch (err: any) {
        retData.success = false
        retData.message = err.message
        if (err.response) {
          retData.status = err.response.status
          retData.data = err.response.data
          retData.headers = err.response.headers
          retData.message = `浏览器请求非正常返回: 状态码 ${retData.status}`
        }
      }
    }
    retData = {...retData, ...formatResponse(retData)}
    // 返回前处理
    const doEndAction = options.endAction || endAction
    if (doEndAction) {
      doEndAction(retData)
    }
    if (retData.success) return retData
    return Promise.reject(retData)
  }
}
