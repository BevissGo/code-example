import React, { useRef, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useQuery } from '@tanstack/react-query'
import { Spin } from 'antd'
import { uniq } from 'lodash'
import dayjs from 'dayjs'

import i18nVN from 'i18n/locales/vn'
import CustomTable from 'components/CustomTable'
import TutorialTour from 'containers/Tour/Tutorial'
import DashboardBar from 'pages/DashBoard/containers/DashboardBar'
import { getAllCandidates } from 'api/business/userPositionCampaign.api'
import { toastifyNotify } from 'helpers'

import './style.scss'

function CandidateList() {
  const {
    pages: {
      business: {
        dashboard: { candidate: contentPage },
      },
    },
  } = i18nVN.src

  const [data, setData] = useState([])

  const candidateListRef = useRef(null)

  const history = useHistory()

  const { data: candidateList, isFetching: candidateListFetching } = useQuery(
    ['GET_CANDIDATE_LIST'],
    () => getAllCandidates(),
    {
      onError: (error) => {
        toastifyNotify('error', error?.message ?? 'Failed to fetch candidate list.')
      },
      initialData: [],
    },
  )

  useEffect(() => {
    const candidateData = []
    let candidateIdList = candidateList.map((candidate) => candidate.user.userId.Id)
    candidateIdList = uniq(candidateIdList)

    let key = 0

    for (const candidateId of candidateIdList) {
      const filteredCandidates = candidateList.filter((candidate) => {
        return candidate.user.userId.Id === candidateId && !candidate.user.campaignId?.cancelled
      })

      const name = filteredCandidates[0]?.user.userId?.name
      const age = dayjs(new Date()).diff(filteredCandidates[0]?.user.userId?.dob, 'y')
      const phone = filteredCandidates[0]?.user.userId?.phone
      const dateApplied = dayjs(filteredCandidates[0]?.user.createdAt).format('DD/MM/YYYY')
      const [positions, campaignNameList, iqScores, eqScores, discScores, brainScores, statusList] =
        filteredCandidates.reduce(
          (acc, candidate) => {
            const { positionId, campaignId, iqScoreId, eqScoreId, brainScoreId, status } = candidate.user

            acc[0].push(positionId?.name)
            acc[1].push(campaignId?.campaignName)
            acc[2].push(iqScoreId?.score ?? null)
            acc[3].push(eqScoreId?.score ?? null)
            acc[4].push(candidate.discScore ?? null)
            acc[5].push(brainScoreId?.sideOfBrain ?? null)
            acc[6].push(status)

            return acc
          },
          [[], [], [], [], [], [], []],
        )
      const brainScore = brainScores?.find((score) => !!score) ?? '--'
      const uniqStatusList = uniq(statusList)
      const status = uniqStatusList.includes('onboarding')
        ? 'Onboarding'
        : uniqStatusList.includes('interviewing')
        ? 'Interviewing'
        : uniqStatusList.length === 1 && uniqStatusList[0] === 'rejected'
        ? 'Rejected'
        : 'Applied'

      candidateData.push({
        key,
        name: name,
        age: age ? age : '--',
        phone: phone ?? '--',
        dateApplied: dateApplied,
        positions: uniq([...positions]).join(', '),
        campaignNameList: uniq([...campaignNameList]).join(', '),
        iqScore: iqScores?.find((score) => !!score) ?? '--',
        eqScore: eqScores?.find((score) => !!score) ?? '--',
        discScore: discScores?.find((score) => !!score) ?? '--',
        brainScore: brainScore === 'all' ? 'All' : brainScore === 'L' ? 'Left' : brainScore === 'R' ? 'Right' : '--',
        status,
        userId: filteredCandidates[0]?.user.userId.Id,
      })

      key += 1
    }

    setData(candidateData)
  }, [candidateList])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <p className='candidate-list__column-content--bold'>{text}</p>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Phone number',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Date Applied',
      dataIndex: 'dateApplied',
      key: 'dateApplied',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Position',
      dataIndex: 'positions',
      key: 'position',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Campaign',
      dataIndex: 'campaignNameList',
      key: 'campaign',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'DiSC',
      dataIndex: 'discScore',
      key: 'discScore',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Brain',
      dataIndex: 'brainScore',
      key: 'brainScore',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'IQ',
      dataIndex: 'iqScore',
      key: 'iqScore',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'EQ',
      dataIndex: 'eqScore',
      key: 'eqScore',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => <p>{text}</p>,
    },
  ]

  const handleRowClick = (record) => {
    const candidate = data[record.key]

    history.push(`candidates/${candidate.userId}`)
  }

  return (
    <div className='candidate-list'>
      <DashboardBar title={contentPage.title} />
      {candidateListFetching ? (
        <Spin />
      ) : (
        <div className='candidate-list__wrapper'>
          <CustomTable
            tableRef={candidateListRef}
            columns={columns}
            dataSource={data}
            handleRowClick={handleRowClick}
          />

          <TutorialTour
            steps={[
              {
                title: 'Candidate list',
                description: 'You can find all necessary data about your candidates in Candidate module.',
                mask: { style: { pointerEvents: 'auto' } },
                target: () => candidateListRef.current,
              },
              {
                title: 'Congratulation',
                description:
                  'Congratulations on going through all the instructions. Hope you have a great experience with our website',
                mask: { style: { pointerEvents: 'auto' } },
                target: null,
              },
            ]}
          />
        </div>
      )}
    </div>
  )
}

export default CandidateList
