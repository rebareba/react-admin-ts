/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2023-04-20 16:51:15
 * @Description: antd 的表格处理
 */
import {useState, useEffect, useReducer, useCallback} from 'react'
import {TableProps, TablePaginationConfig} from 'antd'
import {IFCall} from '@common/create-io'

enum EType {
  LOADING,
  DATA_CHANGE,
}

type TState = {
  loading: boolean
  currentPage: number
  pageSize: number
  total: number
  order?: 'DESC' | 'ASC'
  field?: string
  dataSource: any[]
  params: Record<string, unknown>
}

interface IType {
  type: EType
  payload?: any
}

// 定义 reducer

function reducer<T>(state: T, action: IType): T {
  switch (action.type) {
    case EType.LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case EType.DATA_CHANGE:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}
// 默认属性值
const DEFAULT_STATE = {
  loading: false,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  // order: 'DESC',
  // field: 'applyTime',
  dataSource: [],
  params: {},
}
// 返回的数据格式
interface IReturn {
  onSearch: IOneParamFunc
  tableProps: TableProps<any> & {pagination: TablePaginationConfig & {current: number; pageSize: number}}
  params: Record<string, unknown>
}

export default (ioFunc: IFCall, initState: Partial<TState>, dataField = 'data', countField = 'count'): IReturn => {
  const [
    {
      loading, // 加载态
      currentPage, // 当前页
      pageSize, // 一页多少条
      total, // 总共多少条
      order, // 排序方向
      field, // 排序字段
      dataSource, // 数据
      params, // 额外搜索项
    },
    dispatch,
  ] = useReducer<(state: TState, action: IType) => TState>(reducer, {...DEFAULT_STATE, ...initState})

  // 调用请求获取数据
  const fetchData = useCallback(
    async (param: Pick<TState, 'currentPage' | 'pageSize' | 'field' | 'order'> | any) => {
      dispatch({type: EType.LOADING, payload: true})
      const {content, success} = await ioFunc({
        ...param,
      })
      // list: [,…]
      // pageNum: 1
      // pageSize: 10
      // taskStateStatisticsMap: {completeTask: 0, taskLevelFour: 0, taskLevelTwo: 1, executeTask: 0, allTask: 1, assignStateTask: 1,…}
      // total: 1
      if (success) {
        dispatch({
          type: EType.DATA_CHANGE,
          payload: {
            loading: false,
            dataSource: content[dataField],
            total: content[countField],
          },
        })
      } else {
        dispatch({type: EType.LOADING, payload: false})
      }
    },
    [ioFunc, dataField, countField],
  )

  useEffect(() => {
    fetchData({
      currentPage,
      pageSize,
      order,
      field,
      ...params,
    })
  }, [fetchData, currentPage, pageSize, order, field, params])

  const onChange: TableProps<any>['onChange'] = ({current, pageSize}, filters, sortResult) => {
    // 这里的sortResult 可能是数组 需要优化   // {order = '', field = ''}
    const {order = '', field = ''} = sortResult as any
    !loading &&
      dispatch({
        type: EType.DATA_CHANGE,
        payload: {currentPage: current, pageSize, order: order !== '' ? (order === 'descend' ? 'DESC' : 'ASC') : '', field},
      })
  }
  const onSearch: IOneParamFunc = async (nextParams) => {
    if (nextParams === undefined) {
      // 手动刷新
      fetchData({
        currentPage,
        pageSize,
        ...params,
        order,
        sort: field,
      })
    } else {
      // 点击搜索按钮 跳到第一页
      !loading &&
        dispatch({
          type: EType.DATA_CHANGE,
          payload: {
            params: {
              ...params,
              ...nextParams,
            },
            current: 1,
          },
        })
    }
  }

  return {
    params: params,
    onSearch: onSearch,
    tableProps: {
      rowClassName: (rowData, index) => `ant-table-row-${index % 2}`,
      loading,
      dataSource,
      pagination: {
        showTotal: (total: number) => `共${total}条`,
        current: currentPage,
        pageSize,
        total,
        // pageSizeOptions: [10, 20, 50, 100],
        // showQuickJumper: true,
        // showSizeChanger: true,
      },
      onChange,
    },
  }
}
