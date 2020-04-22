export const messageToast = (html) => {
  if (html === 'logout') {
    return window.M.toast({ html: 'Вы вышли из системы' })
  } else if (html === 'login') {
    return window.M.toast({ html: 'Для начала войдите в систему' })
  } else if (html === 'auth/user-not-found') {
    return window.M.toast({ html: 'Пользователь с таким email не найден' })
  } else if (html === 'auth/wrong-password') {
    return window.M.toast({ html: 'Неверный пароль' })
  } else if (html === 'auth/too-many-requests') {
    return window.M.toast({ html: 'Слишком много неудачных попыток входа в систему. Пожалуйста, попробуйте позже.' })
  } else {
    return window.M.toast({ html })
  }
}

