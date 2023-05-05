/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2022-07-14 19:03:23
 * @Description:
 */
const path = require('path')
const fs = require('fs')
const colors = require('colors')
const {syncWalkDir, jsonParse} = require('./util')
const pkg = require('../package.json')

const buildApiDoc = (methodName, jsonData) => {
  const request = jsonData['request'] || []
  let subMd = request.url
    ? `#### ${request['name'] || methodName} ${request['path'] ? '/' + request['path'] : ''}  ${request['method'] || ''} \n\n`
    : `#### ${methodName} \n`
  subMd += `方法: ${methodName || xx}() \n ${request['description'] || ''} \n\n`
  if (request.url) {
    subMd += `##### 请求示例 \n`
    subMd += '- **请求URL：** `' + `${request.url}` + '`\n'
    if (request.reqBody) {
      subMd +=
        '- 请求Body：\n ```js\n' +
        `// ${request.reqContentType || 'application/json'}\n${JSON.stringify(request.reqBody, '', '\t')} \n` +
        '```\n'
    }
  }
  if (jsonData['success']) {
    subMd += `##### 正确返回 \n`
    subMd +=
      '\n ```js\n' +
      `// ${request.resContentType || 'application/json'}\n${JSON.stringify(jsonData['success'], '', '\t').substr(0, 1024 * 500)} \n` +
      '```\n'
  }
  if (jsonData['failed']) {
    subMd += `##### 错误返回 \n`
    subMd +=
      '\n ```js\n' + `// ${request.resContentType || 'application/json'}\n${JSON.stringify(jsonData['failed'], '', '\t')} \n` + '```\n'
  }
  return subMd
}

;(async () => {
  const args = process.argv.slice(2)
  const apiFileName = args[0] || 'API.md'
  console.log('API文件名称为：', apiFileName)
  let markdown = `## ${pkg.name.toUpperCase()} 接口文档 \n${pkg.description}\n`
  const mockFiles = syncWalkDir(path.join(__dirname, '../src'), (file) => /-mock.json$/.test(file))
  mockFiles.forEach((filePath) => {
    const p = path.parse(filePath)
    const mockKey = p.name.substr(0, p.name.length - 5)
    const jsonData = require(filePath)
    markdown += `### ${typeof jsonData.name === 'string' ? jsonData.name : ''} ${mockKey} \n`
    Object.keys(jsonData).forEach((key) => {
      if (typeof jsonData[key] !== 'string') {
        markdown += buildApiDoc(key, jsonData[key])
      }
    })
  })
  console.log('存储文件:', path.join(__dirname, '../', apiFileName))
  fs.writeFile(path.join(__dirname, '../', apiFileName), markdown, (err) => {
    err && console.log('writeFile', err)
  })
})()
