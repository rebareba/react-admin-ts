/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2023-04-18 09:27:50
 * @Description: 首页
 */
import React, {useEffect} from 'react'
import {useGlobalStore, EActions} from '@store'
import {Empty} from 'antd'
import Icon from '@components/Icon'

const Index: React.FC = () => {
  const {dispatch} = useGlobalStore()
  // 导航栏变化
  useEffect(() => {
    dispatch({
      type: EActions.SET_BREADCRUMB,
      payload: [{name: '首页'}, {name: '待开发'}],
    })
  }, [dispatch])

  return (
    <div className="p10 h100 ">
      <div className="h100 p20 bcw">
        <h1 className="text-3xl font-bold underline">Hello world! </h1>
        <Empty
          description={
            <span>
              <Icon name="user" className="mr10" />
              待开发
            </span>
          }
        />
      </div>
    </div>
  )
}
export default Index
