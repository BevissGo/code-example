import React from 'react'
import classNames from 'classnames'

import './styles.scss'

function CreateTestCard({ label, danger, warning, primary, success, onClick }) {
  return (
    <div className='section-call-test-v2__create-test-card'>
      <p className='section-call-test-v2__create-test-card__title'>{label}</p>
      <button onClick={onClick} className={classNames([{ danger, warning, primary, success }])}>
        Làm ngay
      </button>
    </div>
  )
}

export default CreateTestCard
