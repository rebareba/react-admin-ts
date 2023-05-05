/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2023-04-18 21:08:24
 * @Description: 全局请求的封装
 */
import {createIo, IApiConf} from '@src/common/create-io'

const apis: Record<'getProductList' | 'loginInfo' | 'logout' | 'getCondition', IApiConf> = {
  getProductList: {
    name: '获取项目列表',
    url: '/public/product.json',
  },
  loginInfo: {
    name: '获取登陆信息',
    url: 'login_info', // 真实接口请求地址是/api/login_info
    method: 'GET',
  },
  logout: {
    name: '退出登录',
    method: 'POST',
    url: 'logout',
  },
  getCondition: {
    name: '获取配置',
    method: 'GET',
    url: 'base/configs', // ?names=projectType,securityLevel
  },
}

export default createIo(apis, 'global')
