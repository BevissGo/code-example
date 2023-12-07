import React from 'react'
import { Input } from 'reactstrap'

import ButtonDefault from 'components/Button/Default'

import './style.scss'

const AddFacebookProfile = ({ onBlur, loading, onClick }) => {
  return (
    <div className='fb-profile-step'>
      <div className='fb-profile-step__input'>
        <Input type='text' onBlur={onBlur} />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '15px 30px 15px 30px',
        }}
      >
        <ButtonDefault
          label='Cập nhật'
          extraClassName=''
          loading={loading}
          onClick={onClick}
        />
      </div>
    </div>
  )
}

export default AddFacebookProfile