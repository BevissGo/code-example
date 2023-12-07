import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DeleteOutlined, EditOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons'
import { Col, Form, Space, Spin } from 'antd'

import i18nVN from 'i18n/locales/vn'
import ButtonAntd from 'components/Button/Antd'
import CustomTable from 'components/CustomTable'
import ConfirmDialog from 'components/ConfirmDialog'
import ConfirmationModal from 'components/Modal/ConfirmModal'
import BorderlessDropdown from 'components/Dropdown/BorderlessDropdown'
import TutorialTour from 'containers/Tour/Tutorial'
import DashboardBar from 'pages/DashBoard/containers/DashboardBar'
import { cancelCampaign, deleteCampaign, fetchCampaignList } from 'api/business/campaign.api'
import { GET_CAMPAIGN_LIST } from 'api/req'
import { toastifyNotify } from 'helpers'
import { formatDate } from 'utils/formatDate'

import CampaignDetailModal from './components/CampaignDetailModal'
import CampaignActionModal from './components/CampaignActionModal'
import { checkCampaignStatus } from './helpers'
import { campaignStatus } from './utils'

import './style.scss'

const CampaignPage = ({ campaignRef, candidateRef }) => {
  const { campaign: contentPage } = i18nVN.src.pages.business.dashboard

  const columns = [
    {
      title: 'No.',
      render: (_text, _record, index) => <span>{index + 1}</span>,
    },
    {
      title: 'Campaign Name',
      dataIndex: 'campaignName',
      render: (campaignName) => <span className='campaign-page__column-content--bold'>{campaignName ?? '--'}</span>,
    },
    {
      title: 'Recruiter',
      dataIndex: 'recruiter',
      render: (recruiter) => <span>{recruiter ?? '--'}</span>,
    },
    {
      title: 'Position',
      dataIndex: 'positions',
      render: (positions) => <span> {positions.length}</span>,
    },
    {
      title: 'Test',
      dataIndex: 'positions',
      render: (positions) => (
        <span>
          {positions.reduce((accumulator, position) => {
            return accumulator + position.categoryTest.length + position.testList.length
          }, 0)}
        </span>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'positions',
      render: (positions) => {
        return (
          <span>
            {positions.length ? positions.reduce((acc, cur) => parseInt(acc) + parseInt(cur?.amount), 0) : '--'}
          </span>
        )
      },
    },
    {
      title: 'Range',
      dataIndex: 'range',
      render: (range) => <span>{range === 'global' ? 'Global' : 'Local'}</span>,
    },
    {
      title: 'Start',
      dataIndex: 'startDate',
      render: (startDate) => <span>{formatDate(startDate)}</span>,
    },
    {
      title: 'End',
      dataIndex: 'endDate',
      render: (endDate) => <span>{formatDate(endDate)}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_status, record) => {
        const status = record.cancelled
          ? campaignStatus['cancelled']
          : campaignStatus[checkCampaignStatus(record?.startDate, record?.endDate)]

        return (
          <span
            style={{ color: status?.color, background: status?.background }}
            className='campaign-page__column-status'
          >
            {status?.title ?? '--'}
          </span>
        )
      },
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'operation',
      onCell: () => {
        return {
          onClick: (e) => {
            e.stopPropagation()
          },
        }
      },
      render: (_, record) => {
        const status = record.cancelled
          ? campaignStatus['cancelled']
          : campaignStatus[checkCampaignStatus(record?.startDate, record?.endDate)]

        return (
          <Space size='small'>
            <BorderlessDropdown
              menuItems={[
                status.title !== 'CANCELLED' && {
                  label: (
                    <Space>
                      <EditOutlined />
                      <span className='campaign-page__dropdown-title'>Edit</span>
                    </Space>
                  ),
                  key: 'edit',
                  onClick: () => {
                    setSelectedRecord({ record, status })
                    handleEditCampaign()
                  },
                },
                !['CANCELLED', 'EXPIRED'].includes(status.title) && {
                  label: (
                    <Space>
                      <StopOutlined />
                      <span className='campaign-page__dropdown-title'>Cancel</span>
                    </Space>
                  ),
                  key: 'cancel',
                  onClick: () => {
                    setSelectedRecord(record)
                    setIsShowConfirmModal(true)
                  },
                },
                {
                  label: (
                    <Space>
                      <DeleteOutlined />
                      <span className='campaign-page__dropdown-title'>Delete</span>
                    </Space>
                  ),
                  key: 'delete',
                  onClick: () => handleDelete(record),
                },
              ]}
              title='Action'
            />
          </Space>
        )
      },
    },
  ]

  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false)
  const [isShowActionModal, setIsShowActionModal] = useState(false)
  const [isShowDetailModal, setIsShowDetailModal] = useState(false)
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  const { data: campaignList, isFetching: campaignListFetching } = useQuery(
    [GET_CAMPAIGN_LIST],
    () => fetchCampaignList(),
    {
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to fetch campaign list.')
      },
      initialData: [],
    },
  )

  const { mutate: deleteCampaignMutate, isLoading: deleteCampaignLoading } = useMutation(
    () => deleteCampaign(selectedRecord.Id),
    {
      onSuccess: () => {
        toastifyNotify('success', 'Delete campaign successfully.')
        setIsShowDeleteDialog(false)

        queryClient.setQueryData(
          [GET_CAMPAIGN_LIST],
          campaignList.filter((campaign) => {
            return campaign.Id !== selectedRecord.Id
          }),
        )
      },
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to delete campaign.')
      },
    },
  )

  const { mutate: cancelCampaignMutate, isLoading: cancelCampaignLoading } = useMutation(
    () => cancelCampaign(selectedRecord.Id),
    {
      onSuccess: (data) => {
        toastifyNotify('success', 'Cancel campaign successfully.')

        queryClient.setQueryData([GET_CAMPAIGN_LIST], (campaignList) => {
          const newCampaignList = [...campaignList]
          const updateIndex = newCampaignList.findIndex((e) => e.Id === selectedRecord.Id)

          newCampaignList[updateIndex] = data

          return newCampaignList
        })

        setIsShowDetailModal(false)
      },
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to cancel campaign.')
      },
    },
  )

  const handleConfirmCancel = () => {
    cancelCampaignMutate(selectedRecord.Id)
    setIsShowConfirmModal(false)
  }

  const handleCloseActionModal = () => {
    setIsShowActionModal(false)
  }

  const handleCloseDetailModal = () => {
    setIsShowDetailModal(false)
  }

  const handleCreateCampaign = () => {
    setSelectedRecord(null)
    setIsShowActionModal(true)
  }

  const handleEditCampaign = () => {
    setIsShowDetailModal(false)
    setIsShowActionModal(true)
  }

  const handleDeleteCampaign = () => {
    deleteCampaignMutate()
  }

  const handleRowClick = (record) => {
    setSelectedRecord(record)
    setIsShowDetailModal(true)
  }

  const handleDelete = (record) => {
    setSelectedRecord(record)
    setIsShowDeleteDialog(true)
  }

  return (
    <Spin spinning={campaignListFetching || deleteCampaignLoading || cancelCampaignLoading}>
      <Col className='campaign-page'>
        <DashboardBar
          title={contentPage.title}
          rightItem={
            <ButtonAntd
              title={'Create Campaign'}
              icon={<PlusOutlined style={{ fontSize: '14px', color: 'white' }} theme='outlined' />}
              onButtonClick={handleCreateCampaign}
            />
          }
        />

        <div className='campaign-page__wrapper'>
          <CustomTable
            rowKey={(record) => record.Id}
            columns={columns}
            dataSource={campaignList}
            handleRowClick={handleRowClick}
          />
        </div>

        <CampaignActionModal
          candidateRef={candidateRef}
          form={form}
          campaignList={campaignList}
          isShowActionModal={isShowActionModal}
          setIsShowActionModal={setIsShowActionModal}
          selectedRecord={selectedRecord}
          handleCloseModal={handleCloseActionModal}
        />

        <CampaignDetailModal
          record={selectedRecord}
          cancelCampaignLoading={cancelCampaignLoading}
          isOpen={isShowDetailModal}
          setSelectedRecord={setSelectedRecord}
          setIsShowDetailModal={setIsShowDetailModal}
          handleCloseModal={handleCloseDetailModal}
          handleDelete={handleDelete}
          handleEditCampaign={handleEditCampaign}
        />

        <ConfirmDialog
          validateString='YES'
          description={'Are you sure you want to delete this campaign?<br>This will lose all results in this campaign!'}
          visible={isShowDeleteDialog}
          onClose={(e) => {
            setIsShowDeleteDialog(false)
            if (e === 'confirm') {
              setIsShowDetailModal(false)
              handleDeleteCampaign()
            }
          }}
        />

        <ConfirmationModal
          centered
          visible={isShowConfirmModal}
          okText='Yes'
          cancelText='No'
          onOK={handleConfirmCancel}
          loadingOkBtn={cancelCampaignLoading}
          onCancel={() => setIsShowConfirmModal(false)}
        >
          Test links of this campaign will be disabled immediately. Are you sure you want to cancel?
        </ConfirmationModal>

        <TutorialTour
          steps={[
            {
              title: 'Campaign',
              description: 'One campaign can be used to recruit several different positions.',
              placement: 'right',
              target: () => campaignRef.current,
            },
            {
              title: 'Candidates',
              description: (
                <p>
                  <b>Click here</b> to view test-taker list
                </p>
              ),
              placement: 'right',
              target: () => campaignRef.current,
            },
          ]}
        />
      </Col>
    </Spin>
  )
}

export default CampaignPage
