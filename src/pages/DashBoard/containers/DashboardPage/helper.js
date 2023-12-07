import dayjs from 'dayjs'
import { sortedUniq, capitalize, uniq, round, groupBy } from 'lodash'

import { checkCampaignStatus } from 'pages/CampaignPage/helpers'

const calcChangeRate = (prevChange, afterChange) => {
  if (prevChange === 0) {
    return '--'
  }

  return round(((afterChange - prevChange) / prevChange) * 100, 1)
}

export const calcChangeRateWithTimeOption = (timeOption, element, elementWithTimeFilter) => {
  switch (timeOption) {
    case 'allTime':
      return null
    case 'thisWeek':
    case 'thisMonth':
    case 'custom':
      return calcChangeRate(elementWithTimeFilter.length, element.length)
    default:
  }
}

export const formatTimeToFilter = (day) => {
  return day.set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0).toISOString()
}

export const calcRateOfCampaignStatus = (campaignList) => {
  const CAMPAIGN_STATUS = ['processing', 'pending', 'expired']

  const result = []

  const numberOfCancelledCampaigns = campaignList?.filter((campaign) => campaign.cancelled)?.length

  for (const status of CAMPAIGN_STATUS) {
    const numberOfStatus = campaignList?.filter(
      (campaign) => !campaign.cancelled && checkCampaignStatus(campaign.startDate, campaign.endDate) === status,
    )?.length

    result.push({ status: capitalize(status), value: numberOfStatus })
  }

  result.push({ status: 'Cancelled', value: numberOfCancelledCampaigns })

  return result
}

export const calcRateOfCandidateStatus = (candidateList, selectedYear) => {
  const CANDIDATE_STATUS = ['applied', 'interviewing', 'onboarding', 'rejected']

  const result = []
  let total = 0

  for (const status of CANDIDATE_STATUS) {
    const numberOfStatus = candidateList.filter((candidate) => {
      if (selectedYear !== 'alltime') {
        return candidate.status === status && dayjs(candidate.createdAt).format('YYYY') === selectedYear
      } else {
        return candidate.status === status
      }
    }).length

    total += numberOfStatus

    result.push({ status: capitalize(status), value: numberOfStatus })
  }

  return { result, total }
}

export const sortDate = (date1, date2) => {
  const [month1, year1] = date1.split('/')
  const [month2, year2] = date2.split('/')

  // Convert month string to numeric representation for comparison
  const monthToNumber = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  }

  const monthNumber1 = monthToNumber[month1]
  const monthNumber2 = monthToNumber[month2]

  if (year1 !== year2) {
    return year1 - year2
  }

  if (monthNumber1 !== monthNumber2) {
    return monthNumber1 - monthNumber2
  }

  return 0
}

export const convertFromCandidatesToOnboardAndRejectOvertime = (candidates, selectedYear) => {
  const onboardingAndRejectedData = []
  let availableMonth = []
  let availableYear = []

  candidates.forEach((candidate) => {
    if (selectedYear === 'alltime') {
      availableMonth.push(dayjs(candidate.createdAt).format('MMM/YY'))
    } else {
      if (dayjs(candidate.createdAt).format('YYYY') === selectedYear) {
        availableMonth.push(dayjs(candidate.createdAt).format('MMM/YY'))
      }
    }

    availableYear.push(dayjs(candidate.createdAt).format('YYYY'))
  })

  availableMonth = uniq(availableMonth)
  availableMonth.sort(sortDate)
  availableYear = sortedUniq(availableYear)
  availableYear = availableYear?.map((year) => ({
    value: year,
    label: year,
  }))

  availableYear = [{ value: 'alltime', label: 'All time' }, ...availableYear]

  for (const month of availableMonth) {
    const totalQuantity = candidates?.filter(
      (candidate) => dayjs(candidate.createdAt).format('MMM/YY') === month,
    )?.length

    const onboardingQuantity = candidates?.filter(
      (candidate) => dayjs(candidate.createdAt).format('MMM/YY') === month && candidate.status === 'onboarding',
    )?.length

    const rejectedQuantity = candidates?.filter(
      (candidate) => dayjs(candidate.createdAt).format('MMM/YY') === month && candidate.status === 'rejected',
    )?.length

    onboardingAndRejectedData.push({
      date: month,
      type: 'Total',
      quantity: totalQuantity,
    })

    onboardingAndRejectedData.push({
      date: month,
      type: 'Onboarding',
      quantity: onboardingQuantity,
    })

    onboardingAndRejectedData.push({
      date: month,
      type: 'Rejected',
      quantity: rejectedQuantity,
    })
  }

  return { data: onboardingAndRejectedData, yearList: availableYear }
}

export const convertFromCandidatesToCandidatesFilteredWithStatus = (campaigns, candidates) => {
  const candidatesFilteredWithStatusData = []

  for (const campaign of campaigns) {
    candidatesFilteredWithStatusData.push({
      name: campaign.campaignName,
      type: 'Interviewing',
      numberOfCandidates: candidates?.filter((e) => e.campaignId?.Id === campaign.Id && e.status === 'interviewing')
        ?.length,
    })

    candidatesFilteredWithStatusData.push({
      name: campaign.campaignName,
      type: 'Applied',
      numberOfCandidates: candidates?.filter((e) => e.campaignId?.Id === campaign.Id && e.status === 'applied')?.length,
    })

    candidatesFilteredWithStatusData.push({
      name: campaign.campaignName,
      type: 'Onboarding',
      numberOfCandidates: candidates?.filter((e) => e.campaignId?.Id === campaign.Id && e.status === 'onboarding')
        ?.length,
    })

    candidatesFilteredWithStatusData.push({
      name: campaign.campaignName,
      type: 'Rejected',
      numberOfCandidates: candidates?.filter((e) => e.campaignId?.Id === campaign.Id && e.status === 'rejected')
        ?.length,
    })
  }

  return candidatesFilteredWithStatusData
}

export const convertToComparisonPassedFailedData = (customTestList, customTestScoreList) => {
  const comparisonPassedAndFailData = []

  const testListWithResult = customTestScoreList?.map((test) => ({
    testId: test.testId.Id,
    result: test.correct >= test.fitCorrect ? 'Passed' : 'Failed',
  }))

  for (const test of customTestList) {
    comparisonPassedAndFailData.push({
      name: test.testName,
      result: 'Fail',
      quantity: testListWithResult?.filter((e) => e.testId === test.Id && e.result === 'Failed')?.length,
    })

    comparisonPassedAndFailData.push({
      name: test.testName,
      result: 'Pass',
      quantity: testListWithResult?.filter((e) => e.testId === test.Id && e.result === 'Passed')?.length,
    })
  }

  return comparisonPassedAndFailData
}

export const convertToTotalPassedAndFailed = (candidates) => {
  const totalPassedAndFailedData = []
  const results = []

  for (const candidate of candidates) {
    let iqResult = 'Passed'
    let eqResult = 'Passed'
    let brainResult = 'Passed'
    let discResult = 'Passed'

    const position = candidate.campaignId.positions.filter((pos) => pos.positionId === candidate.positionId.Id)[0]

    if (candidate.iqScoreId) {
      if (candidate.iqScoreId.score < position.iqScore) {
        iqResult = 'Failed'
      }
    }

    if (candidate.eqScoreId) {
      if (candidate.eqScoreId.score < position.eqScore.min || candidate.eqScoreId.score > position.eqScore.max) {
        eqResult = 'Failed'
      }
    }

    if (candidate.brainScoreId) {
      if (position.brainScore[0] === 'all') {
        brainResult = 'Passed'
      } else if (!position.brainScore.includes(candidate.brainScoreId.sideOfBrain)) {
        brainResult = 'Failed'
      }
    }

    if (candidate.discScoreId) {
      if (position.discScore[0] === 'all') {
        discResult = 'Passed'
      } else if (!position.discScore.includes(candidate.discScoreId.profilePattern.value)) {
        discResult = 'Failed'
      }
    }

    const resultList = candidate.customTestScoreId?.map((result) => result.score >= result.fitCorrect)

    const finalResult = [
      iqResult === 'Passed' ? true : false,
      eqResult === 'Passed' ? true : false,
      brainResult === 'Passed' ? true : false,
      discResult === 'Passed' ? true : false,
      ...resultList,
    ].every(Boolean)

    results.push(finalResult)
  }

  totalPassedAndFailedData.push({
    result: 'Fail',
    quantity: results?.filter((e) => !e)?.length,
  })

  totalPassedAndFailedData.push({
    result: 'Pass',
    quantity: results?.filter((e) => !!e)?.length,
  })

  return totalPassedAndFailedData
}

export const generateDataForCampaignsChart = (campaignWithTimeFilter, campaigns, timeOption) => {
  if (!campaigns.length && !campaignWithTimeFilter.length) {
    return []
  }

  const campaignsWithStatusQuantity = campaigns.reduce(
    (obj, item) => {
      obj[checkCampaignStatus(item.startDate, item.endDate)] += 1

      return obj
    },
    { expired: 0, pending: 0, processing: 0 },
  )

  const campaignsTimeFilterWithStatusQuantity = campaignWithTimeFilter.reduce(
    (obj, item) => {
      obj[checkCampaignStatus(item.startDate, item.endDate)] += 1

      return obj
    },
    { expired: 0, pending: 0, processing: 0 },
  )

  switch (timeOption) {
    case 'thisWeek': {
      return [
        {
          time: 'Last week',
          type: 'Expired',
          totalCampaigns: campaignsTimeFilterWithStatusQuantity.expired,
        },
        {
          time: 'This week',
          type: 'Expired',
          totalCampaigns: campaignsWithStatusQuantity.expired,
        },
        {
          time: 'Last week',
          type: 'Pending',
          totalCampaigns: campaignsTimeFilterWithStatusQuantity.pending,
        },
        {
          time: 'This week',
          type: 'Pending',
          totalCampaigns: campaignsWithStatusQuantity.pending,
        },
        {
          time: 'Last week',
          type: 'Processing',
          totalCampaigns: campaignsTimeFilterWithStatusQuantity.processing,
        },
        {
          time: 'This week',
          type: 'Processing',
          totalCampaigns: campaignsWithStatusQuantity.processing,
        },
      ]
    }
    case 'thisMonth':
    case 'custom': {
      return [
        {
          time: 'Last month',
          type: 'Expired',
          totalCampaigns: campaignsTimeFilterWithStatusQuantity.expired,
        },
        {
          time: 'This month',
          type: 'Expired',
          totalCampaigns: campaignsWithStatusQuantity.expired,
        },
        {
          time: 'Last month',
          type: 'Pending',
          totalCampaigns: campaignsTimeFilterWithStatusQuantity.pending,
        },
        {
          time: 'This month',
          type: 'Pending',
          totalCampaigns: campaignsWithStatusQuantity.pending,
        },
        {
          time: 'Last month',
          type: 'Processing',
          totalCampaigns: campaignsTimeFilterWithStatusQuantity.processing,
        },
        {
          time: 'This month',
          type: 'Processing',
          totalCampaigns: campaignsWithStatusQuantity.processing,
        },
      ]
    }
    default:
  }
}

export const generateDataForCandidatesChart = (campaigns, candidates, candidatesWithTimeFilter, timeOption) => {
  const newCandidatesData = []

  const groupByKey = 'user.campaignId.Id'
  const newCandidates = groupBy(candidates, groupByKey)
  const newCandidatesWithTimeFilter = groupBy(candidatesWithTimeFilter, groupByKey)

  for (const campaign of campaigns) {
    const totalCandidates = newCandidates[campaign.Id]?.length ?? 0
    const totalCandidatesWithTimeFilter = newCandidatesWithTimeFilter[campaign.Id]?.length ?? 0

    switch (timeOption) {
      case 'thisWeek':
        newCandidatesData.push(
          {
            time: 'Last week',
            campaign: campaign.campaignName,
            totalCandidates: totalCandidatesWithTimeFilter,
          },
          {
            time: 'This week',
            campaign: campaign.campaignName,
            totalCandidates,
          },
        )
        break
      case 'thisMonth':
      case 'custom':
        newCandidatesData.push(
          {
            time: 'Last month',
            campaign: campaign.campaignName,
            totalCandidates: totalCandidatesWithTimeFilter,
          },
          {
            time: 'This month',
            campaign: campaign.campaignName,
            totalCandidates,
          },
        )
        break
      default:
    }
  }

  return newCandidatesData
}

export const getCampaignDuration = (
  isLastTimeFilter,
  timeOption,
  customFirstDay,
  customLastDay,
  weekFirstDay,
  weekLastDay,
  monthFirstDay,
  monthLastDay,
) => {
  switch (timeOption) {
    case 'thisWeek':
      return { startDateDuration: weekFirstDay, endDateDuration: weekLastDay }
    case 'thisMonth':
      return { startDateDuration: monthFirstDay, endDateDuration: monthLastDay }
    case 'custom': {
      if (!isLastTimeFilter) {
        return {
          startDateDuration: formatTimeToFilter(customFirstDay),
          endDateDuration: formatTimeToFilter(customLastDay.add(1, 'day')),
        }
      }

      const dateDiff = customLastDay.diff(customFirstDay, 'day')

      if (dateDiff === 6) {
        return {
          startDateDuration: formatTimeToFilter(customFirstDay.subtract(1, 'week')),
          endDateDuration: formatTimeToFilter(customLastDay.subtract(1, 'week').add(1, 'day')),
        }
      }

      return {
        startDateDuration: formatTimeToFilter(customFirstDay.subtract(1, 'month')),
        endDateDuration: formatTimeToFilter(customLastDay.subtract(1, 'month').add(1, 'day')),
      }
    }
    default:
      return {
        startDateDuration: null,
        endDateDuration: null,
      }
  }
}

export const getCandidateDuration = (
  isLastTimeFilter,
  timeOption,
  customFirstDay,
  customLastDay,
  weekFirstDay,
  weekLastDay,
  monthFirstDay,
  monthLastDay,
) => {
  switch (timeOption) {
    case 'thisWeek':
      return { firstDay: weekFirstDay, lastDay: weekLastDay }
    case 'thisMonth':
      return { firstDay: monthFirstDay, lastDay: monthLastDay }
    case 'custom': {
      if (!isLastTimeFilter) {
        return {
          firstDay: formatTimeToFilter(customFirstDay),
          lastDay: formatTimeToFilter(customLastDay.add(1, 'day')),
        }
      }

      const dateDiff = customLastDay.diff(customFirstDay, 'day')

      if (dateDiff === 6) {
        return {
          firstDay: formatTimeToFilter(customFirstDay.subtract(1, 'week')),
          lastDay: formatTimeToFilter(customLastDay.subtract(1, 'week').add(1, 'day')),
        }
      }

      return {
        firstDay: formatTimeToFilter(customFirstDay.subtract(1, 'month')),
        lastDay: formatTimeToFilter(customLastDay.subtract(1, 'month').add(1, 'day')),
      }
    }
    default:
      return { firstDay: null, lastDay: null }
  }
}
