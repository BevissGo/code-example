import React from 'react'
import { isNil } from 'lodash'
import { Row } from 'antd'

import './style.scss'

function ResultPassAndFail({ isPass }) {
  if (isNil(isPass)) {
    return '--'
  }

  return (
    <Row>
      {isPass ? (
        <span className='result-pass-and-fail--pass'>Passed</span>
      ) : (
        <span className='result-pass-and-fail--fail'>Failed</span>
      )}
    </Row>
  )
}

export default ResultPassAndFail
