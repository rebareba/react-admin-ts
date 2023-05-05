/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2023-05-05 18:25:38
 * @Description: 拉取飞快平台上的代码
 - 配置文件在pullConf下
  - host 指定飞快的服务器地址
  - token 指定飞快的用户，涉及模块的权限
  - apiPrefix 接口前缀

 - 使用 npm run pull [moduleId] [savePath] 示例
  - npm run pull 1 拉取模块到src的pages下 如果目录使用模块的目录， 如果存在就随机目录
  - npm run pull 1 folder/new-path  代码存储到src/pages/folder/new-path下
 */

const config = require('../config')
const axios = require('axios')
const path = require('path')
const util = require('util')
const fs = require('fs')
const unzipper = require('unzipper')
require('colors')
const {getBody, jsonParse} = require('./util')
;(async () => {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.log('缺少参数')
    console.log(` - 配置文件在config.pullConf下
      - host 指定飞快的服务器地址
      - token 指定飞快的用户，涉及模块的权限
      - apiPrefix 接口前缀`)
    console.log(` - 使用 npm run pull [moduleId] [savePath] 示例
      - npm run pull 1 拉取模块到src的pages下 如果目录使用模块的目录， 如果存在就随机目录
      - npm run pull 1 folder/new-path  代码存储到src/pages/folder/new-path下`)
    process.exit(0)
  }
  // http://127.0.0.1:8000/api/v1/fq/pull/1
  const [moduleId, savePath] = args
  const pullConf = config.pullConf || {}
  const host = pullConf.host || 'http://127.0.0.1'
  const apiPrefix = pullConf.apiPrefix || '/api/v1/fq'
  const token = pullConf.token

  console.log(host + apiPrefix, `/pull/${moduleId}`)
  let response
  try {
    response = await axios({
      method: 'get',
      baseURL: host + apiPrefix,
      url: `/pull/${moduleId}`,
      responseType: 'stream',
      headers: {
        token,
      },
    })
  } catch (e) {
    console.log('请求失败：', e.message)
    if (e.response) {
      const body = await getBody(e.response.data)
      console.log(body.red)
    }
    return
  }

  const folderName = response.headers['folder_name']
  if (folderName) {
    let modulePath = path.join(__dirname, '../src/pages', savePath || folderName)
    console.log('保存路径：', modulePath.blue)
    try {
      const stats = await util.promisify(fs.stat)(modulePath)
      if (stats.isDirectory()) {
        modulePath = modulePath + Date.now()
        console.log('路径已经存在，随机新路径:'.red, modulePath)
      }
    } catch (e) {}
    response.data.pipe(unzipper.Extract({path: modulePath}))
    response.data.on('end', () => {
      console.log(`下载模块成功, 快去菜单配置menu-data.tsx中添加模板路由吧！！！！`.green)
    })
  } else {
    // const body = jsonParse(await getBody(response))
    const body = await getBody(response.data)
    console.log(body.red)
  }
})()
