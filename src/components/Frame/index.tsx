import {useGlobalStore} from '@src/store'
import React, {FC, ReactComponentElement, ReactNode} from 'react'
import Frame from './frame'
import './frame.styl'

interface IProps {
  children: ReactNode
}
// export default Frame

// eslint-disable-next-line react/display-name, @typescript-eslint/explicit-module-boundary-types
export default ({children}: IProps) => {
  const {state, dispatch} = useGlobalStore()

  return <Frame theme="dark">{children} </Frame>
}
