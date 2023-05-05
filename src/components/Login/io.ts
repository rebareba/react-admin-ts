/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2022-05-05 11:10:34
 * @Description: 登陆相关接口配置
 */
import {createIo, IApiConf} from '@src/common/create-io'

const apis: Record<'login', IApiConf> = {
  login: {
    name: '登陆接口',
    description: '通过手机号和密码登陆',
    method: 'POST',
    url: 'login',
  },
}

export default createIo(apis, 'login')
