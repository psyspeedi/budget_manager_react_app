import React, {useContext, useEffect, useState} from 'react'
import { Navbar } from '../components/NavBar'
import { Sidebar } from '../components/SideBar'
import { AddButtonFixed } from '../components/AddButtonFixed'
import {FirebaseContext} from '../context/firebase/firebaseContext'
import {Loader} from '../UI/Loader'

export const MainLayout = ({ children }) => {
  const [sideOpen, setSideOpen] = useState(true)
  const {loading, fetchAllData} = useContext(FirebaseContext)

  useEffect(() => {
    fetchAllData()
  }, [])

  return (
    <>
      {
        loading
        ?
          <Loader/>
        :
        <div className="app-main-layout">
          <Navbar sideOpen={sideOpen} setSideOpen={setSideOpen} />

          <Sidebar sideOpen={sideOpen} />

          <main className={sideOpen ? 'app-content open' : 'app-content'}>
            <div className="app-page">{children}</div>
          </main>

          <AddButtonFixed />
        </div>
      }
    </>

  )
}
