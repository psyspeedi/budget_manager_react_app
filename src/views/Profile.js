import React, {useContext} from 'react'
import {FirebaseContext} from '../context/firebase/firebaseContext'
import {useFormik} from 'formik'
import {messageToast} from '../utils/message.plugin'
import {Helmet} from "react-helmet-async"

export const Profile = () => {
  const {updateInfo} = useContext(FirebaseContext)

  const validate = (values) => {
    const errors = {}

    if (values.name.length === 0) {
      errors.name = 'Введите имя'
    }

    return errors
  }

  const formik = useFormik({
    initialValues: {
      name: ''
    },
    validate,
    onSubmit: values => updateHandler(values)
  })

  const updateHandler = async (values) => {
    try {
      await updateInfo(values)
      messageToast('Ваше имя изменено')
    } catch (e) {
      messageToast('Что-то пошло не так')
    }
  }

  return (
    <div>
      <Helmet>
        <title>Домашняя Бухгалтерия | Профиль</title>
        <meta name="description" content="Домашняя бухгалтерия профиль"/>
      </Helmet>
      <div className="page-title">
        <h3>Профиль</h3>
      </div>

      <form className="form" onSubmit={formik.handleSubmit}>
        <div className="input-field">
          <input
            id="name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className={formik.errors.name && formik.touched.name ? 'invalid' : null}
          />
          <label htmlFor="name">Имя</label>
          {formik.errors.name && formik.touched.name ? <span className="helper-text invalid">{formik.errors.name}</span> : null}
        </div>

        <button disabled={formik.isSubmitting} className="btn waves-effect waves-light" type="submit">
          Обновить
          <i className="material-icons right">send</i>
        </button>
      </form>
    </div>
  )
}
