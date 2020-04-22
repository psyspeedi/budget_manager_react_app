import React, {useState} from 'react'
import {currencyFilter} from '../filters/currency.filter'
import Moment from 'react-moment'
import {Link} from 'react-router-dom'
import {messageToast} from '../utils/message.plugin'

export const HistoryTable = ({recInfo, deleteRecord, loading}) => {
  const [load, setLoad] = useState(false)

  const removeRecord = async (id) => {
    setLoad(true)
    try {
      await deleteRecord(id)
      messageToast('Запись удалена')
    } catch (e) {
      messageToast('[ОШИБКА]: Что-то пошло не так')
      throw e
    }
    setLoad(false)
  }

  return (
    <>
      {loading
        ?
          null
        :
        <section>
          {
            !recInfo
              ?
              <h5 style={{textAlign: 'center'}}>Записи за выбранные даты отсуствуют.</h5>
              :
              <table>
                <thead>
                <tr>
                  <th>#</th>
                  <th>Сумма</th>
                  <th>Дата</th>
                  <th>Категория</th>
                  <th>Тип</th>
                  <th>Открыть</th>
                  <th>Удалить</th>
                </tr>
                </thead>

                <tbody>
                {recInfo.map(r => (
                  <tr key={r.id}>
                    <td>{r.idx + 1}</td>
                    <td>{currencyFilter(r.amount)}</td>
                    <td><Moment locale="ru" className="black-text" format="LL" interval={1000}>{r.date}</Moment></td>
                    <td>{r.categoryName}</td>
                    <td>
                      <span className={`white-text badge ${r.categoryType}`}>{r.typeText}</span>
                    </td>
                    <td>
                      <Link disabled={load} to={`/detail/${r.id}`} className="btn-small btn">
                        <i className="material-icons">open_in_new</i>
                      </Link>
                    </td>
                    <td>
                      <button disabled={load} onClick={() => removeRecord(r.id)} className='btn-small btn'>
                        <i className="material-icons">delete</i>
                      </button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
          }
        </section>
      }
    </>

  )
}