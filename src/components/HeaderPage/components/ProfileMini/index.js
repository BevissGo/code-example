import React, { useCallback } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import profileDefaultImg from 'assets/images/icons/profile.png'
import profileDefaultCompanyImg from 'assets/images/icons/company-profile.png'

import './style.scss'

const ProfileMini = ({ loading, profile, onOpenDropdown, openDropdownProfile }) => {
  const handleOpenDropdown = useCallback(() => {
    if (!loading) {
      onOpenDropdown()
    }
  }, [loading, onOpenDropdown])

  return (
    <div className={`profile-mini${openDropdownProfile ? ' opened' : ''}`}>
      <SkeletonTheme color='#f0f0f0' highlightColor='#fff'>
        <p onClick={handleOpenDropdown}>
          {!loading ? profile.name || profile.company_name || 'DiSC' : <Skeleton width={100} />}
        </p>
      </SkeletonTheme>
      <SkeletonTheme color='#f0f0f0' highlightColor='#fff'>
        {!loading ? (
          <img
            className='profile-mini__avatar'
            src={profile.avatar ? profile.avatar : profile.company_name ? profileDefaultCompanyImg : profileDefaultImg}
            alt=''
            onClick={handleOpenDropdown}
          />
        ) : (
          <Skeleton circle={true} width={58} height={58} />
        )}
      </SkeletonTheme>
    </div>
  )
}

export default ProfileMini
