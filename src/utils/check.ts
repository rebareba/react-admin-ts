export const rule = {
  mobile: /^1[3456789]\d{9}$/,
  mail: /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+(.[a-zA-Z0-9_-])+/,
  // 长度为2-31的大小写英文、中文-、_、.、和空格
  name: /^[\u4e00-\u9fa5a-zA-Z0-9-_.\s]{2,31}$/,
  // 长度为2-31的大小写英文、中文-_
  username: /^[\u4e00-\u9fa5a-zA-Z0-9-_]{2,31}$/,
  folder: /[]/,
  // 数字，长度为5
  verify: /^[0-9]{5}$/,
  url: /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/,
}
type TRule = typeof rule
export default (type: keyof TRule, value: string): boolean => {
  return rule[type].test(value)
}
