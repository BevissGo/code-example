import React from 'react'
import { Space, Spin } from 'antd'
import { useQuery } from '@tanstack/react-query'

import CustomTable from 'components/CustomTable'
import EditIconButton from 'components/EditIconButton'
import DeleteIconButton from 'components/DeleteIconButton'
import { fetchSurveyList } from 'api/business/survey.api'
import { toastifyNotify } from 'helpers'
import { ACTION_TYPE } from 'pages/YourTestsPage/constants'

import SurveyDetailModal from '../SurveyDetailModal'

import './style.scss'

function SurveyList({
  selectedRecord,
  isShowSurveyDetailModal,
  checkSurveyIsUsing,
  setSelectedRecord,
  setActionType,
  setIsShowSurveyActionModal,
  setIsShowDeleteModal,
  setIsShowWarningUsingModal,
  setIsShowSurveyDetailModal,
}) {
  const { data: surveyList, isFetching: surveyListFetching } = useQuery(['GET_SURVEY_LIST'], fetchSurveyList, {
    onError: (error) => {
      toastifyNotify('error', error?.message ?? 'Failed to fetch survey list.')
    },
  })

  const columns = [
    {
      title: 'No.',
      key: 'no',
      render: (_item, _record, index) => {
        return index + 1
      },
    },
    {
      title: 'Survey name',
      dataIndex: 'surveyName',
      key: 'surveyName',
      render: (surveyName) => <p className='survey-list__survey-name'>{surveyName}</p>,
    },
    {
      title: 'Number of question',
      dataIndex: 'questions',
      key: 'questions',
      render: (questions) => questions.length,
    },
    {
      title: 'Action',
      onCell: () => {
        return {
          onClick: (e) => {
            e.stopPropagation()
          },
        }
      },
      render: (_, record) => (
        <Space size='small'>
          <EditIconButton
            onClick={() => {
              setSelectedRecord(record)
              handleEditSurvey()
            }}
          />
          <DeleteIconButton
            onClick={() => {
              setSelectedRecord(record)
              handleDeleteSurvey(record)
            }}
          />
        </Space>
      ),
    },
  ]

  const handleRowClick = (record) => {
    setSelectedRecord(record)
    setIsShowSurveyDetailModal(true)
  }

  const handleCloseDetailModal = () => {
    setIsShowSurveyDetailModal(false)
  }

  const handleEditSurvey = () => {
    setActionType(ACTION_TYPE.EDIT)
    setIsShowSurveyActionModal(true)
    setIsShowSurveyDetailModal(false)
  }

  const handleDeleteSurvey = async (survey) => {
    const isUsing = await checkSurveyIsUsing(survey.Id)
    setIsShowSurveyDetailModal(false)

    if (isUsing.status) {
      setIsShowWarningUsingModal(true)
    } else {
      setIsShowDeleteModal(true)
    }
  }

  if (surveyListFetching) {
    return <Spin />
  }

  return (
    <>
      <CustomTable
        rowKey={(record) => record.Id}
        columns={columns}
        dataSource={surveyList}
        handleRowClick={handleRowClick}
      />

      <SurveyDetailModal
        data={selectedRecord}
        setSelectedRecord={setSelectedRecord}
        isOpen={isShowSurveyDetailModal}
        handleEditSurvey={handleEditSurvey}
        handleDeleteSurvey={handleDeleteSurvey}
        handleCloseModal={handleCloseDetailModal}
      />
    </>
  )
}

export default SurveyList
