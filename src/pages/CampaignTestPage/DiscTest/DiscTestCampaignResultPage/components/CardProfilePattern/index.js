import React from 'react'

import './style.scss'

const ProfileExample = ({ avatar, name, major }) => {
  return (
    <div className='profile-example'>
      <img src={avatar} alt='' />
      <p className='profile-example__name'>{name}</p>
      <p className='profile-example__major'>{major}</p>
    </div>
  )
}

export default ProfileExample
