/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2022-08-01 17:02:26
 * @Description: 将图片base化
 */

export default function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
