import React, { useRef, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import { redirectToWithPush } from 'utils'
import LIST_RESULTS from 'constants/listResults'

import './style.scss'

const DropdownResult = ({ onClose, contentCommon, activeResult }) => {
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
    <div className='dropdown-result' ref={node}>
      <ul className='dropdown-result__actions'>
        {activeResult !== LIST_RESULTS.DISC_RESULT && (
          <li onClick={handleRedirect('/my-disc-result')}>
            {contentCommon.discResult}
          </li>
        )}
        {activeResult !== LIST_RESULTS.IQ_RESULT && (
          <li onClick={handleRedirect('/my-iq-result')}>
            {contentCommon.iqResult}
          </li>
        )}
        {activeResult !== LIST_RESULTS.BRAIN_RESULT && (
          <li onClick={handleRedirect('/my-brain-result')}>
            {contentCommon.brainResult}
          </li>
        )}
        {activeResult !== LIST_RESULTS.EQ_RESULT && (
          <li onClick={handleRedirect('/my-eq-result')}>
            {contentCommon.eqResult}
          </li>
        )}
      </ul>
    </div>
  )
}

export default DropdownResult
