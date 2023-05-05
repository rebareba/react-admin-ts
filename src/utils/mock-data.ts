/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2021-09-27 14:46:43
 * @Description: 获取mock数据
 */
const mockData: any = {}
try {
  // eslint-disable-next-line global-require
  const data = require('../../mock.json')
  Object.assign(mockData, data)
} catch (e) {}

export default mockData
