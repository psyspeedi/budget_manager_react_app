import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Router } from './router'
import {FirebaseState} from './context/firebase/firebaseState'
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'
import './assets/index.css'
import './App.css'
import {DatePickerState} from './context/datePicker/datePickerState'
import { HelmetProvider } from 'react-helmet-async'


function App({user}) {
  const isAuth = !!user
  const routes = Router(isAuth)
  return (
    <HelmetProvider>
      <FirebaseState>
        <DatePickerState>
          <BrowserRouter>
            <div className="App">
              {routes}
            </div>
          </BrowserRouter>
        </DatePickerState>
      </FirebaseState>
    </HelmetProvider>
  )
}

export default App
