import React, {useContext, useEffect, useRef, useState} from 'react'
import {FirebaseContext} from '../context/firebase/firebaseContext'
import {Loader} from '../UI/Loader'
import {HomeBill} from '../components/HomeBill'
import {HomeCurrency} from '../components/HomeCurrency'
import {messageToast} from '../utils/message.plugin'
import {Helmet} from "react-helmet-async"

export const Home = () => {
  const {fetchCurrencyInfo, currentlyInfo} = useContext(FirebaseContext)
  const [loading, setLoading] = useState(false)
  const ref = useRef()

  const refreshCurrentlyInfo = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetchCurrencyInfo()
      setLoading(false)
    } catch (e) {
      messageToast(e.code)
      setLoading(false)
      throw e
    }
  }

  useEffect(() => {
    const tooltip = window.M.Tooltip.init(ref.current)
    return () => {
      if (tooltip && tooltip.destroy) {
        tooltip.destroy()
      }
    }
  })

  return (
    <div>
      <Helmet>
        <title>Домашняя Бухгалтерия | Счет</title>
        <meta name="description" content="Домашняя бухгалтерия счет"/>
      </Helmet>
      <div className="page-title">
        <h3>Счет</h3>

        <button ref={ref}
                onClick={(e) => refreshCurrentlyInfo(e)}
                className="tooltipped btn waves-effect waves-light btn-small"
                data-position='left' data-tooltip='Обновить курс валют'
        >
          <i className="material-icons">refresh</i>
        </button>
      </div>
      {
        loading
        ?
          <Loader/>
        :
          <div className="row">
            <HomeBill currency={currentlyInfo}/>
            <HomeCurrency currency={currentlyInfo}/>
          </div>
      }
    </div>
  )
}
