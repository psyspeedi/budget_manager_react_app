import {
  CLEAR_INFO,
  FETCH_CURRENTLY_INFO,
  FETCH_INFO,
  GET_UID,
  LOGIN,
  LOGOUT,
  RESET_LOADING,
  SET_LOADING,
  CREATE_CATEGORY,
  FETCH_CATEGORIES,
  CREATE_RECORD,
  FETCH_RECORDS,
} from '../types'

const handlers = {
  [SET_LOADING]: (state) => ({...state, loading: true}),
  [RESET_LOADING]: (state) => ({...state, loading: false}),
  [LOGIN]: (state, {payload}) => ({...state, loading: false, currentUser: payload}),
  [LOGOUT]: (state) => ({...state, loading: false}),
  [GET_UID]: (state, {payload}) => ({...state, uid: payload}),
  [FETCH_INFO]: (state, {payload}) => ({...state, info: payload}),
  [CLEAR_INFO]: (state) => ({...state, currentUser: null, info: {}, currentlyInfo: [], categories: [], records: []}),
  [FETCH_CURRENTLY_INFO]: (state, {payload}) => ({...state, currentlyInfo: payload}),
  [CREATE_CATEGORY]: (state, {payload}) => ({...state, categories: [...state.categories, payload]}),
  [FETCH_CATEGORIES]: (state, {payload}) => ({...state, categories: payload}),
  [CREATE_RECORD]: (state, {payload}) => ({...state, records: [...state.records, payload]}),
  [FETCH_RECORDS]: (state, {payload}) => ({...state, records: payload}),
  DEFAULT: state => state
}

export const firebaseReducer = (state, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT
  return handler(state, action)
}