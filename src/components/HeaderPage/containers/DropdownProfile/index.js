import React, { useRef, useEffect, useCallback } from 'react'
// import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { redirectToWithPush } from 'utils'
// import { USER_TYPE } from 'constants/userType'

import './style.scss'

const DropdownProfile = ({ onClose, onSignout, contentCommon }) => {
  const node = useRef()
  const history = useHistory()
  // const userInfo = useSelector((state) => state.profile.profile)

  useEffect(() => {
    document.addEventListener('mousedown', handleBlur)
    return () => {
      document.removeEventListener('mousedown', handleBlur)
    }
  })

  const handleBlur = useCallback(
    (e) => {
      if (!node.current.contains(e.target)) {
        onClose()
      }
    },
    [onClose],
  )

  const handleRedirect = useCallback(
    (val) => () => {
      redirectToWithPush(history, val)
    },
    [history],
  )

  return (
    <div className='dropdown-profile' ref={node}>
      <ul className='dropdown-profile__actions'>
        <li onClick={handleRedirect('/my-profile')}>{contentCommon.navbar.profile}</li>
        <li onClick={handleRedirect('/my-disc-result')}>{contentCommon.navbar.result}</li>
        {/* {userInfo.type_user === USER_TYPE.GUESS && (
          <li onClick={handleRedirect('/payment')}>
            {contentCommon.navbar.payment}
          </li>
        )} */}
      </ul>
      <div className='dropdown-profile__logout'>
        <p onClick={onSignout}>{contentCommon.logOut}</p>
      </div>
    </div>
  )
}

export default DropdownProfile
