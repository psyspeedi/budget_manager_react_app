import React from 'react'
import {currencyFilter} from '../filters/currency.filter'

export const HomeBill = ({currency}) => {
  return (
    <div className="col s12 m6 l4">
      <div className="card light-blue bill-card">
        <div className="card-content white-text">
          <span className="card-title">Счет в валюте</span>
            {currency.map((cur) => {
              return <p key={cur.symbol} className="currency-line"><span>{currencyFilter(cur.bill, cur.symbol)}</span></p>
            })}
        </div>
      </div>
    </div>
  )
}