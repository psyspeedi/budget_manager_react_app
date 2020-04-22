import React, {useContext, useEffect, useRef, useState} from 'react'
import {FirebaseContext} from '../context/firebase/firebaseContext'
import {Loader} from '../UI/Loader'
import {HistoryTable} from '../components/HistoryTable'
import {DatePicker} from '../components/DatePicker'
import ReactPaginate from 'react-paginate'
import {useHistory, useLocation} from 'react-router'
import {DatePickerContext} from '../context/datePicker/datePickerContext'
import {messageToast} from '../utils/message.plugin'
import {Diagrama} from '../UI/Diagrama'
import {Helmet} from "react-helmet-async"
import _ from 'lodash'


export const History = () => {
  const refArr = useRef([])
  const history = useHistory()
  const location = useLocation()
  const {records, categories, deleteRecord} = useContext(FirebaseContext)
  const {rageDateFrom, rageDateTo, setRageDateFrom, setRageDateTo,} = useContext(DatePickerContext)
  const [loading, setLoading] = useState(true)
  const [recInfo, setRecInfo] = useState([])
  const [paginationRecords, setPaginationRecords] = useState([])
  const [activePage, setActivePage] = useState(0)
  const [filteredRecords, setFilteredRecords] = useState([])
  const [outcomeArr, setOutcomeArr] = useState([])
  const [incomeArr, setIncomeArr] = useState([])
  const [checkbox, setCheckbox] = useState(false)

  const paginationHandler = (page) => {
    setActivePage(+page)
    history.push(`/history?page=${page}`)
  }

  const applyFilterRecords = (e) => {
    e.preventDefault()
    setLoading(true)
    setPaginationRecords(_.chunk(filteredRecords, 10))
    setActivePage(0)
    history.push(`/history?page=0`)
    messageToast('Фильтр применен')

    if (filteredRecords.length) {
      setIncomeArr(filteredRecordsByIdForDiagram('income', filteredRecords))
      setOutcomeArr(filteredRecordsByIdForDiagram('outcome', filteredRecords))
    }
    else {
      setOutcomeArr(filteredRecordsByIdForDiagram('outcome', []))
      setIncomeArr(filteredRecordsByIdForDiagram('income', []))
    }

    setLoading(false)
  }

  const cancelFilterRecords = (e) => {
    e.preventDefault()
    setLoading(true)
    setRageDateFrom(undefined)
    setRageDateTo(undefined)
    setPaginationRecords(_.chunk(recInfo, 10))
    setActivePage(0)
    setFilteredRecords([])
    setOutcomeArr(filteredRecordsByIdForDiagram('outcome', recInfo))
    setIncomeArr(filteredRecordsByIdForDiagram('income', recInfo))
    history.push(`/history?page=0`)
    messageToast('Фильтр сброшен')
    setLoading(false)
  }

  const filteredRecordsByIdForDiagram = (type, data) => {
    const outcome = recInfo.map(r => {
      const out = data
        .filter(rec => rec.categoryId === r.categoryId)
        .filter(rec => rec.type === type)
        .reduce((total, record) => {
          return total += +record.amount
        }, 0)

      return {value: out, label: r.categoryName, id: r.categoryName}
    })

    const filteredOutcome = outcome.map(f => f.id)
    const categoryIdFiltered = filteredOutcome
      .filter((o, i) => filteredOutcome.indexOf(o) === i)
      .map(c => outcome.filter(o => o.id === c))
      .map(r => r.slice(0, 1))
      .map(r => r[0])

    return categoryIdFiltered
  }

  useEffect(() => {
    setActivePage(+(new URLSearchParams(location.search).get('page')))
  }, [location.search])

  useEffect(() => {
    setLoading(true)

    setRecInfo(records.reverse().map((r, i) => {
      return {
        ...r,
        categoryName: categories.find(c => c.id === r.categoryId) ? (categories.find(c => c.id === r.categoryId)).title : 'Категория была удалена',
        categoryType: r.type === 'income' ? 'green' : 'red',
        typeText: r.type === 'income' ? ' Доход' : 'Расход',
        idx: i
      }
    }))

    setLoading(false)
  }, [records, categories])

  useEffect(() => {
    setLoading(true)
    setPaginationRecords(_.chunk(recInfo, 9))
    setLoading(false)
  }, [recInfo])

  useEffect(() => {
    if (rageDateFrom && rageDateTo) {
      const rageDateFromYear = new Date(rageDateFrom.toJSON()).getFullYear()
      const rageDateFromMonth = new Date(rageDateFrom.toJSON()).getMonth()
      const rageDateFromDate = new Date(rageDateFrom.toJSON()).getDate()

      const rageDateToYear = new Date(rageDateTo.toJSON()).getFullYear()
      const rageDateToMonth = new Date(rageDateTo.toJSON()).getMonth()
      const rageDateToDate = new Date(rageDateTo.toJSON()).getDate()

      if(new Date(rageDateFrom.toJSON()).getTime() !== new Date(rageDateTo.toJSON()).getTime()) {
        return setFilteredRecords(recInfo.filter(r => {
          const day = new Date(r.date).getDate()
          const month = new Date(r.date).getMonth()
          const year = new Date(r.date).getFullYear()

          return new Date(year, month, day).getTime() >= new Date(rageDateFromYear, rageDateFromMonth, rageDateFromDate).getTime()
              && new Date(year, month, day).getTime() <= new Date(rageDateToYear, rageDateToMonth, rageDateToDate).getTime()
        }))
      }

      if(new Date(rageDateFrom.toJSON()).getTime() === new Date(rageDateTo.toJSON()).getTime()) {
        return setFilteredRecords(recInfo.filter(r => {
          const day = new Date(r.date).getDate()
          const month = new Date(r.date).getMonth()
          const year = new Date(r.date).getFullYear()

          return new Date(year, month, day).getTime() === new Date(rageDateFromYear, rageDateFromMonth, rageDateFromDate).getTime()
        }))
      }
    }
  }, [rageDateFrom, rageDateTo, recInfo])

  useEffect(() => {
    setOutcomeArr(filteredRecordsByIdForDiagram('outcome', recInfo))
    setIncomeArr(filteredRecordsByIdForDiagram('income', recInfo))
  }, [recInfo])

  useEffect(() => {
    const tooltip = refArr.current.map(ref => window.M.Tooltip.init(ref))
    return () => {
      if (tooltip.length) {
        tooltip.map(ref => ref.destroy())
      }
    }
  }, [])

  return (
    <div>
      <Helmet>
        <title>Домашняя Бухгалтерия | История</title>
        <meta name="description" content="Домашняя бухгалтерия история записей"/>
      </Helmet>
      <div className="page-title">
        <h3>История записей</h3>
        <div className="switch">
          <label>
            Список
            <input type="checkbox" value={checkbox} onChange={() => setCheckbox(!checkbox)} />
            <span className="lever"></span>
            Диаграммы
          </label>
        </div>
        <div style={{marginRight: 170}}>
          <span>Выберите период</span>
          <div style={{display: 'flex'}}>
            <DatePicker />
            <button
              ref={ref => refArr.current.push(ref)}
              data-position='top'
              data-tooltip='Применить фильтр'
              className='tooltipped btn waves-effect waves-light btn-small'
              onClick={(e) => applyFilterRecords(e)}
              disabled={!rageDateFrom || !rageDateTo}
            >
              <i className='material-icons'>check</i>
            </button>
            <button
              ref={ref => refArr.current.push(ref)}
              data-position='top'
              data-tooltip='Сбросить фильтр'
              className='tooltipped btn waves-effect waves-light btn-small'
              style={{marginLeft: 10}}
              disabled={!rageDateFrom && !rageDateTo}
              onClick={(e) => cancelFilterRecords(e)}
            >
              <i className='material-icons'>clear</i>
            </button>
          </div>
        </div>

      </div>

      {!records.length
        ?
          <h5 style={{textAlign: 'center'}}>Записей пока нет.</h5>
        :
          loading
            ?
              <Loader/>
            :
              checkbox
                ?
                  <div className='diagrama-container'>
                    <div className='diagrama-items'>
                      <h5 className='diagrama-title'>Доход</h5>
                      <Diagrama loading={loading} data={incomeArr} />
                    </div>
                    <div className='diagrama-items'>
                      <h5 className='diagrama-title'>Расход</h5>
                      <Diagrama loading={loading} data={outcomeArr} />
                    </div>


                  </div>
                :
                  <>
                <HistoryTable deleteRecord={deleteRecord} page={activePage} recInfo={paginationRecords[activePage]}/>
                {
                  paginationRecords.length
                    ?
                      <ReactPaginate
                        containerClassName='pagination'
                        pageClassName='waves-effect'
                        activeClassName='active'
                        previousLabel='Назад'
                        nextLabel='Вперед'
                        onPageChange={(page) => paginationHandler(page.selected)}
                        pageCount={paginationRecords.length}
                        initialPage={activePage}
                        forcePage={activePage}
                      />
                    : null
                }

              </>
      }
    </div>
  )
}
