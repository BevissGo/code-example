import React from 'react'

import ButtonDefault from 'components/Button/Default'

import './style.scss'

const UpdateProfileModal = ({ show, loading, onBlur, onClick }) => {
  return (
    show && (
      <div className='modal'>
        <div className='modal-wrap'>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
            className='modal__content-container'
          >
            <p
              style={{
                alignSelf: 'start',
              }}
              className='modal__content-main'
            >
              Bạn vui lòng cập nhật liên kết Facebook cá nhân nhé
            </p>
            <input className='modal__input' type='text' onBlur={onBlur} />
          </div>
          <div
            className='modal__btn-group'
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '15px 30px 15px 30px',
            }}
          >
            <ButtonDefault
              label='Cập nhật'
              loading={loading}
              extraClassName='modal__btn modal__btn-option modal__btn-continue btn-update-profile'
              onClick={onClick}
            />
          </div>
        </div>
      </div>
    )
  )
}

export default UpdateProfileModal
