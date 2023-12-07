import './style.scss'
import React, { useRef, useEffect, useCallback } from 'react'
import LIST_RESULTS from 'constants/listResults'

const DropdownShareResultCampaign = ({ activeResult, contentCommon, onClose, handleChangeResult }) => {
  const node = useRef()

  useEffect(() => {
    document.addEventListener('mousedown', handleBlur)
    return () => {
      document.removeEventListener('mousedown', handleBlur)
    }
  })

  const handleBlur = useCallback((e) => node.current.contains(e.target) || onClose(), [onClose])

  return (
    <div className='dropdown-share-result-campaign' ref={node}>
      <ul className='dropdown-share-result-campaign__actions'>
        {activeResult !== LIST_RESULTS.IQ_RESULT && (
          <li onClick={handleChangeResult(LIST_RESULTS.IQ_RESULT)}>{contentCommon.iqResult}</li>
        )}
        {activeResult !== LIST_RESULTS.EQ_RESULT && (
          <li onClick={handleChangeResult(LIST_RESULTS.EQ_RESULT)}>{contentCommon.eqResult}</li>
        )}
        {activeResult !== LIST_RESULTS.DISC_RESULT && (
          <li onClick={handleChangeResult(LIST_RESULTS.DISC_RESULT)}>{contentCommon.discResult}</li>
        )}
        {activeResult !== LIST_RESULTS.BRAIN_RESULT && (
          <li onClick={handleChangeResult(LIST_RESULTS.BRAIN_RESULT)}>{contentCommon.brainResult}</li>
        )}
        {activeResult !== LIST_RESULTS.SINGLE_CHOICE_RESULT && (
          <li onClick={handleChangeResult(LIST_RESULTS.SINGLE_CHOICE_RESULT)}>{contentCommon.singleChoiceResult}</li>
        )}
      </ul>
    </div>
  )
}

export default DropdownShareResultCampaign
