import React from 'react'
import { Col, Row } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ButtonAntd from 'components/Button/Antd'

import './style.scss'

function FooterTestDetailModal({ handleEditTest, handleDeleteTest }) {
  return (
    <Row className='footer-test-detail-modal' justify={'center'} gutter={[20, 12]}>
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
          onButtonClick={handleEditTest}
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
          onButtonClick={handleDeleteTest}
        />
      </Col>
    </Row>
  )
}

export default FooterTestDetailModal
