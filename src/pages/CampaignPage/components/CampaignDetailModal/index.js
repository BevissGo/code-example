import React, { useState, useEffect, useCallback } from 'react'
import { Spin } from 'antd'

import CustomModal from 'components/CustomModal'
import { checkCampaignStatus } from 'pages/CampaignPage/helpers'
import { campaignStatus } from 'pages/CampaignPage/utils'

import CampaignCandidateList from './CampaignCandidateList'
import CampaignPositionDetail from './CampaignPositionDetail'
import FooterCampaignDetailModal from './FooterCampaignDetailModal'
import HeaderCampaignDetailModal from './HeaderCampaignDetailModal'
import CampaignInformationDetail from './CampaignInformationDetail'

import './style.scss'

function CampaignDetailModal({
  record,
  cancelCampaignLoading,
  isOpen,
  setSelectedRecord,
  setIsShowConfirmModal,
  handleCloseModal,
  handleDelete,
  handleEditCampaign,
}) {
  const campaignId = record?.Id
  const status = record?.cancelled
    ? campaignStatus['cancelled']
    : campaignStatus[checkCampaignStatus(record?.startDate, record?.endDate)]

  const [selectedPosition, setSelectedPosition] = useState()
  const [breadcrumbItems, setBreadcrumbItems] = useState([])

  const handleClickCampaignName = useCallback(() => {
    setBreadcrumbItems((oldBreadcrumbItems) => {
      if (oldBreadcrumbItems.length > 1) {
        return oldBreadcrumbItems.slice(0, -1)
      }

      return oldBreadcrumbItems
    })

    setSelectedPosition(undefined)
  }, [])

  useEffect(() => {
    if (record && isOpen) {
      setBreadcrumbItems((oldBreadcrumbItems) => [
        ...oldBreadcrumbItems,
        {
          title: (
            <span style={{ cursor: 'pointer' }} onClick={handleClickCampaignName}>
              {record.campaignName}
            </span>
          ),
        },
      ])
    }
  }, [record, handleClickCampaignName, isOpen])

  useEffect(() => {
    if (selectedPosition && isOpen) {
      setBreadcrumbItems((oldBreadcrumbItems) => [
        ...oldBreadcrumbItems,
        { title: <span>{selectedPosition.positionId.name}</span> },
      ])
    }
  }, [isOpen, selectedPosition])

  const handleCancelCampaign = () => {
    setIsShowConfirmModal(true)
  }

  return (
    <CustomModal
      title={<HeaderCampaignDetailModal breadcrumbItems={breadcrumbItems} status={status} record={record} />}
      isOpen={isOpen}
      handleCloseModal={() => {
        handleCloseModal()
        setSelectedRecord(undefined)
        setSelectedPosition(undefined)
        setBreadcrumbItems([])
      }}
    >
      <Spin spinning={cancelCampaignLoading}>
        <CampaignInformationDetail campaignData={record ?? {}} />

        <div className='campaign-detail-modal__body'>
          {selectedPosition ? (
            <CampaignCandidateList campaignId={campaignId} positionId={selectedPosition.positionId.Id} />
          ) : (
            <CampaignPositionDetail
              campaignPositionData={record?.positions}
              campaignId={campaignId}
              setSelectedPosition={setSelectedPosition}
            />
          )}
        </div>

        <FooterCampaignDetailModal
          record={record}
          status={status}
          setSelectedRecord={setSelectedRecord}
          handleCancelCampaign={handleCancelCampaign}
          handleEditCampaign={handleEditCampaign}
          handleDelete={handleDelete}
        />
      </Spin>
    </CustomModal>
  )
}

export default CampaignDetailModal
