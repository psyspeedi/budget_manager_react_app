import React from 'react'
import {currencyFilter} from '../filters/currency.filter'
import Moment from 'react-moment'
import 'moment/locale/ru'

export const HomeCurrency = ({currency}) => {
  return (
    <div className="col s12 m6 l8">
      <div className="card orange darken-3 bill-card">
        <div className="card-content white-text">
          <div className="card-header">
            <span className="card-title">Курс валют по данным instaforex</span>
          </div>
          <table>
            <thead>
            <tr>
              <th>Валюта</th>
              <th>Курс</th>
              <th>Дата</th>
            </tr>
            </thead>
              <tbody>
                {currency.map(cur => {
                  return (
                    <tr key={cur.price}>
                      <td>{currencyFilter(1, cur.symbol)}</td>
                      <td>{currencyFilter(cur.price)}</td>
                      <td><Moment locale="ru" format='D MMM YYYY HH:mm'></Moment></td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}