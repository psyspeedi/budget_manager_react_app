import React, {useContext, useEffect, useState} from 'react'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { formatDate, parseDate } from 'react-day-picker/moment'
import MomentLocaleUtils from 'react-day-picker/moment'
import 'moment/locale/ru'
import 'react-day-picker/lib/style.css'
import {DatePickerContext} from '../context/datePicker/datePickerContext'

export const DatePicker = () => {
  const {setRageDateFrom, setRageDateTo, rageDateFrom, rageDateTo} = useContext(DatePickerContext)
  const [modifiers, setModifiers] = useState({})

  useEffect(() => {
    setModifiers({start: rageDateFrom, end: rageDateTo})
  }, [rageDateFrom, rageDateTo])

  return (
    <div className="InputFromTo">
      <DayPickerInput
        value={rageDateFrom}
        placeholder="Начиная"
        format="LL"
        formatDate={formatDate}
        parseDate={parseDate}
        dayPickerProps={{
          selectedDays: rageDateFrom?.toJSON() !== rageDateTo?.toJSON() ? [rageDateFrom, {after: rageDateFrom, before: rageDateTo}, rageDateTo] : null,
          disabledDays: { after: rageDateTo },
          toMonth: rageDateTo,
          modifiers,
          numberOfMonths: 2,
          localeUtils: MomentLocaleUtils,
          locale: 'ru',
        }}
        onDayChange={(day) => setRageDateFrom(day)}
      />{' '}
      —{' '}
      <span className="InputFromTo-to">
        <DayPickerInput
          value={rageDateTo}
          placeholder="Заканчивая"
          format="LL"
          formatDate={formatDate}
          parseDate={parseDate}
          dayPickerProps={{
            selectedDays: rageDateFrom?.toJSON() !== rageDateTo?.toJSON() ? [rageDateFrom, {after: rageDateFrom, before: rageDateTo}, rageDateTo] : null,
            disabledDays: { before: rageDateFrom },
            modifiers,
            month: rageDateFrom,
            fromMonth: rageDateFrom,
            numberOfMonths: 2,
            localeUtils: MomentLocaleUtils,
            locale: 'ru'
          }}
          onDayChange={(day) => setRageDateTo(day)}
        />
      </span>

    </div>
  )
}