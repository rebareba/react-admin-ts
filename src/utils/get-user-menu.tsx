/**
 * 获取侧边栏的用户菜单
 * @param {*} permissions ['admin', 'user', 'editUser]
 * @param {*} menu []
 * @returns
 */

import {IMenuItem} from '@pages/menu-data'
const getUserMenu = (menu: IMenuItem[] = [], permissions: (string | number)[] = []): IMenuItem[] => {
  const arr: IMenuItem[] = []
  menu.forEach((item) => {
    if (item.children) {
      const temp = getUserMenu(item.children, permissions)
      if (temp.length > 0) {
        // item.children = temp // 这里会改变原有的item的children, 这样操作可能是menu的数据产生变化
        // arr.push(item)
        arr.push(Object.assign({}, item, {children: temp})) // 只需要浅拷贝
      }
    } else if (item.isMenu && (!item.permission || permissions.includes(item.permission))) {
      arr.push(item)
    }
  })
  return arr
}

export default getUserMenu
