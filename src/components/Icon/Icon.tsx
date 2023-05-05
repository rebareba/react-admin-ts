/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2022-05-05 16:45:14
 * @Description:
 */
import React from 'react'
type TProps = {
  name: string
  size?: number | string
  fill?: string
  opacity?: number
  className?: string
}

const Icon: React.FC<TProps> = ({name, size = '1em', fill = '', className, opacity = 1}) => (
  <svg width={size} style={{opacity, display: 'inline-block', lineHeight: 1}} height={size} fill={fill} className={className}>
    <use xlinkHref={`#${name}`} />
  </svg>
)

export default Icon
