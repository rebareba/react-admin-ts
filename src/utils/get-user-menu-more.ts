/**
 * 获取侧边栏的用户菜单 通过位运算&
 * @param {*} permissions {user: 15}
 * @param {*} menu []
 * @returns
 */
import getPageRoutes from './get-page-routes'

type TPermissionMap = {
  [key: string]: number
}
import {IMenuItem} from '@pages/menu-data'

const getUserMenuMore = (menu: IMenuItem[] = [], permissionMap: TPermissionMap = {}): IMenuItem[] => {
  const arr: IMenuItem[] = []
  menu.forEach((item) => {
    if (item.children) {
      const temp = getUserMenuMore(item.children, permissionMap)
      if (temp.length > 0) {
        if (item.isHeader) item.route = getPageRoutes(temp)[0]?.url
        arr.push(Object.assign({}, item, {children: temp})) // 只需要浅拷贝
      } else if (
        // 如果没有子项
        item.isMenu &&
        item.component &&
        (!item.permissionKey ||
          !item.permission ||
          (permissionMap[item.permissionKey] && permissionMap[item.permissionKey] & (item.permission as number)))
      ) {
        arr.push(Object.assign({}, item, {children: undefined})) // 只需要浅
      }
    } else if (
      item.isMenu &&
      (!item.permissionKey ||
        !item.permission ||
        (permissionMap[item.permissionKey] && permissionMap[item.permissionKey] & (item.permission as number)))
    ) {
      arr.push(item)
    }
  })
  return arr
}

export default getUserMenuMore
