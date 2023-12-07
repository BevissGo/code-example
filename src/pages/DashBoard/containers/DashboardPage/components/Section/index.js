import React from 'react'
import { DatePicker } from 'antd'

import ButtonAntd from 'components/Button/Antd'
import CustomSelect from 'components/CustomSelect'
import CustomMultipleSelect from 'components/CustomMultipleSelect'

import './style.scss'

const { RangePicker } = DatePicker

function Section({
  title,
  campaignOptions,
  positionOptions,
  yearOptions,
  selectedYear,
  firstDay,
  lastDay,
  hasCampaign = true,
  hasPosition = true,
  hasDatePicker = true,
  hasFilterYear = true,
  handleChangeDate,
  handleSelectCampaigns,
  handleSelectPositions,
  handleResetDateRange,
  handleSelectYear,
  children,
}) {
  return (
    <div className='section'>
      <div className='section__header'>
        <div className='section__title'>{title}</div>
        <div style={{ display: 'flex', gap: 5 }}>
          {hasCampaign && (
            <CustomMultipleSelect
              placeholder='Select campaigns'
              options={campaignOptions}
              onChange={handleSelectCampaigns}
            />
          )}
          {hasPosition && (
            <CustomMultipleSelect
              placeholder='Select positions'
              options={positionOptions}
              onChange={handleSelectPositions}
            />
          )}
          {hasDatePicker && (
            <RangePicker
              value={[firstDay, lastDay]}
              style={{ width: 240, marginRight: 8 }}
              allowClear={false}
              renderExtraFooter={() => (
                <div className='section__footer-range-picker'>
                  <ButtonAntd title='Reset' onButtonClick={handleResetDateRange} />
                </div>
              )}
              onChange={handleChangeDate}
            />
          )}
          {hasFilterYear && (
            <CustomSelect
              value={selectedYear}
              size='large'
              style={{ width: 200 }}
              placeholder='Select year'
              options={yearOptions}
              onChange={handleSelectYear}
            />
          )}
        </div>
      </div>
      <div className='section__body'>{children}</div>
    </div>
  )
}

export default Section
