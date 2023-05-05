/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2022-08-01 18:44:26
 * @Description:
 */
import compressImage from './compress-image'
import {message} from 'antd'
// https://quilljs.com/docs/api/
import ReactQuill, {Quill} from 'react-quill'

interface IUploadFunc {
  (params: File | Blob): Promise<void>
}

/**
 * upload Function
 */
export default (upload: IUploadFunc) => {
  return (quillEditor: ReactQuill['editor']): void => {
    const inputEle: HTMLInputElement = document.createElement('input')
    inputEle.setAttribute('type', 'file')
    inputEle.setAttribute('accept', 'image/*')
    inputEle.click()
    inputEle.onchange = async () => {
      try {
        const file = await compressImage(inputEle.files ? inputEle.files[0] : null)
        // TODO 这里不一定要上传的 可以转化为base64
        const link = await upload(file)
        const cursorPosition = quillEditor?.getSelection()?.index || 0
        quillEditor?.insertEmbed(cursorPosition, 'image', link) // 插入图片
        quillEditor?.setSelection(cursorPosition + 1, 0) // 光标位置加1
      } catch (err: any) {
        message.error('图片上传失败:', err.message)
      }
    }
  }
}
