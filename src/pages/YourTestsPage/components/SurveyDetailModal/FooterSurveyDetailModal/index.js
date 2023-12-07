import React from 'react'
import { Col, Row } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ButtonAntd from 'components/Button/Antd'

import './style.scss'

function FooterSurveyDetailModal({ handleEditSurvey, handleDeleteSurvey }) {
  return (
    <Row className='footer-survey-detail-modal' justify={'center'} gutter={[20, 12]}>
      <Col span={12}>
        <ButtonAntd
          title='Edit'
          textColor='#000'
          icon={<EditOutlined style={{ color: '#000' }} />}
          ghost
          style={{
            width: '100%',
            borderColor: 'black',
          }}
          onButtonClick={handleEditSurvey}
        />
      </Col>
      <Col span={12}>
        <ButtonAntd
          title='Delete'
          icon={<DeleteOutlined style={{ color: '#fff' }} />}
          style={{
            width: '100%',
            backgroundColor: '#b32a2a',
            borderColor: '#b32a2a',
          }}
          onButtonClick={handleDeleteSurvey}
        />
      </Col>
    </Row>
  )
}

export default FooterSurveyDetailModal
