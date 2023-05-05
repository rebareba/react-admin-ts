/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2022-08-05 16:31:26
 * @Description: node 读取dist 中的文件进行压缩打包
 */

const config = require('../config')
const fs = require('fs')
// https://www.npmjs.com/package/fs-extra  负责文件夹
const fse = require('fs-extra')
const path = require('path')
const {exec} = require('child_process')
//https://www.npmjs.com/package/tar
const tar = require('tar')
// 部署服务器地址：

;(async () => {
  fs.rmdirSync(path.join(__dirname, `../dist/${config.projectName}`), {recursive: true})
  fs.mkdirSync(path.join(__dirname, `../dist/${config.projectName}/src`), {recursive: true})
  fse.copySync(path.join(__dirname, `../src/pages`), path.join(__dirname, `../dist/${config.projectName}/src/pages`))
  await tar.c(
    {
      gzip: true,
      file: path.join(__dirname, `../dist/${config.projectName}_pages.tgz`),
      cwd: path.join(__dirname, '../dist/'),
    },
    [config.projectName],
  )
  fs.rmdirSync(path.join(__dirname, `../dist/${config.projectName}`), {recursive: true})
  console.log('打包成功', `./dist/${config.projectName}_pages.tgz`)
})()
