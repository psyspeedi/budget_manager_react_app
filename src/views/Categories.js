import React, {useContext, useEffect, useState} from 'react'
import {CategoryCreate} from '../components/CategoryCreate'
import {CategoryEdit} from '../components/CategoryEdit'
import {Loader} from '../UI/Loader'
import {FirebaseContext} from '../context/firebase/firebaseContext'
import {Helmet} from "react-helmet-async"

export const Categories = () => {
  const {categories} = useContext(FirebaseContext)
  const [updateCount, setUpdateCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const updateHandler = () => {
    setUpdateCount(updateCount + 1)
  }

  const validate = (values) => {
    const errors = {}

    if (values.title.length === 0) {
      errors.title = 'Введите название категории'
    }

    if (values.limit < 100) {
      errors.limit = 'Значение не может быть менее 100'
    } else if (!/^[0-9]+$/i.test(values.limit)) {
      errors.limit = 'Введите целое числовое значение'
    }
    return errors
  }

  useEffect(() => {
    window.M.updateTextFields()
  })

  return (
    <div>
      <Helmet>
        <meta charSet='UTF-8' />
        <title>Домашняя Бухгалтерия | Категории</title>
        {/*<meta name="description" content="Домашняя бухгалтерия категории"/>*/}
      </Helmet>
      <div className="page-title">
        <h3>Категории</h3>
      </div>
      {
        loading ?
          <Loader/>
          :
          <section>
            <div className="row">
              <CategoryCreate
                validate={validate}
                loadinп={loading}
                setLoading={setLoading}
              />
              <CategoryEdit
                updateHandler={updateHandler}
                key={categories.length + updateCount}
                updateCount={updateCount}
                validate={validate}
                loadinп={loading}
                setLoading={setLoading}
              />

            </div>
          </section>
      }
    </div>
  )
}
