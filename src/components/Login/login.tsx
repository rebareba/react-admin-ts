/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2022-05-05 11:04:05
 * @Description: 登录页面
 */
import React, {FormEvent, useState} from 'react'
import {history, config} from '@utils'
import './login.styl'
import io from './io'
import bg from './image/bg.jpg'

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>()
  const [mobile, setMobile] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    const {success, content} = await io.login()
    setLoading(false)
    if (!success) return
    const querys = new URLSearchParams(history.location.search)
    const redirect = querys.get('redirect')
    if (redirect) {
      history.push(redirect)
    } else {
      history.push(`${config.pathPrefix}`)
    }
  }
  return (
    <div className="loginMain" style={{backgroundImage: `url(${bg})`}}>
      <div className="formContainer cfb40">
        <div className="title mt30">登 录</div>
        <form className="mt30" onSubmit={handleSubmit}>
          <input name="mobile" type="text" value={mobile} placeholder="请输入手机号" onChange={(e) => setMobile(e.target.value)} />
          <input name="password" type="password" value={password} placeholder="请输入密码" onChange={(e) => setPassword(e.target.value)} />
          <div className="mt20">
            <input className="submitButton" type="submit" value={loading ? '登录中...' : '登录'} />
          </div>
          <div className="errorMessage">{message}</div>
        </form>
      </div>
    </div>
  )
}

export default Login
