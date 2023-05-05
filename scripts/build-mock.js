/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2022-03-09 14:17:16
 * @Description:
 */
// 所有： npm run build-mock mockAll
// 单个mock文件： npm run build-mock global
// 单个mock接口：npm run build-mock global.login

const path = require('path')
const fs = require('fs')
const {syncWalkDir, jsonParse} = require('./util')

/**
 *
 * @param {string} mockFilePath
 * @param {Map} mockCacheApiMap
 */
const buildMock = (mockFilePath, mockCacheApiMap = new Map()) => {
  const mockData = jsonParse(fs.readFileSync(mockFilePath).toString())
  Array.from(mockCacheApiMap.keys()).map((mockMethod) => {
    console.log('mockMethod', mockMethod, mockCacheApiMap.get(mockMethod))
    const mockCacheMethodData = jsonParse(fs.readFileSync(mockCacheApiMap.get(mockMethod)).toString())
    const data = {}
    Object.keys(mockCacheMethodData).forEach((key) => {
      data[key] = mockCacheMethodData[key]['resBody']
      if (key === 'success') {
        data['request'] = {
          url: mockCacheMethodData[key]['url'],
          method: mockCacheMethodData[key]['method'],
          reqBody: mockCacheMethodData[key]['reqBody'],
          name: mockCacheMethodData[key]['reqHeader']['name'] ? decodeURIComponent(mockCacheMethodData[key]['reqHeader']['name']) : '',
          description: mockCacheMethodData[key]['reqHeader']['description']
            ? decodeURIComponent(mockCacheMethodData[key]['reqHeader']['description'])
            : '',
          path: mockCacheMethodData[key]['reqHeader']['path'],
          reqContentType: mockCacheMethodData[key]['reqHeader']['content-type'],
          resContentType: mockCacheMethodData[key]['resHeader']['content-type'],
        }
      }
    })
    if (mockData[mockMethod]) {
      mockData[mockMethod] = Object.assign(mockData[mockMethod], data)
    } else {
      mockData[mockMethod] = data
    }
  })
  console.log('rewrite file:', mockFilePath)
  fs.writeFileSync(mockFilePath, JSON.stringify(mockData, '', '\t'))
}

;(async () => {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.log('缺少参数')
    console.log('所有： npm run build-mock mockAll')
    console.log('单个mock文件匹配 global-mock.json文件： npm run build-mock global')
    console.log('单个接口：npm run build-mock global.login')
    console.log('混合模式：npm run build-mock global.login auth')
    process.exit(0)
  }
  const mockFiles = syncWalkDir(path.join(__dirname, '../src'), (file) => /-mock.json$/.test(file))
  const mockMap = new Map()
  mockFiles.forEach((filePath) => {
    const p = path.parse(filePath)
    console.log('filePath', filePath)
    const mockKey = p.name.substr(0, p.name.length - 5)
    console.log('mockKey', mockKey)
    if (mockMap.get(mockKey)) {
      console.error(`有相同的mock文件名称${p.name} 存在`, filePath)
    }
    mockMap.set(mockKey, filePath)
  })
  const cacheFiles = syncWalkDir(path.join(__dirname, '../api-cache'), (file) => /.json$/.test(file))
  console.log('cacheFiles', cacheFiles)
  const cacheApiMap = new Map()
  cacheFiles.forEach((filePath) => {
    const p = path.parse(filePath)
    const [mockKey, mockMethod] = p.name.split('.')
    if (!cacheApiMap.get(mockKey)) {
      cacheApiMap.set(mockKey, new Map())
    }
    cacheApiMap.get(mockKey).set(mockMethod, filePath)
  })
  // 如果是处理全部的
  if (args.length === 1 && args[0] === 'mockAll') {
    Array.from(cacheApiMap.keys()).forEach((mockKey) => {
      if (mockMap.get(mockKey)) {
        buildMock(mockMap.get(mockKey), cacheApiMap.get(mockKey))
      }
    })
  } else {
    args.forEach((arg) => {
      if (arg.indexOf('.') > 0) {
        const [mockKey, mockMethod] = arg.split('.')
        if (mockMap.get(mockKey) && cacheApiMap.get(mockKey) && cacheApiMap.get(mockKey).get(mockMethod)) {
          buildMock(mockMap.get(mockKey), new Map().set(mockMethod, cacheApiMap.get(mockKey).get(mockMethod)))
        }
      } else {
        if (mockMap.get(arg) && cacheApiMap.get(arg)) {
          buildMock(mockMap.get(arg), cacheApiMap.get(arg))
        }
      }
    })
  }
})()
