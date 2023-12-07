import React, { useRef, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import { redirectToWithPush } from 'utils'

import './style.scss'

const DropdownTest = ({ onClose, contentCommon }) => {
  const node = useRef()
  const history = useHistory()

  useEffect(() => {
    document.addEventListener('mousedown', handleBlur)
    return () => {
      document.removeEventListener('mousedown', handleBlur)
    }
  })

  const handleBlur = useCallback(
    (e) => node.current.contains(e.target) || onClose(),
    [onClose]
  )

  const handleRedirect = useCallback(
    (val) => () => {
      redirectToWithPush(history, val)
    },
    [history]
  )

  return (
    <div className='dropdown-test' ref={node}>
      <ul className='dropdown-test__actions'>
        <li onClick={handleRedirect('/survey')}>{contentCommon.navbar.disc}</li>
        <li onClick={handleRedirect('/iq-test')}>
          {contentCommon.navbar.testIQ}
        </li>
        <li onClick={handleRedirect('/left-right-brain-test')}>
          {contentCommon.navbar.testLeftRightBrain}
        </li>
        <li onClick={handleRedirect('/eq-test')}>
          {contentCommon.navbar.testEQ}
        </li>
      </ul>
    </div>
  )
}

export default DropdownTest
