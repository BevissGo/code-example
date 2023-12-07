import React from 'react'
import { Space, Spin } from 'antd'
import { useQuery } from '@tanstack/react-query'

import CustomTable from 'components/CustomTable'
import EditIconButton from 'components/EditIconButton'
import DeleteIconButton from 'components/DeleteIconButton'
import { fetchCustomizedTestList } from 'api/business/customizedTest.api'
import { toastifyNotify } from 'helpers'
import { ACTION_TYPE } from 'pages/YourTestsPage/constants'

import TestDetailModal from '../TestDetailModal'

import './style.scss'

function TestList({
  selectedRecord,
  isShowTestDetailModal,
  checkCustomTestIsUsing,
  setSelectedRecord,
  setActionType,
  setIsShowCustomTestActionModal,
  setIsShowDeleteModal,
  setIsShowWarningUsingModal,
  setIsShowTestDetailModal,
}) {
  const { data: customTestList, isFetching: customTestListFetching } = useQuery(
    ['GET_CUSTOM_TEST_LIST'],
    fetchCustomizedTestList,
    {
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to fetch custom test list.')
      },
    },
  )

  const columns = [
    {
      title: 'No.',
      key: 'no',
      render: (_item, _record, index) => {
        return index + 1
      },
    },
    {
      title: 'Test name',
      dataIndex: 'testName',
      key: 'testName',
      render: (testName) => <p className='test-list__test-name'>{testName}</p>,
    },
    {
      title: 'Number of questions',
      dataIndex: 'questionList',
      key: 'questionList',
      render: (questionList) => questionList?.length,
    },
    {
      title: 'Duration (mins)',
      key: 'durationTime',
      dataIndex: 'durationTime',
      render: (durationTime) => durationTime ?? 'Unlimited',
    },
    {
      title: 'Format',
      key: 'format',
      dataIndex: 'format',
      render: () => 'MCQ',
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
              handleEditTest()
            }}
          />
          <DeleteIconButton
            onClick={() => {
              setSelectedRecord(record)
              handleDeleteTest(record)
            }}
          />
        </Space>
      ),
    },
  ]

  const handleRowClick = (record) => {
    setSelectedRecord(record)
    setIsShowTestDetailModal(true)
  }

  const handleCloseDetailModal = () => {
    setIsShowTestDetailModal(false)
  }

  const handleEditTest = () => {
    setActionType(ACTION_TYPE.EDIT)
    setIsShowCustomTestActionModal(true)
    setIsShowTestDetailModal(false)
  }

  const handleDeleteTest = async (test) => {
    const isUsing = await checkCustomTestIsUsing(test.Id)
    setIsShowTestDetailModal(false)

    if (isUsing.status) {
      setIsShowWarningUsingModal(true)
    } else {
      setIsShowDeleteModal(true)
    }
  }

  if (customTestListFetching) {
    return <Spin />
  }

  return (
    <>
      <CustomTable
        rowKey={(record) => record.Id}
        columns={columns}
        dataSource={customTestList}
        handleRowClick={handleRowClick}
      />

      <TestDetailModal
        testData={selectedRecord}
        setSelectedRecord={setSelectedRecord}
        isOpen={isShowTestDetailModal}
        handleEditTest={handleEditTest}
        handleDeleteTest={handleDeleteTest}
        handleCloseModal={handleCloseDetailModal}
      />
    </>
  )
}

export default TestList
