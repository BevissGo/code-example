import React from 'react'
import { useDispatch } from 'react-redux'
import { GoogleLogin } from '@react-oauth/google'

import { loginWithGoogle } from 'redux/services/auth'
import { toastifyNotify } from 'helpers'

import './style.scss'

const GoogleSignIn = () => {
  const dispatch = useDispatch()

  const handleCredentialResponse = (response) => {
    if (!response) {
      toastifyNotify('error', 'Login Failed')
      return
    }
    const idToken = response.credential
    if (idToken) {
      dispatch(loginWithGoogle(idToken))
    }
  }

  return (
    <GoogleLogin
      id='login-google-btn'
      theme='outline'
      size='large'
      shape='pill'
      onSuccess={(credentialResponse) => handleCredentialResponse(credentialResponse)}
      onError={() => toastifyNotify('error', 'Login Failed')}
      useOneTap
    />
  )
}

export default GoogleSignIn
