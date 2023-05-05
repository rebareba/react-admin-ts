import {createBrowserHistory, createHashHistory, History} from 'history'
import config from './config'

let history: History
if (config.historyType === 'hash') {
  history = createHashHistory({})
} else {
  history = createBrowserHistory({})
}

export default history
