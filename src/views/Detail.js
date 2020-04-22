import React, {useContext, useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {useParams} from 'react-router'
import {FirebaseContext} from '../context/firebase/firebaseContext'
import {currencyFilter} from '../filters/currency.filter'
import Moment from 'react-moment'
import 'moment/locale/ru'
import {Helmet} from "react-helmet-async"

export const Detail = () => {
  const params = useParams()
  const history = useHistory()
  const {records, categories} = useContext(FirebaseContext)
  const [recInfo, setRecInfo] = useState([])

  useEffect(() => {
  if (records.length) {
      !records.find(r => r.id === params.id)
        ?
        history.push('/home')
        :
        setRecInfo({...records.find(r => r.id === params.id), title: categories.find(c => c.id === records.find(r => r.id === params.id).categoryId) ? categories.find(c => c.id === records.find(r => r.id === params.id).categoryId).title : 'Категория была удалена' })
    }
  }, [records, categories])

  return (
    <>
      <Helmet>
        <title>Домашняя Бухгалтерия | Детали записи</title>
        <meta name="description" content="Домашняя бухгалтерия детали записи"/>
      </Helmet>
      <div>
        <div className="breadcrumb-wrap">
          <Link to="/history" className="breadcrumb">
            История
          </Link>
          <a className="breadcrumb">{recInfo.type === 'outcome' ? 'Расход' : 'Доход'}</a>
        </div>
        <div className="row">
          <div className="col s12 m6">
            <div className={`card ${recInfo.type === 'outcome' ? 'red' : 'green'}`}>
              <div className="card-content white-text">
                <p>Описание: {recInfo.description}</p>
                <p>Сумма: {currencyFilter(recInfo.amount)}</p>
                <p>Категория: {recInfo.title}</p>

                <small><Moment locale="ru" format="LLLL" interval={1000}>{recInfo.date}</Moment></small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
