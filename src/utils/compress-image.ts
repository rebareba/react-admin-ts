/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2022-08-01 17:29:00
 * @Description: 压缩图片处理
 */

import Compressor from 'compressorjs'

export default (file: File | null, overSize = 100 * 1024, quality = 0.3): Promise<Blob | File> => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('图片文件未找到'))
    if (file.size >= overSize) {
      new Compressor(file, {
        quality,
        success(result) {
          // formData.append('file', result, result.name)
          resolve(result)
        },
        error(err) {
          reject(err)
        },
      })
    } else {
      resolve(file)
    }
  })
}
