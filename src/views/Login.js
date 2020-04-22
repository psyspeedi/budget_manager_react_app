import React, {useContext, useEffect} from 'react'
import {Link, useHistory, useLocation} from 'react-router-dom'
import { useFormik } from 'formik'
import { messageToast } from '../utils/message.plugin'
import {FirebaseContext} from '../context/firebase/firebaseContext'
import {Helmet} from "react-helmet-async"


const validate = (values) => {
  const errors = {}

  if (!values.email) {
    errors.email = 'Введите email адрес'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Некорректный email адрес'
  }

  if (!values.password) {
    errors.password = 'Введите пароль'
  } else if (
    !/([a-z]+[A-Z]+[0-9]+|[a-z]+[0-9]+[A-Z]+|[A-Z]+[a-z]+[0-9]+|[A-Z]+[0-9]+[a-z]+|[0-9]+[a-z]+[A-Z]+|[0-9]+[A-Z]+[a-z]+)/i.test(
      values.password,
    )
  ) {
    errors.password = 'Пароль должен сожержать латинские буквы и цифры'
  } else if (values.password.length < 12) {
    errors.password = `Минимальная длина пароля 12 символов, сейчас ${values.password.length}`
  }

  return errors
}

export const Login = () => {
  const history = useHistory()
  const query = useLocation()
  const {login, loading} = useContext(FirebaseContext)

  const loginHandler = async ({ email, password }) => {
    try {
      await login(email, password)
      history.push('/home')
      messageToast('Вы вошли в систему')
    } catch (e) {
      messageToast(e.code)
    }
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate,
    onSubmit: values => loginHandler(values)
    ,
  })

  useEffect(() => {
    const mess = new URLSearchParams(query.search).get('message') ? new URLSearchParams(query.search).get('message') : null
    if (mess) {
      messageToast(mess)
    }
  }, [query.search])

  return (
    <>
      <Helmet>
        <title>Домашняя Бухгалтерия | Вход</title>
        <meta name="description" content="Домашняя бухгалтерия вход"/>
      </Helmet>
      <form className="card auth-card" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-content">
          <span className="card-title">Домашняя бухгалтерия</span>

          <div className="input-field">
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}
              className={formik.errors.email && formik.touched.email ? 'invalid' : null}
            />
            <label htmlFor="email">Email</label>

            {formik.errors.email && formik.touched.email ? (
              <small className="helper-text invalid">{formik.errors.email}</small>
            ) : null}
          </div>

          <div className="input-field">
            <input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
              className={formik.errors.password && formik.touched.password ? 'invalid' : null}
            />
            <label htmlFor="password">Пароль</label>
            {formik.errors.password && formik.touched.password ? (
              <small className="helper-text invalid">{formik.errors.password}</small>
            ) : null}
          </div>
        </div>
        <div className="card-action">
          <div>
            <button className="btn waves-effect waves-light auth-submit" disabled={loading} type="submit">
              Войти
              <i className="material-icons right">send</i>
            </button>
          </div>

          <p className="center">
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </p>
        </div>
      </form>
    </>
  )
}
