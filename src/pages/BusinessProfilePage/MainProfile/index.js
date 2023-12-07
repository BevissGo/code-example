import React from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { Button } from 'antd'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faUser, faLocationDot, faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { MailFilled, ClockCircleFilled, InfoCircleFilled } from '@ant-design/icons'
import BusinessLogo from 'assets/images/business-logo.png'

import './style.scss'

function MainProfile({ business }) {
  const history = useHistory()

  const handleEditProfile = () => {
    history.push('profile/edit')
  }

  const { name, phone, website, email, employee_amount, location, work_day, work_hour, specialty } = business

  return (
    <div className='business-profile-page__profile'>
      <div className='business-profile-page__main-info-wrapper'>
        <img
          src={BusinessLogo}
          alt='business-logo'
          className='business-profile-page__logo'
        />
        <div className='business-profile-page__main-info'>
          <h3 className='business-profile-page__name'>{name}</h3>
          <p className='business-profile-page__phone'>{phone}</p>
          <p className='business-profile-page__website'>{website}</p>
        </div>
      </div>
      <div className='business-profile-page__detailed-info'>
        <div className='business-profile-page__email'>
          <MailFilled className='business-profile-page__email-icon' />
          <span className='business-profile-page__email-content'>{email}</span>
        </div>
        {employee_amount ? (
          <div className='business-profile-page__employee-quantity'>
            <FontAwesomeIcon icon={faUser} className='business-profile-page__employee-quantity-icon' />
            <span className='business-profile-page__employee-quantity-content'>{employee_amount} employees</span>
          </div>
        ) : (<></>)}
        {location ? (
          <div className='business-profile-page__location'>
            <FontAwesomeIcon icon={faLocationDot} className='business-profile-page__location-icon' />
            <span className='business-profile-page__location-content'>{location}</span>
          </div>
        ) : (<></>)}
        {work_day ? (
          <div className='business-profile-page__work-day'>
            <FontAwesomeIcon icon={faCalendarDays} className='business-profile-page__work-day-icon' />
            <span className='business-profile-page__work-day-content'>{work_day}</span>
          </div>
        ) : (<></>)}
        {work_hour ? (
          <div className='business-profile-page__work-time'>
            <ClockCircleFilled className='business-profile-page__work-time-icon' />
            <span className='business-profile-page__work-time-content'>{work_hour}</span>
          </div>
        ) : (<></>)}
        {specialty?.length > 0 ? (
          <div className='business-profile-page__description'>
            <InfoCircleFilled className='business-profile-page__description-icon' />
            <span className='business-profile-page__description-content'>{specialty?.join(', ')}</span>
          </div>
        ) : (<></>)}
      </div>
      <div className='business-profile-page__button-group'>
        <Button className='business-profile-page__button-edit' onClick={handleEditProfile}>
          <FontAwesomeIcon icon={faPenToSquare} className='business-profile-page__button-edit-icon' />
          Edit
        </Button>
      </div>
    </div>
  )
}

export default MainProfile
