/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2022-07-04 09:51:09
 * @Description: 自动识别容器的高度的变化
 */
import React, {useCallback} from 'react'
import {useResizeDetector} from 'react-resize-detector'

type TReturn = {
  width: number | undefined
  height: number | undefined
}
const useHeight = (ref: React.MutableRefObject<HTMLDivElement | null>, per = 0.3): TReturn => {
  const onResize = useCallback(() => {
    if (ref.current) {
      ref.current.style.height = `${ref.current.offsetWidth * per}px`
    }
  }, [ref, per])
  // const {width, height, ref} = useResizeDetector()
  const {width, height} = useResizeDetector({
    handleHeight: false,
    // refreshMode: 'debounce', // 防抖
    // refreshRate: 200,
    targetRef: ref,
    onResize,
  })

  return {width, height}
}
export default useHeight
