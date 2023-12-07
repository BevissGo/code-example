import React from 'react'
import { Col, Row } from 'antd'

import './style.scss'

function ResultCardHeader({ title, time, result }) {
  return (
    <Row className='result-card-header' justify='space-between' align='middle'>
      <Col>
        <p className='result-card-header__title'>{title}</p>
        <p className='result-card-header__time'>{time}</p>
      </Col>
      <Col>{result}</Col>
    </Row>
  )
}

export default ResultCardHeader
