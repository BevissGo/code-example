import React from 'react'
import { Col, Row } from 'antd'

import ResultCardHeader from './ResultCardHeader'

import './style.scss'

function ResultCard({ title, time, passResult, contents }) {
  return (
    <div className='result-card'>
      <ResultCardHeader title={title} time={time} result={passResult} />
      <Row>
        {contents.map((content, index) => (
          <Col key={index} span={index !== contents.length - 1 ? 7 : 3}>
            <p className='result-card__label'>{content.label}</p>
            <p className='result-card__value'>{content.value}</p>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default ResultCard
