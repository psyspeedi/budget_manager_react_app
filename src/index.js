import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import 'materialize-css/dist/js/materialize.min.js'
import App from './App'
import * as serviceWorker from './serviceWorker'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
})

let app

firebase.auth().onAuthStateChanged((user) => {
  if (!app) {
    app = ReactDOM.render(
      <React.StrictMode>
        <App user={user}/>
      </React.StrictMode>,
      document.getElementById('root'),
    )
  }
})


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
