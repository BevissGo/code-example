import React, { useEffect, useRef, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Form, Space, Spin } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import i18nVN from 'i18n/locales/vn'
import { toastifyNotify } from 'helpers'
import { formatDate } from 'utils/formatDate'
import DashboardBar from 'pages/DashBoard/containers/DashboardBar'
import { countCandidatesInPosition } from 'api/business/userPositionCampaign.api'
import { fetchCampaignByPositionId } from 'api/business/campaign.api'
import {
  createPositionCampaign,
  deletePositionCampaign,
  getAllPositions,
  updatePositionCampaign,
} from 'api/business/position.api'
import ButtonAntd from 'components/Button/Antd'
import CustomTable from 'components/CustomTable'
import EditIconButton from 'components/EditIconButton'
import DeleteIconButton from 'components/DeleteIconButton'
import WarningUsingModal from 'components/WarningUsingModal'
import ConfirmationModal from 'components/Modal/ConfirmModal'
import TutorialTour from 'containers/Tour/Tutorial'

import DetailModal from './components/DetailModal'
import ActionPositionModal from './components/ActionPositionModal'
import { ACTION_TYPE } from './constants'

import './style.scss'

const PositionPage = () => {
  const {
    pages: {
      business: {
        dashboard: { positionRecruitment: contentPage },
      },
    },
  } = i18nVN.src

  const queryClient = useQueryClient()
  const [form] = Form.useForm()

  const [data, setData] = useState([])
  const [campaignsUsingPosition, setCampaignsUsingPosition] = useState([])
  const [selectedRecord, setSelectedRecord] = useState()
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false)
  const [isShowWarningModal, setIsShowWarningModal] = useState(false)
  const [isShowActionModal, setIsShowActionModal] = useState(false)
  const [isShowDetailModal, setIsShowDetailModal] = useState(false)
  const [actionType, setActionType] = useState(ACTION_TYPE.create)

  const createPositionBtnRef = useRef(null)

  const { data: positionList } = useQuery(['GET_POSITION_LIST'], () => getAllPositions(), {
    onError: (error) => {
      toastifyNotify('error', error?.message ?? 'Failed to get all positions')
    },
    initialData: [],
  })

  const positionIdList = positionList?.map((position) => position.Id)

  const { data: numberOfCandidateList, isFetching: numberOfCandidateListFetching } = useQuery(
    ['COUNT_CANDIDATES_IN_POSITION', positionIdList],
    () => countCandidatesInPosition(positionIdList),
    {
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to count candidates in position')
      },
      initialData: [],
      enabled: !!positionIdList.length,
    },
  )

  const { mutate: createPositionCampaignMutate } = useMutation((data) => createPositionCampaign(data), {
    onSuccess: (data) => {
      toastifyNotify('success', data.message)

      queryClient.setQueryData(['GET_POSITION_LIST'], [data.result, ...positionList])

      setIsShowActionModal(false)

      form.resetFields()
      form.setFieldValue('positions', [{ amount: '', category_test: [] }])
    },
    onError: (error) => {
      toastifyNotify('error', error?.message ?? 'Create position campaign failed')
    },
  })

  const { mutate: deletePositionCampaignMutate } = useMutation(() => deletePositionCampaign(selectedRecord), {
    onSuccess: ({ data }) => {
      toastifyNotify('success', data.message)
      queryClient.setQueryData(
        ['GET_POSITION_LIST'],
        positionList.filter((position) => position.Id !== selectedRecord),
      )
    },
    onError: (error) => {
      toastifyNotify('error', error?.message ?? 'Failed to delete position campaign.')
    },
  })

  const { mutate: updatePositionCampaignMutate } = useMutation(
    (data) => {
      return updatePositionCampaign(selectedRecord.id, data)
    },
    {
      onSuccess: (data) => {
        toastifyNotify('success', data.message)

        queryClient.setQueryData(['GET_POSITION_LIST'], (positionList) => {
          const newPositionList = [...positionList]
          const updateIndex = newPositionList.findIndex((e) => e.Id === selectedRecord.id)
          newPositionList[updateIndex] = data.result
        })

        setIsShowActionModal(false)

        form.resetFields()
        form.setFieldValue('positions', [{ amount: '', category_test: [] }])
      },
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to update position campaign.')
      },
    },
  )

  useEffect(() => {
    const newPositionList = positionList.map((position, index) => {
      return {
        key: index,
        id: position.Id,
        position: position.name,
        numberOfCandidates: numberOfCandidateList[index]?.numberOfCandidates ?? 0,
        dateCreated: formatDate(position.createdAt),
        description: position.description,
      }
    })

    setData(newPositionList)
  }, [numberOfCandidateList, positionList])

  const checkPositionIsUsing = async (positionId) => {
    const campaigns = await fetchCampaignByPositionId(positionId)

    setCampaignsUsingPosition(campaigns.map((campaign) => campaign.campaignName))

    if (!campaigns.length) {
      return { status: false }
    }

    return { status: true, campaignList: campaigns }
  }

  const handleEdit = (record) => {
    setSelectedRecord(record)
    setIsShowActionModal(true)
    setIsShowDetailModal(false)
    setActionType(ACTION_TYPE.edit)
  }

  const handleDelete = async (record) => {
    const isUsing = await checkPositionIsUsing(record.id)
    setIsShowDetailModal(false)

    if (isUsing.status) {
      setIsShowWarningModal(true)
    } else {
      setSelectedRecord(record.id)
      setIsShowConfirmModal(true)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      deletePositionCampaignMutate()
      setIsShowConfirmModal(false)
    } catch (e) {
      toastifyNotify('error', e)
    }
  }

  const handleCancelActionModal = () => {
    setIsShowActionModal(false)
  }

  const handleCloseDetailModal = () => {
    setIsShowDetailModal(false)
  }

  const handleCloseWarningModal = () => {
    setIsShowWarningModal(false)
  }

  const handleSubmitForm = (values) => {
    if (actionType === ACTION_TYPE.create) {
      createPositionCampaignMutate(values)
    } else {
      updatePositionCampaignMutate(values)
    }
  }

  const handleRowClick = (record) => {
    setSelectedRecord(record)
    setIsShowDetailModal(true)
  }

  const columns = [
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      render: (text) => <p className='position-page__column-content--bold'>{text}</p>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => <p>{text ?? '--'}</p>,
    },
    {
      title: 'Number of candidates applied',
      dataIndex: 'numberOfCandidates',
      key: 'numberOfCandidates',
      align: 'center',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Date created',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Action',
      align: 'center',
      render: (_, record) => (
        <Space size='small' onClick={(event) => event.stopPropagation()}>
          <EditIconButton onClick={() => handleEdit(record)} />
          <DeleteIconButton onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ]

  return (
    <Spin spinning={numberOfCandidateListFetching}>
      <div className='position-page'>
        <DashboardBar
          title={contentPage.title}
          rightItem={
            <ButtonAntd
              btnRef={createPositionBtnRef}
              title={'Create Position'}
              icon={<PlusOutlined style={{ fontSize: '14px', color: 'white' }} theme='outlined' />}
              onButtonClick={() => {
                setIsShowActionModal(true)
                setActionType(ACTION_TYPE.create)
              }}
            />
          }
        />
        <div className='position-page__wrapper'>
          <CustomTable columns={columns} dataSource={data} handleRowClick={handleRowClick} />
        </div>
        <ConfirmationModal
          centered
          visible={isShowConfirmModal}
          okText='Yes'
          cancelText='No'
          onOK={handleConfirmDelete}
          onCancel={() => setIsShowConfirmModal(false)}
        >
          Are you sure to delete this position?
        </ConfirmationModal>
        <ActionPositionModal
          form={form}
          title={actionType === ACTION_TYPE.create ? 'Create position' : 'Edit position'}
          okText={actionType === ACTION_TYPE.create ? 'Create position' : 'Edit position'}
          isOpen={isShowActionModal}
          selectedRecord={selectedRecord}
          handleSubmitForm={handleSubmitForm}
          handleCancelModal={handleCancelActionModal}
        />
        <DetailModal
          record={selectedRecord}
          isOpen={isShowDetailModal}
          handleCloseModal={handleCloseDetailModal}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
        <WarningUsingModal
          isOpen={isShowWarningModal}
          type='position'
          handleCloseWarningModal={handleCloseWarningModal}
          campaignsUsing={campaignsUsingPosition}
        />
      </div>

      <TutorialTour
        steps={[
          {
            title: 'Create position',
            description: (
              <p>
                <b>Click &quot;Create Position&quot; button</b> to create position
              </p>
            ),
            nextButtonProps: { style: { display: 'none' } },
            placement: 'left',
            target: () => createPositionBtnRef.current,
          },
        ]}
      />
    </Spin>
  )
}

export default PositionPage
