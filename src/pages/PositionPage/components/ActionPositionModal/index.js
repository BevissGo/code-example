import React, { useEffect } from 'react'
import { Col, Form, Input, Modal } from 'antd'

import { regexCharVie } from 'constants/position'

import './style.scss'

const { TextArea } = Input

function ActionPositionModal({ title, okText, isOpen, selectedRecord, form, handleSubmitForm, handleCancelModal }) {
  useEffect(() => {
    form.setFieldsValue({
      name: selectedRecord?.position,
      description: selectedRecord?.description,
    })
  }, [form, selectedRecord])

  return (
    <Modal
      className='action-position-modal'
      title={<p className='action-position-modal__title'>{title}</p>}
      width='70%'
      open={isOpen}
      centered
      okText={okText}
      okButtonProps={{ style: { fontWeight: 700 }, htmlType: 'submit' }}
      onOk={form.submit}
      cancelButtonProps={{ style: { display: 'none' } }}
      onCancel={handleCancelModal}
    >
      <Form
        form={form}
        scrollToFirstError={{
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        }}
        onFinish={handleSubmitForm}
      >
        <Col>
          <Form.Item
            name='name'
            label={<p className='action-position-modal__label'>Job title</p>}
            colon={false}
            rules={[
              {
                required: true,
                message: 'Không được có ký tự đặc biệt',
                pattern: regexCharVie,
              },
            ]}
          >
            <Input bordered={false} placeholder='Please fill in...' />
          </Form.Item>
          <Form.Item
            name='description'
            label={<p className='action-position-modal__label'>Description</p>}
            colon={false}
            style={{ marginTop: 40 }}
          >
            <TextArea
              style={{ resize: 'none' }}
              rows={5}
              bordered={false}
              showCount={true}
              maxLength={400}
              placeholder='Please fill in...'
            />
          </Form.Item>
        </Col>
      </Form>
    </Modal>
  )
}

export default ActionPositionModal
