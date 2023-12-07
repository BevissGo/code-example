import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { DownloadOutlined, EditOutlined, FacebookOutlined, LeftOutlined } from '@ant-design/icons'
import { Col, Form, Row, Spin } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { capitalize, uniq } from 'lodash'
import dayjs from 'dayjs'

import i18nVN from 'i18n/locales/vn'
import ButtonAntd from 'components/Button/Antd'
import InputAntd from 'components/Input/InputAntd'
import ConfirmationModal from 'components/Modal/ConfirmModal'
import { calcTotalResultPassedOrFailed, toastifyNotify } from 'helpers'
import DashboardBar from 'pages/DashBoard/containers/DashboardBar'
import { getByCandidateId } from 'api/business/userPositionCampaign.api'
import instance from 'api'

import './style.scss'

function CandidateDetail() {
  const {
    pages: {
      business: {
        dashboard: { candidate: contentPage },
      },
    },
  } = i18nVN.src

  const CONFIRM_TYPE = {
    changeStatusToInterviewing: 'changeStatusToInterviewing',
    changeStatusToOnboarding: 'changeStatusToOnboarding',
    changeStatusToRejected: 'changeStatusToRejected',
  }

  const [candidates, setCandidates] = useState([])
  const [facebook, setFacebook] = useState()
  const [positionList, setPositionList] = useState([])
  const [candidateByPositionCampaignList, setCandidateByPositionCampaignList] = useState([])
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false)
  const [confirmType, setConfirmType] = useState()
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
    setFacebook(candidates[0]?.user.userId?.facebookProfileUrl)
    setPositionList(positions?.split(', '))
    setCandidateByPositionCampaignList(candidates?.map((e) => e.user))

    form.setFieldsValue({
      name: name ?? '--',
      dob: dob ? dayjs(dob).format('DD/MM/YYYY') : '--',
      phone: phone ?? '--',
      position: positions ?? '--',
      iqScore: iqScore ?? '--',
      eqScore: eqScore ?? '--',
      discScore: discScore ?? '--',
      brainScore: brainScore ?? '--',
      email: email ?? '--',
    })
  }, [form, candidates])

  const handleBack = () => {
    history.push('/business/candidates')
  }

  const handleEdit = () => {
    history.push(`/business/candidates/${userId}/edit`)
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
        title='Edit'
        style={{
          marginLeft: 12,
        }}
        icon={<EditOutlined style={{ fontSize: '14px', color: 'white' }} theme='outlined' />}
        onButtonClick={handleEdit}
        spacingRight={true}
      />
    </>
  )

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
    <Spin spinning={getCandidateByIdLoading}>
      <DashboardBar title={contentPage.title} rightItem={rightDashboardItems} />
      <Form form={form} layout='vertical'>
        <Col className='candidate-detail' span={24}>
          <div className='candidate-detail__wrapper'>
            <div className='candidate-detail__title'>Personal info</div>
            <Row gutter={24}>
              <Col span={4}>
                <Form.Item name='name' label='Name'>
                  <InputAntd style={{ cursor: 'default' }} disabled={true} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name='dob' label='Date of birth'>
                  <InputAntd style={{ cursor: 'default' }} disabled={true} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name='phone' label='Phone number'>
                  <InputAntd style={{ cursor: 'default' }} disabled={true} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name='email' label='Email'>
                  <InputAntd style={{ cursor: 'default' }} disabled={true} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name='facebook' label='Facebook'>
                  {facebook ? (
                    <FacebookOutlined
                      style={{ fontSize: '40px', color: '#0674e7' }}
                      onClick={() => window.open(facebook)}
                    />
                  ) : (
                    'None'
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className='candidate-detail__wrapper'>
            <div className='candidate-detail__title'>Test scores</div>
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
              (candidate) => candidate.positionId.name === position && !candidate.campaignId.cancelled,
            )

            const positionId = candidateByPositionList[0]?.positionId.Id

            const candidateStatus = candidateByPositionList[0]?.status

            return (
              <Col key={positionIndex} className='candidate-detail__card-wrapper'>
                <Row justify='space-between' align='bottom'>
                  <Col>
                    <div className='candidate-detail__card-title'>{position}</div>
                  </Col>
                </Row>
                {candidateByPositionList?.map((candidate, candidateIndex) => {
                  const totalResultPassedOrFailed = calcTotalResultPassedOrFailed(candidate)

                  return (
                    <Col key={candidateIndex} className='candidate-detail__card-wrapper'>
                      <Row justify='space-between' align='bottom'>
                        <Col>
                          <div className='candidate-detail__card-title'>{candidate.campaignId.campaignName}</div>
                        </Col>
                      </Row>
                      <div className='candidate-detail__wrapper' style={{ marginTop: -30 }}>
                        <div className='candidate-detail__title'>Result</div>
                        <Col key={candidateIndex}>
                          <Row gutter={24} style={{ marginBottom: 12 }}>
                            <Col span={22}>
                              {!candidate.customTestScoreId?.length && (
                                <p className='candidate-detail__custom-test-name'>No custom test</p>
                              )}
                              <Row gutter={24}>
                                {candidate.customTestScoreId?.map((customTest, customTestIndex) => {
                                  return (
                                    <Col span={4} key={customTestIndex}>
                                      <p className='candidate-detail__custom-test-name'>
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
                              <Col className='candidate-detail__custom-test-result'>{totalResultPassedOrFailed}</Col>
                            ) : (
                              <Col
                                className='candidate-detail__custom-test-result'
                                style={{ backgroundColor: 'rgb(255, 208, 206)', color: '#dc0b0b' }}
                              >
                                {totalResultPassedOrFailed}
                              </Col>
                            )}
                          </Row>
                        </Col>
                      </div>
                      <div className='candidate-detail__wrapper'>
                        <div className='candidate-detail__title'>Licenses and Docs</div>
                        <Col key={candidateIndex}>
                          <Row gutter={24}>
                            <Col span={4}>
                              <Form.Item>
                                CV:
                                {candidate.attachCv ? (
                                  <DownloadOutlined onClick={() => window.open(candidate.attachCv.path)} />
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
                <div className='candidate-detail__wrapper'>
                  <div className='candidate-detail__title'>Change Status</div>
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

            if (confirmType === CONFIRM_TYPE.changeStatusToInterviewing) {
              handleChangeStatusToInterviewing(positionIdToUpdateStatus)
            } else if (confirmType === CONFIRM_TYPE.changeStatusToOnboarding) {
              handleChangeStatusToOnboarding(positionIdToUpdateStatus)
            } else {
              handleChangeStatusToRejected(positionIdToUpdateStatus)
            }
          }}
          onCancel={() => setIsShowConfirmModal(false)}
        >
          {confirmType === CONFIRM_TYPE.changeStatusToInterviewing
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
