import React, {useReducer} from 'react'
import {datePickerReducer} from './datePickerReducer'
import {SET_RAGE_DATE_FROM, SET_RAGE_DATE_TO} from '../types'
import {DatePickerContext} from './datePickerContext'

export const DatePickerState = ({children}) => {
  const initialState = {
    rageDateFrom: undefined,
    rageDateTo: undefined,
  }

  const [state, dispatch] = useReducer(datePickerReducer, initialState)


  const setRageDateFrom = (date) => {
    return dispatch({type: SET_RAGE_DATE_FROM, payload: date})
  }

  const setRageDateTo = (date) => {
    return dispatch({type: SET_RAGE_DATE_TO, payload: date})
  }

  const { rageDateFrom, rageDateTo } = state

  return (
    <DatePickerContext.Provider value={{
      setRageDateFrom,
      setRageDateTo,
      rageDateFrom,
      rageDateTo
      }}
    >
      {children}
    </DatePickerContext.Provider>
  )
}