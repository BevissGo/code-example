import React, { useState, useRef, useEffect } from 'react'
import { Modal, Col, Form, Spin, Row } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import moment from 'moment'
import dayjs from 'dayjs'

import TutorialTour from 'containers/Tour/Tutorial'
import ButtonAntd from 'components/Button/Antd'
import ConfirmationModal from 'components/Modal/ConfirmModal'
import { createCampaign, fetchCampaignDetail, updateCampaign } from 'api/business/campaign.api'
import { checkIsEdittingAndCampaignNotPending } from 'pages/CampaignPage/helpers'
import { GET_CAMPAIGN_DETAIL, GET_CAMPAIGN_LIST } from 'api/req'
import { fetchProfilePatterns } from 'api/business/profilePatterns.api'
import { convertEqScoreRange } from 'pages/CampaignPage/utils'
import { toastifyNotify } from 'helpers'

import CampaignPositionFormList from './CampaignPostionFormList'
import CampaignInformationForm from './CampaignInformationForm'

import './style.scss'

function CampaignActionModal({
  form,
  isShowActionModal,
  setIsShowActionModal,
  candidateRef,
  campaignList,
  selectedRecord,
  handleCloseModal,
}) {
  const queryClient = useQueryClient()

  const [showSaveWarningModal, setShowSaveWarningModal] = useState(false)
  const [selectedPositionList, setSelectedPositionList] = useState([])
  const [categoryTestList, setCategoryTestList] = useState([])
  const [uploadTestList, setUploadTestList] = useState([])
  const [testQuestions, setTestQuestions] = useState([])
  const [campaignData, setCampaignData] = useState()

  const atLeastRef = useRef(null)
  const positionInfoRef = useRef(null)
  const addTestSectionRef = useRef(null)
  const basicInfoCampaignRef = useRef(null)
  const createCampaignBtnRef = useRef(null)
  const profileRequirementRef = useRef(null)
  const addMorePositionBtnRef = useRef(null)

  const steps = [
    {
      title: 'Campaign basic information',
      description: 'This section highlights basic information of your campaign',
      mask: { style: { pointerEvents: 'auto' } },
      target: () => basicInfoCampaignRef.current,
    },
    {
      title: 'Position information',
      description:
        'In this section, you can select the position you want to use in this campaign and the desired quantity for that position',
      mask: { style: { pointerEvents: 'auto' } },
      target: () => positionInfoRef.current,
    },
    {
      title: 'Profile requirement',
      description: 'This section will help you collect CV or Cover Letter of candidates if you desire',
      mask: { style: { pointerEvents: 'auto' } },
      target: () => profileRequirementRef.current,
    },
    {
      title: 'Add test to campaign',
      description:
        "These are DiSC's standard tests. You can make use of them or adding your own customized test. Customized test can be created in Your Test module.",
      mask: { style: { pointerEvents: 'auto' } },
      target: () => addTestSectionRef.current,
    },
    {
      title: 'Add more position to campaign',
      description:
        'A campaign can be used to recruit several positions. You can add details for another position here. Please make sure you created all recruiting positions in Position module.',
      placement: 'left',
      mask: { style: { pointerEvents: 'auto' } },
      target: () => addMorePositionBtnRef.current,
    },
    {
      title: 'Create campaign',
      description: 'Confirm to create campaign here',
      placement: 'left',
      mask: { style: { pointerEvents: 'auto' } },
      target: () => createCampaignBtnRef.current,
    },
    {
      title: 'Candidates',
      description: 'Finally, you can view your candidates here.',
      placement: 'right',
      nextButtonProps: { style: { display: 'none' } },
      target: () => candidateRef.current,
    },
  ]

  const campaignStatus = selectedRecord?.status?.title
  const campaignId = selectedRecord?.record?.Id
  const type = selectedRecord ? 'edit' : 'create'

  const { data: profilePatterns } = useQuery(['GET_PROFILE_PATTERNS'], () => fetchProfilePatterns(), {
    onError: (error) => {
      toastifyNotify('error', error?.message ?? 'Failed to fetch profile pattern')
    },
  })

  const { isFetching: getCampaignDetailLoading } = useQuery(
    [GET_CAMPAIGN_DETAIL, campaignId],
    () => fetchCampaignDetail(campaignId),
    {
      enabled: !!campaignId,
      onSuccess: ({ data }) => {
        const { campaignName, recruiter, positions, purpose, range, startDate, endDate } = data

        setCategoryTestList(positions.map((position) => position.categoryTest))
        setUploadTestList(positions.map((position) => position.uploadTest))

        form.setFieldsValue({
          ...(campaignName && { campaign_name: campaignName }),
          ...(recruiter && { recruiter }),
          ...(positions && {
            positions: positions.map((position) => {
              return {
                _id: position?.Id,
                position_id: position?.positionId.Id,
                amount: position?.amount ?? '',
                upload_test: position?.uploadTest ?? [],
                require_attach_cv: position?.requireAttachCv ?? false,
                require_attach_cover_letter: position?.requireAttachCoverLetter ?? false,
                category_test: position?.categoryTest ?? [],
                iq_score: position?.iqScore?.toString() ?? '',
                eq_score: position?.eqScore ? convertEqScoreRange(position?.eqScore) : '',
                disc_score: position?.discScore?.length === profilePatterns.length ? ['all'] : position?.discScore,
                brain_score: position?.brainScore ?? '',
                survey_iq_score: position?.surveyIqScore,
                survey_eq_score: position?.surveyEqScore,
                survey_brain_score: position?.surveyBrainScore,
                survey_disc_score: position?.surveyDiscScore,
                test_list: position?.testList?.map((test) => {
                  testQuestions.push(test.testId.questionList?.length)
                  setTestQuestions(testQuestions)
                  return {
                    test_id: test.testId.Id,
                    fit_result: test.fitResult.toString() ?? '',
                    survey_id: test.surveyId,
                  }
                }),
              }
            }),
          }),
          ...(purpose && { purpose }),
          ...(range && { range }),
          ...(startDate && { start_date: dayjs(startDate) }),
          ...(endDate && { end_date: dayjs(endDate) }),
        })
      },
      onError: (error) => {
        toastifyNotify('error', error?.message ?? `Failed to fetch campaign detail ID ${campaignId}.`)
      },
    },
  )

  const { mutate: createCampaignMutate, isLoading: createCampaignLoading } = useMutation(
    (values) => createCampaign(values),
    {
      onSuccess: (data) => {
        setShowSaveWarningModal(false)
        setIsShowActionModal(false)
        toastifyNotify('success', 'Create campaign successfully.')
        queryClient.setQueryData([GET_CAMPAIGN_LIST], [data, ...campaignList])
      },
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to create campaign.')
      },
    },
  )

  const { mutate: updateCampaignMutate, isLoading: updateCampaignLoading } = useMutation(
    (values) => updateCampaign(campaignId, values),
    {
      onSuccess: (data) => {
        setShowSaveWarningModal(false)
        setIsShowActionModal(false)

        toastifyNotify('success', 'Update campaign successfully.')

        queryClient.setQueryData([GET_CAMPAIGN_LIST], (campaignList) => {
          const newCampaignList = [...campaignList]
          const updateIndex = newCampaignList.findIndex((e) => e.Id === campaignId)

          newCampaignList[updateIndex] = data

          return newCampaignList
        })
      },
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to update campaign.')
      },
    },
  )

  useEffect(() => {
    if (type === 'create') {
      setCategoryTestList([])
      setUploadTestList([])
      setTestQuestions([])
      setSelectedPositionList([])

      form.resetFields()
      form.setFieldValue('positions', [{ amount: '', category_test: [] }])
    }
  }, [form, type])

  const disableEndDate = (current) => {
    const startDate = form.getFieldValue('start_date')

    if (startDate) {
      return current && current < moment(startDate).endOf('day')
    } else {
      return false
    }
  }

  const handleScroll = () => {
    atLeastRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    })
  }

  const handleSubmit = (values) => {
    let convertValues = values

    const isTestSelected = !!values?.positions[0]?.category_test?.length

    if (isTestSelected) {
      convertValues = {
        ...values,
        positions: values.positions?.map((position) => {
          position.test_list = position.test_list?.map((test) => {
            if (test.survey_id === 'defaultSurvey') {
              return {
                ...test,
                survey_id: undefined,
              }
            }

            return test
          })

          if (position.survey_iq_score === 'defaultSurvey') {
            position.survey_iq_score = undefined
          }

          if (position.survey_eq_score === 'defaultSurvey') {
            position.survey_eq_score = undefined
          }

          if (position.survey_brain_score === 'defaultSurvey') {
            position.survey_brain_score = undefined
          }

          if (position.survey_disc_score === 'defaultSurvey') {
            position.survey_disc_score = undefined
          }

          const newPosition = {
            ...position,
          }

          if (newPosition['0']) {
            delete newPosition['0']
          }

          return newPosition
        }),
      }

      setShowSaveWarningModal(true)
      setCampaignData(convertValues)
    } else {
      handleScroll()
    }
  }

  const handleConfirmSaveCampaign = () => {
    if (!campaignId) {
      createCampaignMutate(campaignData)
    }

    if (campaignId) {
      updateCampaignMutate(campaignData)
    }
  }

  const handleAddMorePosition = () => {
    const positionsForm = form.getFieldValue('positions')

    positionsForm.push({ amount: '', category_test: [] })

    form.setFieldValue('positions', positionsForm)
  }

  return (
    <Modal
      className='campaign-action-modal'
      title={
        <div className='campaign-action-modal__header'>
          <span>{type === 'create' ? 'Create campaign' : 'Edit campaign'}</span>
          <Row gutter={[20]}>
            {!checkIsEdittingAndCampaignNotPending({ actionType: type, campaignStatus }) && (
              <Col>
                <ButtonAntd
                  className='campaign-action-modal__add-position-btn'
                  textColor='#003977'
                  type='default'
                  title='Add more position'
                  onButtonClick={() => {
                    handleAddMorePosition()
                  }}
                />
              </Col>
            )}
            <Col>
              <ButtonAntd
                title={type === 'create' ? 'Create campaign' : 'Update campaign'}
                onButtonClick={() => form.submit()}
              />
            </Col>
          </Row>
        </div>
      }
      open={isShowActionModal}
      centered
      width='70%'
      maskClosable={false}
      onCancel={() => {
        handleCloseModal()
      }}
      footer={null}
    >
      <Spin spinning={getCampaignDetailLoading || createCampaignLoading || updateCampaignLoading}>
        <Col>
          <Form
            layout='horizontal'
            form={form}
            colon={false}
            scrollToFirstError={{
              behavior: 'smooth',
              block: 'center',
              inline: 'center',
            }}
            onFinish={handleSubmit}
          >
            <CampaignInformationForm
              form={form}
              disableEndDate={disableEndDate}
              actionType={type}
              campaignStatus={campaignStatus}
              basicInfoCampaignRef={basicInfoCampaignRef}
            />
            <CampaignPositionFormList
              form={form}
              categoryTestList={categoryTestList}
              uploadTestList={uploadTestList}
              actionType={type}
              campaignStatus={campaignStatus}
              atLeastRef={atLeastRef}
              selectedPositionList={selectedPositionList}
              setSelectedPositionList={setSelectedPositionList}
              testQuestions={testQuestions}
              setTestQuestions={setTestQuestions}
              positionInfoRef={positionInfoRef}
              profileRequirementRef={profileRequirementRef}
              addTestSectionRef={addTestSectionRef}
              addMorePositionBtnRef={addMorePositionBtnRef}
            />
          </Form>

          <ConfirmationModal
            centered
            visible={showSaveWarningModal}
            okText='Yes'
            cancelText='Let me check again'
            title='Save campaign?'
            loadingOkBtn={updateCampaignLoading || createCampaignLoading}
            onOK={handleConfirmSaveCampaign}
            onCancel={() => setShowSaveWarningModal(false)}
          >
            Please check your campaign carefully. You cannot edit when the Campaign is Processing
          </ConfirmationModal>
        </Col>

        <TutorialTour steps={steps} />
      </Spin>
    </Modal>
  )
}

export default CampaignActionModal
