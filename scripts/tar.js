/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2023-05-05 18:25:58
 * @Description: node 读取dist 中的文件进行压缩打包
 */

const config = require('../config')
const fs = require('fs')
const path = require('path')
const {exec} = require('child_process')
// 部署服务器地址：
const host = config.deployHost || '127.0.0.1'

;(async () => {
  const dir = path.join(__dirname, `../dist/${config.projectName}/${config.version}/`)

  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    if (/\.html$/.test(file)) {
      fs.copyFileSync(path.join(dir, file), path.join(__dirname, `../dist/${config.projectName}/${file}`))
    }
  })
  if (process.platform !== 'win32') {
    // 打包
    exec(`cd dist && tar czf ${config.projectName}_${config.version}_public.tgz public ${config.projectName}`, (error) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
    })
  }
  console.log('打包成功：')
  console.log(`执行上传部署：scp -r dist/${config.projectName} deploy@${host}:/opt/workspace/front`)
  console.log(`第一次部署需要上传public内容：scp -r dist/public deploy@${host}:/opt/workspace/front`)
  console.log(`或上传压缩包解压：scp dist/${config.projectName}_${config.version}_public.tgz deploy@${host}:/opt/workspace/front`)
})()
