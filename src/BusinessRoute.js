import React from 'react'
import { Route, Redirect, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const BusinessRoute = ({ component: Component, ...rest }) => {
  const location = useLocation()

  const isBusinessAuthenticated = useSelector((state) => state.auth.isBusinessAuthenticated)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  if (isAuthenticated) {
    return (
      <Redirect to={(location.state && location.state.from.pathname) || '/'} />
    )
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isBusinessAuthenticated ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{ pathname: '/business/sign-in', state: { from: props.location } }}
            />
          )
      }
    />
  )
}

export default BusinessRoute
