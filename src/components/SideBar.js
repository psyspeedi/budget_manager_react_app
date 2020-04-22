import React from 'react'
import { NavLink } from 'react-router-dom'

export const Sidebar = ({ sideOpen }) => {
  const links = [
    {
      to: '/home',
      title: 'Счет',
    },
    {
      to: '/history',
      title: 'История',
    },
    {
      to: '/planning',
      title: 'Планирование',
    },
    {
      to: '/record',
      title: 'Новая запись',
    },
    {
      to: '/categories',
      title: 'Категории',
    },
  ]

  return (
    <ul className={sideOpen ? 'open sidenav app-sidenav' : 'sidenav app-sidenav'}>
      {links.map((link) => (
        <li key={link.title}>
          <NavLink
            to={link.to}
            activeClassName="active"
            className="waves-effect waves-orange pointer"
          >
            {link.title}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}
