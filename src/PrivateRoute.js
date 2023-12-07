import React from 'react'
import { Route, Redirect, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { loginWithToken } from 'redux/services/auth'

import { getValueFromStorage } from 'utils'

const PrivateRoute = ({ component: Component, ...rest }) => {
  const location = useLocation()
  const dispatch = useDispatch()

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const isBusinessAuthenticated = useSelector((state) => state.auth.isBusinessAuthenticated)

  if (isBusinessAuthenticated) {
    return <Redirect to={(location.state && location.state.from.pathname) || '/business'} />
  }

  const queryString = new URLSearchParams(location.search)

  const anonymousToken = queryString.get('token')

  if (anonymousToken) {
    dispatch(loginWithToken(anonymousToken))

    if (getValueFromStorage('access-token')) {
      return <Redirect to={'/result'} />
    }
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  )
}

export default PrivateRoute
