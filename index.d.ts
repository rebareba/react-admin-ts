/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2023-04-24 11:18:35
 * @Description: 全局的类型定义
 */
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module '*.json'

declare module '*.styl'
declare module '*.css'
interface Window {
  config: any
}

type TSelectType = {
  label: string
  value: string | number
}
// Modal对话框 和 Drawer抽屉
interface IShowHide {
  onCancel: () => void
  onFinish?: () => void
}

interface IOneParamFunc {
  (params?: Record<string, unknown>): Promise<void>
}
