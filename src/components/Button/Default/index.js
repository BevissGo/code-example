import React from 'react'

import IconLoading from 'assets/images/icons/loading.svg'

import './style.scss'

const ButtonDefault = ({ sign, type, icon, label, fluid, loading, isDisabled, extraClassName, onClick }) => {
  const generateClassNameButton = () => {
    return `button-default${loading ? ' loading' : ''}${sign ? ' sign' : ''}${icon ? ' icon' : ''}${
      fluid ? ' fluid' : ''
    } ${extraClassName || ''}`
  }

  return (
    <button
      loading={loading}
      type={type}
      disabled={loading || isDisabled}
      className={generateClassNameButton()}
      onClick={onClick}
    >
      {icon && <img src={icon} alt='' />}
      <span>{label}</span>
      {loading && <img src={IconLoading} alt='' />}
    </button>
  )
}

export default ButtonDefault
