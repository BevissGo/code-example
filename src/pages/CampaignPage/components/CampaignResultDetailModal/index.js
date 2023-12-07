import React from 'react'
import { Avatar, Col, Row } from 'antd'
import { capitalize, groupBy, round } from 'lodash'

import CustomModal from 'components/CustomModal'
import { formatDate } from 'utils/formatDate'

import ResultPassAndFail from '../ResultPassAndFail'

import ResultCard from './ResultCard'

import './style.scss'

const CampaignResultDetailModal = ({
  isOpenCandidateResultDetail,
  selectedCandidate,
  positionDetail,
  customTestList,
  handleCloseCampaignResultDetailModal,
}) => {
  const { iqResult, eqResult, brainResult, discResult, customTestResult } = selectedCandidate
  const customTestListGroupByTestId = groupBy(customTestList, 'testId.Id')

  const iqContents = [
    {
      label: 'Correct answers',
      value: `${iqResult?.correct}/25`,
    },
    {
      label: 'Finished time',
      value: iqResult?.finishedTime,
    },
    {
      label: 'Score',
      value: iqResult?.score,
    },
    {
      label: 'Rank',
      value: iqResult?.rank,
    },
  ]

  const eqContents = [
    {
      label: 'Score',
      value: eqResult?.score,
    },
    {
      label: 'Finished time',
      value: eqResult?.finishedTime,
    },
    {
      label: 'Rank',
      value: capitalize(eqResult?.rank),
    },
  ]

  const discContents = [
    {
      label: 'Profile pattern',
      value: discResult?.profilePattern.name,
    },
    {
      label: 'Finished time',
      value: discResult?.finishedTime,
    },
  ]

  const brainContents = [
    {
      label: 'Side of brain',
      value: brainResult?.sideOfBrain === 'R' ? 'Right' : 'Left',
    },
    {
      label: 'Finished time',
      value: brainResult?.finishedTime,
    },
  ]

  const formatTimeCandidateApply = 'MMM DD YYYY, hh:mmA'

  return (
    <CustomModal isOpen={isOpenCandidateResultDetail} handleCloseModal={handleCloseCampaignResultDetailModal}>
      <div className='campaign-result-detail-modal'>
        <Row className='campaign-result-detail-modal__header'>
          <Avatar size={50} src={selectedCandidate?.user?.avatar ?? '--'} />
          <Col style={{ paddingLeft: 10 }}>
            <Row className='campaign-result-detail-modal__name'>{selectedCandidate?.user?.name ?? '--'}</Row>
            <Row className='campaign-result-detail-modal__email'>{selectedCandidate?.user?.email ?? '--'}</Row>
          </Col>
        </Row>

        <div className='campaign-result-detail-modal__test-list-result'>
          <Row gutter={[20, 20]}>
            {!!iqResult && (
              <Col span={24}>
                <ResultCard
                  title={`IQ (≥ ${positionDetail?.iqScore ?? 0})`}
                  time={formatDate(iqResult.createdAt, { format: formatTimeCandidateApply })}
                  passResult={<ResultPassAndFail isPass={iqResult.pass} />}
                  contents={iqContents}
                />
              </Col>
            )}
            {!!eqResult && (
              <Col span={24}>
                <ResultCard
                  title={`EQ (>= ${positionDetail?.eqScore?.min ?? 0})`}
                  time={formatDate(eqResult.createdAt, { format: formatTimeCandidateApply })}
                  passResult={<ResultPassAndFail isPass={eqResult.pass} />}
                  contents={eqContents}
                />
              </Col>
            )}
            {!!discResult && (
              <Col span={24}>
                <ResultCard
                  title='Disc Test'
                  time={formatDate(discResult.createdAt, { format: formatTimeCandidateApply })}
                  passResult={<ResultPassAndFail isPass={discResult.pass} />}
                  contents={discContents}
                />
              </Col>
            )}
            {!!brainResult && (
              <Col span={24}>
                <ResultCard
                  title='Brain Test'
                  time={formatDate(brainResult.createdAt, { format: formatTimeCandidateApply })}
                  passResult={<ResultPassAndFail isPass={brainResult.pass} />}
                  contents={brainContents}
                />
              </Col>
            )}
            {!!customTestResult &&
              customTestResult.map((result, index) => {
                const contents = [
                  {
                    label: 'Correct answers',
                    value: `${result.correct}/${result.questionAmount}`,
                  },
                  {
                    label: 'Finished time',
                    value: result.finishedTime,
                  },
                  {
                    label: 'Score',
                    value: round((result.correct / result.questionAmount) * 100),
                  },
                ]

                return (
                  <Col key={index} span={24}>
                    <ResultCard
                      title={customTestListGroupByTestId[result.testId][0].testId.testName}
                      time={formatDate(result.createdAt, { format: formatTimeCandidateApply })}
                      passResult={<ResultPassAndFail isPass={result.correct >= result.fitCorrect} />}
                      contents={contents}
                    />
                  </Col>
                )
              })}
          </Row>
        </div>
      </div>
    </CustomModal>
  )
}

export default CampaignResultDetailModal
