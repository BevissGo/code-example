import React from 'react'

import iconLoading from 'assets/images/icons/loading.svg'

import './style.scss'

const LoadingContainer = () => {
  return (
    <div className='loading-container'>
      <img src={iconLoading} alt='' />
    </div>
  )
}

export default LoadingContainer
