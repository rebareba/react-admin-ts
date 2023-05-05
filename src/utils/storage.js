/*
 * @Description:
 storage.set(path, value)
 storage.get(path, [fallbackValue])
 storage.data({'foo': 'x'}})
 storage.has(path)
 storage.remove([path])
 storage.destroy()

 */
import onerStorage from 'oner-storage'

export const localStorage = onerStorage({
  type: 'localStorage', // 缓存方式, 默认为'localStorage'
  key: 'react-start-ts', // !!! 唯一必选的参数, 用于内部存储 !!!
  tag: 'v1.0', // 缓存的标记, 用于判断是否有效
  duration: 1000 * 60 * 60 * 12, // 缓存的有效期长, 以毫秒数指定
})

export const sessionStorage = onerStorage({
  type: 'sessionStorage', // 缓存方式, 默认为'localStorage'
  key: 'react-start-ts', // !!! 唯一必选的参数, 用于内部存储 !!!
})
