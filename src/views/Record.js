import React, {useContext, useEffect, useRef, useState} from 'react'
import {FirebaseContext} from '../context/firebase/firebaseContext'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {messageToast} from '../utils/message.plugin'
import {Loader} from '../UI/Loader'
import {Helmet} from "react-helmet-async"

export const Record = () => {
  const ref = useRef()
  const {categories, info, createRecord, updateInfo} = useContext(FirebaseContext)
  const [current] = useState(categories.length ? categories[0].id : undefined)
  const [loading, setLoading] = useState(false)

  const validate = (values) => {
    const errors = {}

    if (values.description.length === 0) {
      errors.description = 'Введите описание'
    }

    if (values.amount < 100) {
      errors.amount = 'Значение не может быть менее 100'
    } else if (!/^[0-9]+$/i.test(values.amount)) {
      errors.amount = 'Введите целое числовое значение'
    }

    return errors
  }

  const formik = useFormik({
    initialValues: {
      description: '',
      amount: '',
      type: 'outcome',
      current: current
    },
    validate,
    onSubmit: values => recordHandler(values),
    enableReinitialize: true
  })

  const recordHandler = async ({description, amount, type, current}) => {
    let bill

    if (type === 'outcome' && info.bill < amount) {
      return messageToast(`Недостаточно средств: ${amount - info.bill}`)
    }

    setLoading(true)

    await createRecord({description, amount, type, categoryId: current, date: new Date().toJSON()})
    type === 'income' ? bill = info.bill + amount : bill = info.bill - amount
    await updateInfo({bill})
    formik.resetForm()
    messageToast('Запись успешно создана')

    setLoading(false)
  }

  useEffect(() => {
    window.M.updateTextFields()
    window.M.FormSelect.init(ref.current)
  })

  return (
    <div>
      <Helmet>
        <title>Домашняя Бухгалтерия | Добавить запись</title>
        <meta name="description" content="Домашняя бухгалтерия добавление записи"/>
      </Helmet>
      <div className="page-title">
        <h3>Новая запись</h3>
      </div>
      {
        loading
          ?
        <Loader/>
          :
          <>
            {
              !categories.length
                ?
                  <h5 style={{textAlign: 'center'}}>Категорий пока нет. <Link to='/categories'>Добавьте новую.</Link></h5>
                :
                  <form className="form" onSubmit={formik.handleSubmit} noValidate>
                  <div className="input-field">
                    <select
                      ref={ref}
                      id='current'
                      value={formik.values.current}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    >
                      {categories.map(cat => <option defaultValue={categories[0].id} onChange={formik.handleChange} onBlur={formik.handleBlur} value={cat.id} key={cat.id}>{cat.title}</option>)}
                    </select>
                    <label>Выберите категорию</label>
                  </div>

                  <p>
                    <label>
                      <input
                        className="with-gap"
                        name="type"
                        type="radio"
                        value="income"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <span>Доход</span>
                    </label>
                  </p>

                  <p>
                    <label>
                      <input
                        className="with-gap"
                        name="type"
                        type="radio"
                        value="outcome"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        defaultChecked
                      />
                      <span>Расход</span>
                    </label>
                  </p>

                  <div className="input-field">
                    <input
                      id="amount"
                      type="number"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.amount}
                      className={formik.errors.amount && formik.touched.amount ? 'invalid' : null}
                    />
                    <label htmlFor="amount">Сумма</label>
                    {formik.errors.amount && formik.touched.amount ? <span className="helper-text invalid">{formik.errors.amount}</span> : null}
                  </div>

                  <div className="input-field">
                    <input
                      id="description"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.description}
                      className={formik.errors.description && formik.touched.description ? 'invalid' : null}
                    />
                    <label htmlFor="description">Описание</label>
                    {formik.errors.description && formik.touched.description ? <span className="helper-text invalid">{formik.errors.description}</span> : null}
                  </div>

                  <button className="btn waves-effect waves-light" type="submit">
                    Создать
                    <i className="material-icons right">send</i>
                  </button>
                </form>
            }
          </>
      }

    </div>
  )
}
