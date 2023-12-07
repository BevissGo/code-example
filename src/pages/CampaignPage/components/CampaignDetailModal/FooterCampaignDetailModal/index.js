import React from 'react'
import { Col, Row } from 'antd'
import { CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ButtonAntd from 'components/Button/Antd'

import './style.scss'

function FooterCampaignDetailModal({
  record,
  status,
  setSelectedRecord,
  handleCancelCampaign,
  handleEditCampaign,
  handleDelete,
}) {
  return (
    <Row className='footer-campaign-detail-modal' justify={'center'} gutter={[20, 12]}>
      <Col span={8}>
        {!['CANCELLED', 'EXPIRED'].includes(status.title) && (
          <ButtonAntd
            title='Cancel'
            icon={<CloseOutlined style={{ color: '#fff' }} />}
            style={{
              width: '100%',
            }}
            onButtonClick={handleCancelCampaign}
          />
        )}
      </Col>
      <Col span={8}>
        {status.title !== 'CANCELLED' && (
          <ButtonAntd
            title='Edit'
            textColor='#000'
            icon={<EditOutlined style={{ color: '#000' }} />}
            ghost
            style={{
              width: '100%',
              borderColor: 'black',
            }}
            onButtonClick={() => {
              setSelectedRecord({ record, status })
              handleEditCampaign()
            }}
          />
        )}
      </Col>
      <Col span={8}>
        <ButtonAntd
          title='Delete'
          icon={<DeleteOutlined style={{ color: '#fff' }} />}
          style={{
            width: '100%',
            backgroundColor: '#b32a2a',
            borderColor: '#b32a2a',
          }}
          onButtonClick={() => handleDelete(record)}
        />
      </Col>
    </Row>
  )
}

export default FooterCampaignDetailModal
