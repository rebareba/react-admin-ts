/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2023-04-18 09:06:16
 * @Description: webpack proxy 模块的接口代理的 前处理 onProxyReq 后处理 onProxyRes 来处理接口缓存操作
 */
const fs = require('fs')
const path = require('path')
const prettier = require('prettier')
const moment = require('moment')
const {getConf, getMockJson} = require('./webpack-init')

const API_CACHE_DIR = path.join(__dirname, '../api-cache')
const {jsonParse, getBody} = require('./util')

try {
  fs.mkdirSync(API_CACHE_DIR, {recursive: true})
} catch (e) {}

// https://github.com/chimurai/http-proxy-middleware
module.exports = {
  onProxyReq: async (_, req, res) => {
    if (req.method === 'OPTIONS') {
      res.end('')
      return
    }
    const {'mock-method': mockMethod, 'mock-key': mockKey, 'content-type': contentType} = req.headers
    if (!mockKey || !mockMethod) return
    if (!(contentType || '').startsWith('multipart')) {
      req.reqBody = await getBody(req)
    } else {
      req.reqBody = '{"file": "文件"}'
    }
    // eslint-disable-next-line no-console
    // console.log(`请求: ${mockKey}.${mockMethod}`, req.method, req.url)
    req.reqBody && console.log(JSON.stringify(req.reqBody, null, '\t'))
    if (mockKey && mockMethod) {
      req.mockKey = mockKey
      req.mockMethod = mockMethod
      const conf = getConf()
      const mockJson = getMockJson()
      let mockType // mock值的类型
      if (conf.mockAll || conf.mock[mockKey]) {
        mockType = conf.mock[mockKey] || 'success'
      } else if (conf.mock[`${mockKey}.${mockMethod}`]) {
        mockType = conf.mock[`${mockKey}.${mockMethod}`]
      }
      if (mockType && mockJson[mockKey] && mockJson[mockKey][mockMethod]) {
        // eslint-disable-next-line no-console
        console.log('use mock data'.blue, `${mockKey}.${mockMethod}:`.green, mockType)
        res.mock = true
        res.append('isMock', 'yes')
        res.send(mockJson[mockKey][mockMethod])
        res.end()
        _.destroy() // 还是会代理请求过去的
        const filePath = path.join(API_CACHE_DIR, `${mockKey}.${mockMethod}.json`)
        if (!fs.existsSync(filePath)) {
          const data = {}
          const {method, url, query, path: reqPath} = req
          const cacheObj = {
            date: moment().format('YYYY-MM-DD hh:mm:ss'),
            method,
            path: reqPath,
            url,
            resHeader: res.headers || {'content-type': 'application/json; charset=utf-8'},
            reqHeader: req.headers,
            query,
            reqBody: jsonParse(req.reqBody),
            resBody: mockJson[mockKey][mockMethod],
          }
          if (cacheObj.resBody.success === false) {
            data.failed = cacheObj
          } else {
            data.success = cacheObj
          }
          // eslint-disable-next-line no-console
          fs.writeFile(filePath, JSON.stringify(data, '', '\t'), (err) => {
            err && console.log('writeFile', err)
          })
        }
      }
    }
  },
  onProxyRes: async (res, req) => {
    const {method, url, query, path: reqPath, mockKey, mockMethod} = req

    if (mockKey && mockMethod && res.statusCode === 200) {
      let resBody = await getBody(res)
      resBody = jsonParse(resBody)
      const filePath = path.join(API_CACHE_DIR, `${mockKey}.${mockMethod}.json`)
      let data = {}
      if (fs.existsSync(filePath)) {
        data = jsonParse(fs.readFileSync(filePath).toString())
      }
      const cacheObj = {
        date: moment().format('YYYY-MM-DD hh:mm:ss'),
        method,
        path: reqPath,
        url,
        resHeader: res.headers,
        reqHeader: req.headers,
        query,
        reqBody: await jsonParse(req.reqBody),
        resBody,
      }
      if (resBody.success === false) {
        data.failed = cacheObj
      } else {
        data.success = cacheObj
      }
      // eslint-disable-next-line no-console
      fs.writeFile(filePath, JSON.stringify(data, '', '\t'), (err) => {
        err && console.log('writeFile', err)
      })
    }
  },
  onError(err, req, res) {
    setTimeout(() => {
      if (!res.mock && req.method !== 'OPTIONS') {
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        })
        res.end('Something went wrong. And we are reporting a custom error message.')
      }
    }, 10)
  },
}
