import React from 'react'

import iconLoading from 'assets/images/icons/loading.svg'
import arrowWhite from 'assets/images/icons/left-arrow--white.svg'
import arrowBlueblack from 'assets/images/icons/left-arrow--blueblack.svg'

import './style.scss'

const ButtonArrow = ({ type, label, survey, signUp, loading, disabled, transparent, businessSignUp, onClick }) => {
  const generateClassNameButton = () => {
    return `button-arrow
      ${survey ? ' survey' : ''}
      ${signUp ? ' signUp' : ''}
      ${transparent ? ' transparent' : ''}
      ${businessSignUp ? ' businessSignUp' : ''}
    `
  }
  return (
    <button loading={loading} type={type} disabled={disabled} className={generateClassNameButton()} onClick={onClick}>
      {transparent && (
        <span className='arrow left'>
          <img src={arrowBlueblack} alt='' />
        </span>
      )}
      <span className='button-arrow__name'>{label}</span>
      {!transparent && !loading && (
        <span className='arrow right'>
          <img src={arrowWhite} alt='' />
        </span>
      )}
      {loading && <img src={iconLoading} className='icon-loading' alt='' />}
    </button>
  )
}

export default ButtonArrow
