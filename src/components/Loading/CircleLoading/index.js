import React from 'react'

import IconLoading from 'assets/images/icons/loading.svg'

import './style.scss'

const CircleLoading = () => {
  return (
    <div className='circle-loading'>
      <img src={IconLoading} alt='icon loading' />
    </div>
  )
}

export default CircleLoading
