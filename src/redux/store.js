import { combineReducers } from 'redux'
import groupQuestion from './reducers/groupQuestion'
import IQTest from './reducers/IQTest'
import singleChoiceTest from './reducers/SingleChoiceTest'
import report from './reducers/report'
import auth from './reducers/auth'
import profile from './reducers/profile'
import transaction from './reducers/transaction'
import modalError from './reducers/modalError'
import modalTimedOut from './reducers/modalTimedOut'
import blog from './reducers/blog'
import statistics from './reducers/statistics'
import dashboard from './reducers/dashboard'
import brainTest from './reducers/brainTest'
import EQTest from './reducers/EQTest'
import customTest from './reducers/customTest'

const appReducer = combineReducers({
  groupQuestion,
  IQTest,
  singleChoiceTest,
  report,
  auth,
  profile,
  transaction,
  modalError,
  modalTimedOut,
  blog,
  statistics,
  dashboardReducer: dashboard,
  brainTest,
  EQTest,
  customTest,
})

const rootReducer = (state, action) => {
  if (action.type === 'AUTH_LOGOUT') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer
