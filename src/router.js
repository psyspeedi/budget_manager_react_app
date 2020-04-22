import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {EmptyLayout} from './layouts/EmptyLayouts'
import {MainLayout} from './layouts/MainLayouts'
import {Login} from './views/Login'
import {Register} from './views/Register'
import {Home} from './views/Home'
import {Categories} from './views/Categories'
import {Detail} from './views/Detail'
import {History} from './views/History'
import {Planning} from './views/Planning'
import {Profile} from './views/Profile'
import {Record} from './views/Record'

export const Router = (isAuth) => {
  if (!isAuth) {
    return (
      <EmptyLayout>
        <Switch>
          <Route path="/login">
            <Login/>
          </Route>
          <Route path="/register" exact>
            <Register/>
          </Route>
          <Redirect to='/login?message=login'/>
        </Switch>
      </EmptyLayout>
    )
  }

  return (
    <MainLayout>
      <Switch>
        <Route path="/categories" exact>
          <Categories/>
        </Route>
        <Route path="/detail/:id" exact>
          <Detail/>
        </Route>
        <Route path="/history" exact>
          <History/>
        </Route>
        <Route path="/planning" exact>
          <Planning/>
        </Route>
        <Route path="/profile" exact>
          <Profile/>
        </Route>
        <Route path="/record" exact>
          <Record/>
        </Route>
        <Route path="/home" exact>
          <Home/>
        </Route>
        <Redirect to='/home'/>
      </Switch>
    </MainLayout>
  )
}
