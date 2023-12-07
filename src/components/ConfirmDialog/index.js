import './style.scss'
import { Avatar, Col, Form, Input, Modal, Row } from 'antd'
import React, { useState } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import ButtonAntd from 'components/Button/Antd'

const ConfirmDialog = ({ visible, validateString, description, subDescription, onClose }) => {
  const [inputString, setInputString] = useState('')
  return (
    <Modal
      open={visible}
      onOk={() => {
        setInputString('')
        onClose('confirm')
      }}
      onCancel={() => {
        setInputString('')
        onClose('cancel')
      }}
      centered
      footer={[
        <ButtonAntd
          key='submit'
          disabled={validateString !== inputString}
          title='Confirm'
          danger
          style={{
            backgroundColor: validateString !== inputString ? 'gray' : 'red',
          }}
          onButtonClick={() => {
            setInputString('')
            onClose('confirm')
          }}
        />,
      ]}
    >
      <Row justify='center' gutter={[0, 20]}>
        <Col span={24}>
          <Row justify='center'>
            <Avatar style={{ backgroundColor: '#ffa629' }} icon={<DeleteOutlined />} />
          </Row>
        </Col>
        <Col span={24}>
          <Row justify='center'>
            <div
              style={{
                fontWeight: 'bolder',
                fontSize: 18,
                color: '#000',
                textAlign: 'center',
                fontFamily: 'ProximaNova-Regular',
              }}
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            ></div>
          </Row>
        </Col>
        <Col span={24}>
          <Row justify='center'>
            <div style={{ fontSize: 14, color: '#000', textAlign: 'center', fontFamily: 'ProximaNova-Regular' }}>
              {subDescription ? (
                <span>{subDescription}</span>
              ) : (
                <span>Type “{validateString}” into field below to confirm.</span>
              )}
            </div>
          </Row>
        </Col>
        <Col span={24}>
          <Form>
            <Input
              className='confirm-dialog-input'
              value={inputString}
              onChange={(e) => setInputString(e.target.value)}
              placeholder={`Type "${validateString}"`}
            />
          </Form>
        </Col>
      </Row>
    </Modal>
  )
}

export default ConfirmDialog
