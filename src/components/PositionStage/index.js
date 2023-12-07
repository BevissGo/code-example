import React from 'react'
import { useDrop } from 'react-dnd'
import { Menu, Dropdown } from 'antd'

import CandidateCard from 'components/Card/Candidate'
import { ItemTypes } from 'pages/CandidatesPage/Group/constants'
import { ReactComponent as IconTrashBin } from 'assets/images/dashboard/trash_bin.svg'
import { ReactComponent as IconPencil } from 'assets/images/dashboard/clarity_edit-solid.svg'
import { ReactComponent as IconVerticalMenu } from 'assets/images/dashboard/menu-horizontal.svg'
import { ReactComponent as IconNewStage } from 'assets/images/dashboard/ic_baseline-create-new-folder.svg'

import './style.scss'

const PositionStage = ({ stage, handleDnD, handleDeleteStage }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.CANDIDATE,
    drop: monitor => handleDnD(monitor, stage),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  const menu = (
    <Menu>
      <Menu.Item key='0'>
        <div className='stage-options'>
          <IconPencil />
          <span className='option'>Edit</span>
        </div>
      </Menu.Item>
      <Menu.Item key='1'>
        <div className='stage-options' onClick={handleDeleteStage}>
          <IconTrashBin />
          <span className='option'>Delete</span>
        </div>
      </Menu.Item>
      <Menu.Item key='2'>
        <div className='stage-options'>
          <IconNewStage />
          <span className='option'>New stage</span>
        </div>
      </Menu.Item>
    </Menu>
  )

  return (
    <div className='stage__container' ref={drop}>
      <div className='stage__header'>
        <div className='title'>
          {stage.name}
        </div>
        <div className='options'>
          <Dropdown overlay={menu} trigger={['click']} placement='bottomRight'>
            <span onClick={e => e.preventDefault()}>
              <IconVerticalMenu />
            </span>
          </Dropdown>
        </div>
      </div>
      <div className='stage__body'>
        {stage.candidates.map((candidate) => (
          <div className='candidate__wrapper' key={candidate.id}>
            <CandidateCard candidate={candidate} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PositionStage