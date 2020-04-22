import React, {useReducer} from 'react'
import {FirebaseContext} from './firebaseContext'
import {firebaseReducer} from './firebaseReducer'
import {
  CLEAR_INFO,
  FETCH_CURRENTLY_INFO,
  FETCH_INFO,
  LOGIN,
  LOGOUT,
  RESET_LOADING,
  SET_LOADING,
  CREATE_CATEGORY,
  FETCH_CATEGORIES,
  CREATE_RECORD, FETCH_RECORDS,
} from '../types'
import firebase from 'firebase/app'

export const FirebaseState = ({children}) => {
  const initialState = {
    loading: false,
    info: {},
    currentlyInfo: [],
    categories: [],
    currentCategory: null,
    records: []
  }

  const [state, dispatch] = useReducer(firebaseReducer, initialState)

  const setLoading = () => dispatch({type: SET_LOADING})

  const resetLoading = () => dispatch({type: RESET_LOADING})

  const clearInfo = () => dispatch({type: CLEAR_INFO})

  const login = async (email, password) => {
    setLoading()
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
      const user = await firebase.auth().currentUser
      dispatch({type: LOGIN, payload: user})
    } catch (e) {
      resetLoading()
      throw e
    }
  }

  const register = async (name, email, password) => {
    setLoading()
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password)
      const uid = await getUid()
      await firebase.database().ref(`/users/${uid}/info`).set({
        bill: 0,
        name
      })
      resetLoading()
    } catch (e) {
      resetLoading()
      throw e
    }
  }

  const logout = async () => {
    setLoading()
    clearInfo()
    try {
      await firebase.auth().signOut()
      dispatch({type: LOGOUT})
    } catch (e) {
      resetLoading()
      throw e
    }
  }

  const getUid = async () => {
    const user = await firebase.auth().currentUser
    return user ? user.uid : null
  }

  const fetchInfo = async () => {
    try {
      const uid = await getUid()
      const info = (await firebase.database().ref(`/users/${uid}/info`).once('value')).val()
      dispatch({type: FETCH_INFO, payload: info})
    } catch (e) {
      throw e
    }
  }

  const updateInfo = async (toUpdate) => {
    try {
      const uid = await getUid()
      const updateData = {...state.info, ...toUpdate}
      await firebase.database().ref(`/users/${uid}/info`).update(updateData)
      await fetchInfo()
      await fetchCurrencyInfo()
    }catch (e) {
      throw e
    }
  }

  const fetchCurrencyInfo = async () => {
    try {
      const response = await fetch('https://quotes.instaforex.com/api/quotesTick?f=ask%2Clasttime&q=usdrub%2Ceurusd')
      const data = await response.json()

      const uid = await getUid()
      const rub = (await firebase.database().ref(`/users/${uid}/info/bill`).once('value')).val()

      const usdPrice = (data.find(item => item.symbol === 'USDRUB')).ask
      const usd = rub / usdPrice

      const eurPrice = (data.find(item => item.symbol === 'USDRUB')).ask * (data.find(item => item.symbol === 'EURUSD')).ask
      const eur = rub / eurPrice

      const dataArr = [
        {
          symbol: 'RUB',
          bill: rub,
          price: 1,
        },

        {
          symbol: 'USD',
          bill: usd,
          price: usdPrice
        },

        {
          symbol: 'EUR',
          bill: eur,
          price: eurPrice
        }
      ]

      dispatch({type: FETCH_CURRENTLY_INFO, payload: dataArr})
    } catch (e) {
      throw e
    }
  }

  const fetchCategories = async () => {
    try {
      const uid = await getUid()
      const categories = (await firebase.database().ref(`/users/${uid}/categories`).once('value')).val()

      if (!categories) {
        return dispatch({type: FETCH_CATEGORIES,  payload: []})
      }

      dispatch({type: FETCH_CATEGORIES,  payload: Object.keys(categories).map(key => ({...categories[key], id: key}))})
    } catch (e) {
      throw e
    }
  }

  const createCategory = async ({title, limit}) => {
    try {
      const uid = await getUid()
      const category = await firebase.database().ref(`/users/${uid}/categories`).push({title, limit})
      dispatch({type: CREATE_CATEGORY, payload: {title, limit, id: category.key}})
    } catch (e) {
      throw e
    }
  }

  const updateCategory = async ({title, limit}, id) => {
    try {
      const uid = await getUid()
      await firebase.database().ref(`/users/${uid}/categories`).child(id).update({title, limit})
      await fetchCategories()
    } catch (e) {
      throw e
    }
  }

  const deleteCategory = async (id) => {
    try {
      const uid = await getUid()
      await firebase.database().ref(`/users/${uid}/categories`).child(id).remove()
      await fetchCategories()
    } catch (e) {
      throw e
    }
  }

  const deleteAllRecordsByCategoryId = async (id) => {
    try {
      const uid = await getUid()
      const query = await firebase.database().ref(`/users/${uid}/records`).orderByChild('categoryId').equalTo(id)
      await query.once('value', snapshot => {
        snapshot.forEach(children => {
          children.ref.remove()
        })
      })
      await fetchRecords()
    } catch (e) {
      throw e
    }
  }

  const deleteRecord = async (id) => {
    try {
      const uid = await getUid()
      await firebase.database().ref(`/users/${uid}/records`).child(id).remove()
      await fetchRecords()
    } catch (e) {
      throw e
    }
  }

  const createRecord = async ({description, amount, type, categoryId, date}) => {
    try {
      const uid = await getUid()
      const record = await firebase.database().ref(`/users/${uid}/records`).push({description, amount, type, categoryId, date})
      dispatch({type: CREATE_RECORD, payload: {description, amount, type, categoryId, date, id: record.key}})
    } catch (e) {
      throw e
    }
  }

  const fetchRecords = async () => {
    try {
      const uid = await getUid()
      const records = (await firebase.database().ref(`/users/${uid}/records`).once('value')).val()

      if (!records) {
        return dispatch({type: FETCH_RECORDS,  payload: []})
      }

      dispatch({type: FETCH_RECORDS,  payload: Object.keys(records).map(key => ({...records[key], id: key}))})
    } catch (e) {
      throw e
    }
  }

  const fetchAllData = async () => {
    setLoading()
    await fetchCategories()
    await fetchRecords()
    await fetchInfo()
    await fetchCurrencyInfo()
    resetLoading()
  }

  const {loading, currentUser, info, currentlyInfo, categories, records} = state

  return (
    <FirebaseContext.Provider value={{
      setLoading,
      login,
      logout,
      register,
      fetchInfo,
      fetchCurrencyInfo,
      createCategory,
      fetchCategories,
      fetchAllData,
      updateCategory,
      deleteCategory,
      createRecord,
      updateInfo,
      deleteAllRecordsByCategoryId,
      deleteRecord,
      currentUser,
      loading,
      info,
      currentlyInfo,
      categories,
      records
    }}
    >
      {children}
    </FirebaseContext.Provider>
  )

}