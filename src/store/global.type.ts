export type TProduct = {
  code: string 
  name: string 
  version: 
}

export type TUserInfo = {
  userId: number //1
  avatar: string | null
  securityLevel: number // 5 权限等级
  mobile: string // '15111111111'
  name: string | null
  nickname: string
  roleCode: string // 'master'
  ctime: string // '2021-02-25 11:52:14'
  mtime: string //'2021-08-24 16:41:45'
  roleName: string // '超级管理员'
  position: null | string
  department: null | string
  slogan: null | string
  tags: string[]
  token: null | string
  permissionMap: {
    [key: string]: number
  }
  permissions: (string | number)[]
  [key: string]: any
}
