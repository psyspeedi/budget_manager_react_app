import React, {useEffect, useRef} from 'react'
import { Link } from 'react-router-dom'

export const AddButtonFixed = () => {
  const ref = useRef()

  useEffect(() => {
    const tooltip = window.M.Tooltip.init(ref.current)
    return () => {
      if (tooltip && tooltip.destroy) {
        tooltip.destroy()
      }
    }
  })

  return (
    <div ref={ref} className="fixed-action-btn tooltipped" data-position='left' data-tooltip='Добавить новую запись'>
      <Link className="btn-floating btn-large blue" to="/record">
        <i className="large material-icons">add</i>
      </Link>
    </div>
  )
}
