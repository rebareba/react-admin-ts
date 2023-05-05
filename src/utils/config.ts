/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2022-04-19 18:00:32
 * @Description: 获取全局配置 可以通过模板在window全局配置进行覆盖
 */

interface IType {
  pathPrefix: string
  apiPrefix: string
  debug: boolean
  [key: string]: IType[keyof IType]
}
const configData: IType | any = {}
try {
  // eslint-disable-next-line global-require
  const data = require('../../config/conf.json') // 这个是动态生成的
  Object.assign(configData, data)
} catch (e) {}

export default Object.assign(configData, window['config'])
