import React, {useContext, useEffect, useRef, useState} from 'react'
import {FirebaseContext} from '../context/firebase/firebaseContext'
import {currencyFilter} from '../filters/currency.filter'
import {Link} from 'react-router-dom'
import {Loader} from '../UI/Loader'
import {Helmet} from "react-helmet-async"

export const Planning = () => {
  const {info, categories, records} = useContext(FirebaseContext)
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState(null)

  const refArr = useRef([])

  useEffect(() => {
    setCat(
      categories.map(c => {
        const spending = records
          .filter(r => r.categoryId === c.id)
          .filter(r => r.type === 'outcome')
          .reduce((total, record) => {
            return total += +record.amount
          }, 0)

        const progressPercent = (100 * spending / c.limit) > 100 ? 100 : (100 * spending / c.limit)
        const progressColor = progressPercent < 60
          ? 'green'
          : progressPercent < 100
            ? 'yellow'
            : 'red'

        return {...c, progressPercent, progressColor, spending}
      })
    )

    const tooltip = refArr.current.map(ref => window.M.Tooltip.init(ref))

    setLoading(false)
    return () => {
      if (tooltip.length) {
        tooltip.map(ref => ref.destroy())
      }
    }
  }, [loading, info, categories, records])

  return (
    <div>
      <Helmet>
        <title>Домашняя Бухгалтерия | Планирование</title>
        <meta name="description" content="Домашняя бухгалтерия планирование"/>
      </Helmet>
      <div className="page-title">
        <h3>Планирование</h3>
        <h4>{currencyFilter(info.bill)}</h4>
      </div>
      {
        !categories.length
          ?
            <h5 style={{textAlign: 'center'}}>Категорий пока нет. <Link to='/categories'>Добавьте новую.</Link></h5>
          :
          loading
            ?
              <Loader/>
            :
              <section>
              {cat.map(c => (
                <div key={c.id}>
                  <p>
                    <strong>{c.title}: </strong>
                    {currencyFilter(c.spending)} из {currencyFilter(c.limit)}
                  </p>
                  <div
                    className="progress tooltipped"
                    ref={ref => refArr.current.push(ref)}
                    data-position="bottom"
                    data-tooltip={(c.limit - c.spending) > 0 ? `Осталось ${currencyFilter(c.limit - c.spending)}` : `Лимит превышен на ${currencyFilter(c.spending - c.limit)}`}
                  >
                    <div className={`determinate ${c.progressColor}`} style={{width: c.progressPercent + '%'}}></div>
                  </div>
                </div>
              )
            )}
          </section>
      }


    </div>
  )
}
