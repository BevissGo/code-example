import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { DownloadOutlined, LeftOutlined, SaveOutlined } from '@ant-design/icons'
import { Col, DatePicker, Form, Input, Row, Spin } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { capitalize, uniq } from 'lodash'
import dayjs from 'dayjs'

import i18nVN from 'i18n/locales/vn'
import ButtonAntd from 'components/Button/Antd'
import InputAntd from 'components/Input/InputAntd'
import { calcTotalResultPassedOrFailed, toastifyNotify } from 'helpers'
import DashboardBar from 'pages/DashBoard/containers/DashboardBar'
import { editCandidate, getByCandidateId } from 'api/business/userPositionCampaign.api'

import './style.scss'
import { phoneRegExp } from 'utils'
import instance from 'api'
import ConfirmationModal from 'components/Modal/ConfirmModal'

function CandidateDetail() {
  const {
    pages: {
      business: {
        dashboard: { candidate: contentPage },
      },
    },
  } = i18nVN.src

  const CONFIRM_TYPE = {
    submitForm: 'submitForm',
    changeStatusToInterviewing: 'changeStatusToInterviewing',
    changeStatusToOnboarding: 'changeStatusToOnboarding',
    changeStatusToRejected: 'changeStatusToRejected',
  }

  const [candidates, setCandidates] = useState([])
  const [positionList, setPositionList] = useState([])
  const [candidateByPositionCampaignList, setCandidateByPositionCampaignList] = useState([])
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false)
  const [confirmType, setConfirmType] = useState(CONFIRM_TYPE.submitForm)
  const [positionIdToUpdateStatus, setPositionIdToUpdateStatus] = useState()

  const [form] = Form.useForm()
  const history = useHistory()
  const { userId } = useParams()

  const { mutate: getCandidateByIdMutate, isLoading: getCandidateByIdLoading } = useMutation(
    () => getByCandidateId(userId),
    {
      onSuccess: (data) => {
        setCandidates(data.filter((e) => !e.user.campaignId.cancelled))
      },
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to get candidate.')
      },
    },
  )

  const { mutate: editCandidateMutate, isLoading: editCandidateLoading } = useMutation(
    (values) => editCandidate(userId, values),
    {
      onSuccess: () => {
        toastifyNotify('success', 'Update Candidate successfully.')
        history.push(`/business/candidates/${userId}`)
      },
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to update candidate.')
      },
    },
  )

  useEffect(() => {
    getCandidateByIdMutate()
  }, [getCandidateByIdMutate])

  useEffect(() => {
    const name = candidates[0]?.user.userId?.name
    const dob = candidates[0]?.user.userId?.dob
    const phone = candidates[0]?.user.userId?.phone
    let positions = candidates?.map((candidate) => candidate.user.positionId?.name)
    positions = uniq([...positions]).join(', ')
    const iqScores = candidates?.map((candidate) => candidate.user.iqScoreId?.score ?? null)
    const eqScores = candidates?.map((candidate) => candidate.user.eqScoreId?.score ?? null)
    const discScores = candidates?.map((candidate) => candidate.discScore ?? null)
    const brainScores = candidates?.map((candidate) => candidate.user.brainScoreId?.sideOfBrain ?? null)
    let brainScore = brainScores?.find((score) => !!score) ?? '--'
    const iqScore = iqScores?.find((score) => !!score) ?? '--'
    const eqScore = eqScores?.find((score) => !!score) ?? '--'
    const discScore = discScores?.find((score) => !!score) ?? '--'
    brainScore = brainScore === 'all' ? 'All' : brainScore === 'L' ? 'Left' : brainScore === 'R' ? 'Right' : '--'
    const email = candidates[0]?.user.userId?.email
    const facebook = candidates[0]?.user.userId?.facebookProfileUrl
    setPositionList(positions?.split(', '))
    setCandidateByPositionCampaignList(candidates?.map((e) => e.user))

    form.setFieldsValue({
      name: name ?? '--',
      ...(dob && { dob: dayjs(dob) }),
      phone: phone ?? '--',
      position: positions ?? '--',
      iqScore: iqScore ?? '--',
      eqScore: eqScore ?? '--',
      discScore: discScore ?? '--',
      brainScore: brainScore ?? '--',
      email: email ?? '--',
      facebook,
    })
  }, [form, candidates])

  const handleBack = () => {
    history.push(`/business/candidates/${userId}`)
  }

  const rightDashboardItems = (
    <>
      <ButtonAntd
        title='Back'
        icon={<LeftOutlined style={{ fontSize: '14px', color: '#555555' }} theme='outlined' />}
        ghost
        style={{
          borderColor: 'black',
        }}
        textColor='#555555'
        onButtonClick={handleBack}
      />
      <ButtonAntd
        style={{ marginLeft: '12px' }}
        title='Save'
        icon={<SaveOutlined style={{ fontSize: '14px', color: 'white' }} theme='outlined' />}
        onButtonClick={() => {
          setIsShowConfirmModal(true)
          setConfirmType(CONFIRM_TYPE.submitForm)
        }}
        spacingRight={true}
      />
    </>
  )

  const handleSubmit = async (fieldsValue) => {
    const values = {
      ...fieldsValue,
      dob: fieldsValue['dob']?.format('YYYY-MM-DD') ?? null,
    }

    const { name, dob, phone, facebook } = values

    editCandidateMutate({ name, dob, phone, facebook })
  }

  const handleChangeStatusToInterviewing = async (positionId) => {
    await instance.put(`/v2/user-position-campaign/changeStatusMultipleCampaigns/${positionId}/${userId}`, {
      status: 'interviewing',
    })

    setIsShowConfirmModal(false)
    getCandidateByIdMutate()
  }

  const handleChangeStatusToOnboarding = async (positionId) => {
    await instance.put(`/v2/user-position-campaign/changeStatusMultipleCampaigns/${positionId}/${userId}`, {
      status: 'onboarding',
    })

    setIsShowConfirmModal(false)
    getCandidateByIdMutate()
  }

  const handleChangeStatusToRejected = async (positionId) => {
    await instance.put(`/v2/user-position-campaign/changeStatusMultipleCampaigns/${positionId}/${userId}`, {
      status: 'rejected',
    })

    setIsShowConfirmModal(false)
    getCandidateByIdMutate()
  }

  return (
    <Spin spinning={getCandidateByIdLoading || editCandidateLoading}>
      <DashboardBar title={contentPage.title} rightItem={rightDashboardItems} />
      <Form
        form={form}
        layout='vertical'
        scrollToFirstError={{
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        }}
        onFinish={handleSubmit}
      >
        <Col className='candidate-edit' span={24}>
          <div className='candidate-edit__wrapper'>
            <div className='candidate-edit__title'>Personal info</div>
            <Row gutter={24}>
              <Col span={4}>
                <Form.Item name='name' label='Name'>
                  <Input className='candidate-edit__input' />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name='dob' label='Date of birth'>
                  <DatePicker style={{ fontFamily: 'ProximaNova-Regular' }} format='DD/MM/YYYY' allowClear={false} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name='phone'
                  label='Phone number'
                  rules={[
                    {
                      pattern: new RegExp(phoneRegExp),
                      message: 'This is not phone number',
                    },
                  ]}
                >
                  <Input className='candidate-edit__input' />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name='email' label='Email'>
                  <InputAntd style={{ cursor: 'default' }} disabled={true} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name='facebook' label='Facebook'>
                  <Input className='candidate-edit__input' />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className='candidate-edit__wrapper'>
            <div className='candidate-edit__title'>Test scores</div>
            <Row gutter={24}>
              <Col span={4}>
                <Form.Item labelCol={2} name='iqScore' label='IQ score'>
                  <InputAntd style={{ cursor: 'default' }} disabled={true} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name='eqScore' label='EQ score'>
                  <InputAntd style={{ cursor: 'default' }} disabled={true} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name='discScore' label='DISC type'>
                  <InputAntd style={{ cursor: 'default' }} disabled={true} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name='brainScore' label='Brain ability'>
                  <InputAntd style={{ cursor: 'default' }} disabled={true} />
                </Form.Item>
              </Col>
            </Row>
          </div>
          {positionList?.map((position, positionIndex) => {
            const candidateByPositionList = candidateByPositionCampaignList?.filter(
              (candidate) => candidate.positionId.name === position,
            )

            const positionId = candidateByPositionList[0]?.positionId.Id

            const candidateStatus = candidateByPositionList[0]?.status

            return (
              <Col key={positionIndex} className='candidate-edit__card-wrapper'>
                <Row justify='space-between' align='bottom'>
                  <Col>
                    <div className='candidate-edit__card-title'>{position}</div>
                  </Col>
                </Row>
                {candidateByPositionList?.map((candidate, candidateIndex) => {
                  const totalResultPassedOrFailed = calcTotalResultPassedOrFailed(candidate)

                  return (
                    <Col key={candidateIndex} className='candidate-edit__card-wrapper'>
                      <Row justify='space-between' align='bottom'>
                        <Col>
                          <div className='candidate-edit__card-title'>{candidate.campaignId.campaignName}</div>
                        </Col>
                      </Row>
                      <div className='candidate-edit__wrapper' style={{ marginTop: -30 }}>
                        <div className='candidate-edit__title'>Result</div>
                        <Col key={candidateIndex}>
                          <Row gutter={24} style={{ marginBottom: 12 }}>
                            <Col span={22}>
                              {!candidate.customTestScoreId?.length && (
                                <p className='candidate-edit__custom-test-name'>No custom test</p>
                              )}
                              <Row gutter={24}>
                                {candidate.customTestScoreId?.map((customTest, customTestIndex) => {
                                  return (
                                    <Col span={4} key={customTestIndex}>
                                      <p className='candidate-edit__custom-test-name'>
                                        {customTest.testId.testName} Test
                                      </p>
                                      <InputAntd
                                        style={{ cursor: 'default' }}
                                        disabled={true}
                                        value={`${customTest.correct} / ${customTest.fitCorrect}`}
                                      />
                                    </Col>
                                  )
                                })}
                              </Row>
                            </Col>
                            {totalResultPassedOrFailed === 'Passed' ? (
                              <Col className='candidate-edit__custom-test-result'>{totalResultPassedOrFailed}</Col>
                            ) : (
                              <Col
                                className='candidate-edit__custom-test-result'
                                style={{ backgroundColor: 'rgb(255, 208, 206)', color: '#dc0b0b' }}
                              >
                                {totalResultPassedOrFailed}
                              </Col>
                            )}
                          </Row>
                        </Col>
                      </div>
                      <div className='candidate-edit__wrapper'>
                        <div className='candidate-edit__title'>Licenses and Docs</div>
                        <Col key={candidateIndex}>
                          <Row gutter={24}>
                            <Col span={4}>
                              <Form.Item>
                                CV:
                                {candidate.attach_cv ? (
                                  <DownloadOutlined onClick={() => window.open(candidate.attach_cv.path)} />
                                ) : (
                                  ' none'
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={4} style={{ display: 'flex', flexDirection: 'row' }}>
                              <Form.Item>
                                Cover Letter:
                                {candidate.attachCoverLetter ? (
                                  <DownloadOutlined onClick={() => window.open(candidate.attachCoverLetter.path)} />
                                ) : (
                                  ' none'
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      </div>
                    </Col>
                  )
                })}
                <div className='candidate-edit__wrapper'>
                  <div className='candidate-edit__title'>Change Status</div>
                  {capitalize(candidateStatus) === 'Applied' ? (
                    <div>
                      <p
                        className='candidate-edit__status'
                        style={{ backgroundColor: 'rgb(193,231,255)', color: '#003977' }}
                      >
                        {capitalize(candidateStatus)}
                      </p>
                      <ButtonAntd
                        title={'Approve'}
                        style={{ backgroundColor: '#3B813A', marginRight: 12 }}
                        onButtonClick={() => {
                          setIsShowConfirmModal(true)
                          setConfirmType(CONFIRM_TYPE.changeStatusToInterviewing)
                          setPositionIdToUpdateStatus(positionId)
                        }}
                      />
                      <ButtonAntd
                        title={'Reject'}
                        style={{ backgroundColor: '#dc0b0b', marginBottom: 12 }}
                        onButtonClick={() => {
                          setIsShowConfirmModal(true)
                          setConfirmType(CONFIRM_TYPE.changeStatusToRejected)
                          setPositionIdToUpdateStatus(positionId)
                        }}
                      />
                    </div>
                  ) : capitalize(candidateStatus) === 'Interviewing' ? (
                    <div>
                      <p className='candidate-edit__status' style={{ backgroundColor: '#FFF6C4', color: '#D9B602' }}>
                        {capitalize(candidateStatus)}
                      </p>
                      <ButtonAntd
                        title={'Onboard'}
                        style={{ backgroundColor: '#3B813A', marginRight: 12 }}
                        onButtonClick={() => {
                          setIsShowConfirmModal(true)
                          setConfirmType(CONFIRM_TYPE.changeStatusToOnboarding)
                          setPositionIdToUpdateStatus(positionId)
                        }}
                      />
                      <ButtonAntd
                        title={'Reject'}
                        style={{ backgroundColor: '#dc0b0b', marginBottom: 12 }}
                        onButtonClick={() => {
                          setIsShowConfirmModal(true)
                          setConfirmType(CONFIRM_TYPE.changeStatusToRejected)
                          setPositionIdToUpdateStatus(positionId)
                        }}
                      />
                    </div>
                  ) : capitalize(candidateStatus) === 'Onboarding' ? (
                    <p
                      className='candidate-edit__status'
                      style={{ backgroundColor: 'rgb(209, 233, 215)', color: '#3d773c' }}
                    >
                      {capitalize(candidateStatus)}
                    </p>
                  ) : (
                    <p
                      className='candidate-edit__status'
                      style={{ backgroundColor: 'rgb(255, 208, 206)', color: '#dc0b0b' }}
                    >
                      {capitalize(candidateStatus)}
                    </p>
                  )}
                </div>
              </Col>
            )
          })}
        </Col>
        <ConfirmationModal
          centered
          visible={isShowConfirmModal}
          okText='Yes'
          cancelText='No'
          onOK={() => {
            setIsShowConfirmModal(false)

            if (confirmType === CONFIRM_TYPE.submitForm) {
              return form.submit()
            } else if (confirmType === CONFIRM_TYPE.changeStatusToInterviewing) {
              handleChangeStatusToInterviewing(positionIdToUpdateStatus)
            } else if (confirmType === CONFIRM_TYPE.changeStatusToOnboarding) {
              handleChangeStatusToOnboarding(positionIdToUpdateStatus)
            } else {
              handleChangeStatusToRejected(positionIdToUpdateStatus)
            }
          }}
          onCancel={() => setIsShowConfirmModal(false)}
        >
          {confirmType === CONFIRM_TYPE.submitForm
            ? "Are you sure to update candidate's information?"
            : confirmType === CONFIRM_TYPE.changeStatusToInterviewing
            ? "Are you sure to update candidate's status to Interviewing?"
            : confirmType === CONFIRM_TYPE.changeStatusToOnboarding
            ? "Are you sure to update candidate's status to Onboarding?"
            : "Are you sure to update candidate's status to Rejected?"}
        </ConfirmationModal>
      </Form>
    </Spin>
  )
}

export default CandidateDetail
