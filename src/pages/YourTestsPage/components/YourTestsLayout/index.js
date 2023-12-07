import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusOutlined } from '@ant-design/icons'
import { Tabs } from 'antd'

import ButtonAntd from 'components/Button/Antd'
import TutorialTour from 'containers/Tour/Tutorial'
import CustomDeleteModal from 'components/CustomDeleteModal'
import { createCustomTest, deleteCustomTest, updateTest } from 'api/business/customizedTest.api'
import WarningUsingModal from 'components/WarningUsingModal'
import { fetchCampaignBySurveyId, fetchCampaignByTestId } from 'api/business/campaign.api'
import { createSurvey, deleteSurvey, updateSurvey } from 'api/business/survey.api'
import { toastifyNotify } from 'helpers'
import { ACTION_TYPE } from 'pages/YourTestsPage/constants'

import TestList from '../TestList'
import SurveyList from '../SurveyList'
import SurveyActionModal from '../SurveyActionModal'
import CustomTestActionModal from '../CustomTestActionModal'

import './style.scss'

const { TabPane } = Tabs

function YourTestsLayout({ disableTabBarExtraContent, tabBarExtraContent, isTestListPage, campaignRef }) {
  const history = useHistory()
  const queryClient = useQueryClient()
  const { pathname } = useLocation()

  const [tab, setTab] = useState(pathname.includes('survey') ? 'survey' : 'test')
  const [actionType, setActionType] = useState()
  const [campaignsUsing, setCampaignsUsing] = useState([])
  const [selectedRecord, setSelectedRecord] = useState({})
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
  const [isShowWarningUsingModal, setIsShowWarningUsingModal] = useState(false)
  const [isShowSurveyDetailModal, setIsShowSurveyDetailModal] = useState(false)
  const [isShowSurveyActionModal, setIsShowSurveyActionModal] = useState(false)
  const [isShowTestDetailModal, setIsShowTestDetailModal] = useState(false)
  const [isShowCustomTestActionModal, setIsShowCustomTestActionModal] = useState(false)

  const { mutate: createCustomTestMutate, isLoading: createCustomTestLoading } = useMutation(
    (values) => createCustomTest(values),
    {
      onSuccess: (data) => {
        setIsShowCustomTestActionModal(false)

        toastifyNotify('success', 'Create custom test successfully.')

        queryClient.setQueryData(['GET_CUSTOM_TEST_LIST'], (customTestList) => {
          return [data, ...customTestList]
        })
      },
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to create custom test.')
      },
    },
  )

  const { mutate: updateCustomTestMutate, isLoading: updateCustomTestLoading } = useMutation(
    ([id, params]) => updateTest(id, params),
    {
      onSuccess: (data) => {
        setIsShowCustomTestActionModal(false)

        toastifyNotify('success', 'Update custom test successfully.')

        queryClient.setQueryData(['GET_CUSTOM_TEST_LIST'], (customTestList) => {
          const newCustomTestList = [...customTestList]
          const updateIndex = newCustomTestList.findIndex((e) => e.Id === selectedRecord.Id)

          newCustomTestList[updateIndex] = data

          return newCustomTestList
        })
      },
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to update custom test.')
      },
    },
  )

  const { mutate: deleteCustomTestMutate, isLoading: deleteCustomTestLoading } = useMutation(
    () => deleteCustomTest(selectedRecord.Id),
    {
      onSuccess: () => {
        toastifyNotify('success', 'Delete test successfully.')

        setIsShowDeleteModal(false)
        setIsShowTestDetailModal(false)

        queryClient.setQueryData(['GET_CUSTOM_TEST_LIST'], (customTestList) => {
          const newCustomTestList = customTestList.filter((test) => {
            return test.Id !== selectedRecord.Id
          })

          return newCustomTestList
        })
      },
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to delete test.')
      },
    },
  )

  const { mutate: createSurveyMutate, isLoading: createSurveyLoading } = useMutation((values) => createSurvey(values), {
    onSuccess: (data) => {
      setIsShowSurveyActionModal(false)

      toastifyNotify('success', 'Create survey successfully.')

      queryClient.setQueryData(['GET_SURVEY_LIST'], (surveyList) => {
        return [data, ...surveyList]
      })
    },
    onError: (error) => {
      toastifyNotify('error', error?.message ?? 'Failed to create survey.')
    },
  })

  const { mutate: updateSurveyMutate, isLoading: updateSurveyLoading } = useMutation(
    ([id, params]) => updateSurvey(id, params),
    {
      onSuccess: (data) => {
        setIsShowSurveyActionModal(false)

        toastifyNotify('success', 'Update survey successfully.')

        queryClient.setQueryData(['GET_SURVEY_LIST'], (surveyList) => {
          const newSurveyList = [...surveyList]
          const updateIndex = newSurveyList.findIndex((e) => e.Id === selectedRecord.Id)

          newSurveyList[updateIndex] = data

          return newSurveyList
        })
      },
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to update survey.')
      },
    },
  )

  const { mutate: deleteSurveyMutate, isLoading: deleteSurveyLoading } = useMutation(
    () => deleteSurvey(selectedRecord.Id),
    {
      onSuccess: () => {
        toastifyNotify('success', 'Delete survey successfully.')

        setIsShowDeleteModal(false)
        setIsShowSurveyDetailModal(false)

        queryClient.setQueryData(['GET_SURVEY_LIST'], (surveyList) => {
          const newSurveyList = surveyList.filter((survey) => {
            return survey.Id !== selectedRecord.Id
          })

          return newSurveyList
        })
      },
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to delete test.')
      },
    },
  )

  const handleChangeTab = (key) => {
    setTab(key)
    switch (key) {
      case 'test':
        history.push('/business/your-tests')
        break

      case 'survey':
        history.push('/business/your-tests/survey')
        break

      default:
        history.push('/business/your-tests')
        break
    }
  }

  const checkIsUsing = async (id) => {
    let campaigns = []

    if (tab === 'survey') {
      campaigns = await fetchCampaignBySurveyId(id)
    } else {
      campaigns = await fetchCampaignByTestId(id)
    }

    setCampaignsUsing(campaigns.map((campaign) => campaign.campaignName))

    if (!campaigns.length) {
      return { status: false }
    }

    return { status: true, campaignList: campaigns }
  }

  const handleClickCreateTest = () => {
    setActionType(ACTION_TYPE.CREATE)
    setIsShowCustomTestActionModal(true)
  }

  const handleCloseCustomTestActionModal = () => {
    setIsShowCustomTestActionModal(false)
  }

  const handleUpdateCustomTest = (values) => {
    updateCustomTestMutate([selectedRecord.Id, values])
  }

  const handleCreateCustomTest = (values) => {
    createCustomTestMutate(values)
  }

  const handleDeleteCustomTest = () => {
    deleteCustomTestMutate()
  }

  const handleClickCreateSurvey = () => {
    setActionType(ACTION_TYPE.CREATE)
    setIsShowSurveyActionModal(true)
  }

  const handleCloseSurveyActionModal = () => {
    setIsShowSurveyActionModal(false)
  }

  const handleUpdateSurvey = (values) => {
    updateSurveyMutate([selectedRecord.Id, values])
  }

  const handleCreateSurvey = (values) => {
    createSurveyMutate(values)
  }

  const handleDeleteSurvey = () => {
    deleteSurveyMutate()
  }

  const handleCloseWarningUsingModal = () => {
    setIsShowWarningUsingModal(false)
  }

  const createTestBtn = (
    <ButtonAntd
      title={
        <span>
          <PlusOutlined /> Create Test
        </span>
      }
      onClick={handleClickCreateTest}
    />
  )

  const createSurveyBtn = (
    <ButtonAntd
      title={
        <span>
          <PlusOutlined /> Create Survey
        </span>
      }
      onClick={handleClickCreateSurvey}
    />
  )

  return (
    <div className='your-tests-layout'>
      <Tabs
        activeKey={tab}
        tabBarExtraContent={
          disableTabBarExtraContent
            ? null
            : tabBarExtraContent
            ? { right: tabBarExtraContent }
            : { right: tab === 'test' ? createTestBtn : createSurveyBtn }
        }
        onChange={handleChangeTab}
      >
        <TabPane tab='Tests' key='test'>
          <TestList
            selectedRecord={selectedRecord}
            isShowTestDetailModal={isShowTestDetailModal}
            setActionType={setActionType}
            setSelectedRecord={setSelectedRecord}
            setIsShowDeleteModal={setIsShowDeleteModal}
            checkCustomTestIsUsing={checkIsUsing}
            setIsShowWarningUsingModal={setIsShowWarningUsingModal}
            setIsShowTestDetailModal={setIsShowTestDetailModal}
            setIsShowCustomTestActionModal={setIsShowCustomTestActionModal}
          />
        </TabPane>
        <TabPane tab='Survey' key='survey'>
          <SurveyList
            selectedRecord={selectedRecord}
            isShowSurveyDetailModal={isShowSurveyDetailModal}
            setActionType={setActionType}
            setSelectedRecord={setSelectedRecord}
            setIsShowDeleteModal={setIsShowDeleteModal}
            checkSurveyIsUsing={checkIsUsing}
            setIsShowWarningUsingModal={setIsShowWarningUsingModal}
            setIsShowSurveyDetailModal={setIsShowSurveyDetailModal}
            setIsShowSurveyActionModal={setIsShowSurveyActionModal}
          />
        </TabPane>
      </Tabs>

      <CustomTestActionModal
        isOpen={isShowCustomTestActionModal}
        selectedRecord={selectedRecord}
        type={actionType}
        title={actionType === ACTION_TYPE.CREATE ? 'Create test' : 'Edit test'}
        createCustomTestLoading={createCustomTestLoading}
        updateCustomTestLoading={updateCustomTestLoading}
        handleCloseModal={handleCloseCustomTestActionModal}
        handleUpdateCustomTest={handleUpdateCustomTest}
        handleCreateCustomTest={handleCreateCustomTest}
      />

      <SurveyActionModal
        isOpen={isShowSurveyActionModal}
        selectedRecord={selectedRecord}
        type={actionType}
        title={actionType === ACTION_TYPE.CREATE ? 'Create survey' : 'Edit survey'}
        createSurveyLoading={createSurveyLoading}
        updateSurveyLoading={updateSurveyLoading}
        handleCloseModal={handleCloseSurveyActionModal}
        handleUpdateSurvey={handleUpdateSurvey}
        handleCreateSurvey={handleCreateSurvey}
      />

      <CustomDeleteModal
        type={tab}
        isOpen={isShowDeleteModal}
        confirmLoading={deleteCustomTestLoading || deleteSurveyLoading}
        handleOk={tab === 'test' ? handleDeleteCustomTest : handleDeleteSurvey}
        handleCancel={() => setIsShowDeleteModal(false)}
      />

      <WarningUsingModal
        isOpen={isShowWarningUsingModal}
        type={tab}
        handleCloseWarningModal={handleCloseWarningUsingModal}
        campaignsUsing={campaignsUsing}
      />

      {isTestListPage && (
        <>
          <TutorialTour
            steps={[
              {
                title: 'Create test',
                description:
                  "Well done! This section helps you to create test for your campaign. If you don't want to add test, you can use our 4 standard tests.",
                placement: 'left',
                mask: { style: { pointerEvents: 'auto' } },
              },
              {
                title: 'Campaign',
                description: (
                  <p>
                    Good! Let&apos;s create our first Campaign.
                    <br />
                    <b>Please select Campaign in the menu</b>
                  </p>
                ),
                nextButtonProps: { style: { display: 'none' } },
                placement: 'left',
                target: () => campaignRef.current,
              },
            ]}
          />
        </>
      )}
    </div>
  )
}

export default YourTestsLayout
