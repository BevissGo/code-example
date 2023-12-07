import React from 'react'
import { Button, Modal } from 'antd'

import './style.scss'

function WarningUsingModal({ isOpen, type, campaignsUsing, handleCloseWarningModal }) {
  return (
    <Modal
      open={isOpen}
      title='Warning'
      centered
      closable={false}
      footer={
        <Button key='submit' type='primary' onClick={handleCloseWarningModal}>
          OK
        </Button>
      }
    >
      <p className='warning-using-modal'>
        This {type} is using in campaigns
        <b>{` ${[...campaignsUsing].join(', ')}`}</b>. Please delete campaign which using this {type} to delete it
      </p>
    </Modal>
  )
}

export default WarningUsingModal
