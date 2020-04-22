import React, {useContext} from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useFormik } from 'formik'
import { messageToast } from '../utils/message.plugin'
import {FirebaseContext} from '../context/firebase/firebaseContext'
import {Helmet} from "react-helmet-async"

const validate = (values) => {
  const errors = {}

  if (!values.name) {
    errors.name = 'Введите свое имя'
  } else if (values.name.length < 2) {
    errors.name = ' Имя не может быть короче 2 символов'
  }

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

  if (!values.passwordReply) {
    errors.passwordReply = 'Повторите пароль'
  } else if (values.password !== values.passwordReply) {
    errors.passwordReply = 'Пароли не совпадают'
  }

  if (!values.rules) {
    errors.rules = 'Необходимо согласиться с правилами'
  }

  return errors
}

export const Register = () => {
  const history = useHistory()
  const {register, loading} = useContext(FirebaseContext)

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordReply: '',
      rules: false,
    },
    validate,
    onSubmit: (values) => registerHandler(values)
  })

  const registerHandler = async ({ name, email, password }) => {
    try {
      await register(name, email, password)
      messageToast('Вы успешно зарегистрировались')
      history.push('/home')
    } catch (e) {
      messageToast(e.code)
      console.log(e)
    }
  }

  return (
    <>
      <Helmet>
        <title>Домашняя Бухгалтерия | Регистрация</title>
        <meta name="description" content="Домашняя бухгалтерия регистрация"/>
      </Helmet>
      <form className="card auth-card" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-content">
          <span className="card-title">Домашняя бухгалтерия</span>

          <div className="input-field">
            <input
              id="name"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.name}
              onBlur={formik.handleBlur}
              className={formik.errors.name && formik.touched.name ? 'invalid' : null}
            />
            <label htmlFor="name">Имя</label>

            {formik.errors.name && formik.touched.name ? (
              <small className="helper-text invalid">{formik.errors.name}</small>
            ) : null}
          </div>

          <div className="input-field">
            <input
              id="email"
              type="text"
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

          <div className="input-field">
            <input
              id="passwordReply"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.passwordReply}
              onBlur={formik.handleBlur}
              className={
                formik.errors.passwordReply &&
                formik.touched.passwordReply &&
                formik.values.password &&
                formik.touched.password
                  ? 'invalid'
                  : null
              }
            />
            <label htmlFor="passwordReply">Повторите пароль</label>

            {formik.errors.passwordReply &&
            formik.touched.passwordReply &&
            formik.values.password &&
            formik.touched.password ? (
              <small className="helper-text invalid">{formik.errors.passwordReply}</small>
            ) : null}
          </div>

          <p>
            <label htmlFor="rules">
              <input
                id="rules"
                type="checkbox"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.rules}
              />
              <span>С правилами согласен</span>
            </label>
          </p>
        </div>
        <div className="card-action">
          <div>
            <button className="btn waves-effect waves-light auth-submit" disabled={loading} type="submit">
              Зарегистрироваться
              <i className="material-icons right">send</i>
            </button>
          </div>

          <p className="center">
            Уже есть аккаунт? <Link to="/login">Войти!</Link>
          </p>
        </div>
      </form>
    </>
  )
}
