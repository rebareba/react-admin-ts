/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2022-08-01 10:56:37
 * @Description: 校验权限
 */
export type TPermissions = {
  [key: string]: number
}
const checkPermission = (permissionMap: TPermissions = {}, permissionKey = '', permissionValue = 0): boolean => {
  if (!permissionMap[permissionKey] || (permissionMap[permissionKey] & permissionValue) !== permissionValue) {
    return false
  }
  return true
}
export default checkPermission
