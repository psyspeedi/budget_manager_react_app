import {SET_RAGE_DATE_FROM, SET_RAGE_DATE_TO} from '../types'

const handlers = {
  [SET_RAGE_DATE_FROM]: (state, {payload}) => ({...state, rageDateFrom: payload}),
  [SET_RAGE_DATE_TO]: (state, {payload}) => ({...state, rageDateTo: payload}),
  DEFAULT: state => state
}

export const datePickerReducer = (state, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT
  return handler (state, action)
}