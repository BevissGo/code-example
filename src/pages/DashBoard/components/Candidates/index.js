import React  from 'react'
import { Pagination } from 'antd'
import { useDispatch } from 'react-redux'

import { DATA_CANDIDATE_MOCK } from 'pages/DashBoard/constants'
import { fetchDashBoardCandidate } from 'redux/services/dashboard'

import './style.scss'

const CandidateComponent = ({pagesize, data = DATA_CANDIDATE_MOCK, filters = {}, contentPage = {}}) => {
  const dispatch = useDispatch()
  const [page, setPage] = React.useState(filters.currentPage)
  const [avatarObj, setAvtObj] = React.useState({})
  const onChangePaginate = (value) => {
    setPage(value)
    dispatch(fetchDashBoardCandidate({ ...filters, currentPage: value}))
  }

  return (
    <div className='container-candidate'>
      {data.length < 1 ? (
        <div>{contentPage.noResult}</div>
      ): (
        <>
          {(data || []).map((item) => {
            const candidate = item?.candidate || {}
            return (
              <div className='content-candidate' key={item?._id}>
                <div className='content-candidate__candidate-item'>
                  <div className='flex-row-candidate' style={{alignItems: 'center'}}>
                    <img onError={() => {
                      setAvtObj({
                        ...avatarObj,
                        [item?._id]: '/images/avt1.png'
                      })
                    }} src={avatarObj[item?._id] || candidate.avatar} className='avt-style'/>
                    <div>
                      <div className='text-12'>{contentPage.cardCandidate.name}</div>
                      <div className='text-20'>{candidate.name}</div>
                    </div>
                  </div>
                </div>
                <div className='content-candidate__candidate-item'>
                  <div className='text-12'>{contentPage.cardCandidate.positionRecruitment}</div>
                  <div className='text-15' style={{ marginBottom: 10}}>{item?.position}</div>
                  <div className='flex-row-candidate'>
                    <div style={{marginRight: 8}}>
                      <div className='text-12'>{contentPage.cardCandidate.discResult}</div>
                      <div className='text-12'>{item.report?.profile_pattern || 'no result'}</div>
                    </div>
                    <div>
                      <div className='text-12'>{contentPage.cardCandidate.iqResult}</div>
                      <div className='text-12 text-center'>{item.iq_score || 'no result'}</div>
                    </div>
                  </div>
                </div>
                <div className='content-candidate__candidate-item'>
                  <div>
                    <div className='text-12'>{contentPage.cardCandidate.email}</div>
                    <div className='text-15' style={{color: '#4F2108'}}>{candidate.email}</div>
                  </div>
                  <div>
                    <div className='text-12' style={{marginTop: 10}}>{contentPage.cardCandidate.facebookProfile}</div>
                      <a
                      className='text-15'
                      href={candidate.facebook_profile_url}
                      target='_blank'
                      rel='noreferrer'
                      style={{color: '#4F2108', textDecorationLine: 'underline'}}
                      >
                        {candidate.facebook_profile_url}
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
          <Pagination
            onChange={onChangePaginate}
            defaultCurrent={page}
            pageSize={10}
            total={pagesize}
          />
      </>
      )}
    </div>
  )
}

export default CandidateComponent
