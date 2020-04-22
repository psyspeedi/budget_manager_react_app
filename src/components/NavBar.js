import React, { useContext, useEffect, useRef} from 'react'
import { useHistory, Link } from 'react-router-dom'
import { messageToast } from '../utils/message.plugin'
import Moment from 'react-moment'
import 'moment/locale/ru'
import {FirebaseContext} from '../context/firebase/firebaseContext'

export const Navbar = ({ sideOpen, setSideOpen }) => {
  const history = useHistory()
  const ref = useRef()
  const {logout, info} = useContext(FirebaseContext)

  useEffect(() => {
    const initMaterialize = window.M.Dropdown.init(ref.current)
    return () => {
      if (initMaterialize && initMaterialize.destroy) {
        initMaterialize.destroy()
      }
    }
  }, [ref])

  const toggleSideNav = (e) => {
    e.preventDefault()
    setSideOpen(!sideOpen)
  }

  const logoutHandler = async (e) => {
    e.preventDefault()
    try {
      history.push('/login?message=logout')
      await logout()
    } catch (e) {
      console.log(e)
      messageToast(e.code)
    }
  }

  return (
    <nav className="navbar orange lighten-1">
      <div className="nav-wrapper">
        <div className="navbar-left">
          <a href="#" onClick={(e) => toggleSideNav(e)}>
            {!sideOpen ? (
              <i className="material-icons black-text">dehaze</i>
            ) : (
              <i className="material-icons black-text">close</i>
            )}
          </a>
          <Moment locale="ru" className="black-text" format="LLLL" interval={1000}></Moment>
        </div>

        <ul className="right hide-on-small-and-down">
          <li>
            <a ref={ref} className="dropdown-trigger black-text" href="#" data-target="dropdown">
              {info.name}
              <i className="material-icons right">arrow_drop_down</i>
            </a>

            <ul id="dropdown" className="dropdown-content">
              <li>
                <Link to="/profile" className="black-text">
                  <i className="material-icons">account_circle</i>Профиль
                </Link>
              </li>
              <li className="divider" tabIndex="-1"></li>
              <li>
                <a href="#" onClick={(e) => logoutHandler(e)} className="black-text">
                  <i className="material-icons">assignment_return</i>Выйти
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  )
}
