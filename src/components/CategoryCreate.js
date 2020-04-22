import React, {useContext} from 'react'
import {useFormik} from 'formik'
import {FirebaseContext} from '../context/firebase/firebaseContext'
import {messageToast} from '../utils/message.plugin'

export const CategoryCreate = ({validate, setLoading}) => {
  const {createCategory, fetchCategories} = useContext(FirebaseContext)

  const formik = useFormik({
    initialValues: {
      title: '',
      limit: 100
    },
    validate,
    onSubmit: values => createHandler(values)
  })

  const createHandler = async (values) => {
    setLoading(true)
    await createCategory(values)
    await fetchCategories()
    messageToast('Категория была создана')
    setLoading(false)
  }

  return (
    <div className="col s12 m6">
      <div>
        <div className="page-subtitle">
          <h4>Создать</h4>
        </div>

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="input-field">
            <input
              id="title"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
              className={formik.errors.title && formik.touched.title ? 'invalid' : null}
            />
            <label htmlFor="title">Название</label>
            {formik.errors.title && formik.touched.title ? <span className="helper-text invalid">{formik.errors.title}</span> : null}

          </div>

          <div className="input-field">
            <input
              id="limit"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.limit}
              className={formik.errors.limit && formik.touched.limit ? 'invalid' : null}
            />
            <label htmlFor="limit">Лимит</label>
            {formik.errors.limit && formik.touched.limit ? <span className="helper-text invalid">{formik.errors.limit}</span> : null}
          </div>

          <button className="btn waves-effect waves-light" type="submit">
            Создать
            <i className="material-icons right">send</i>
          </button>
        </form>
      </div>
    </div>
  )
}