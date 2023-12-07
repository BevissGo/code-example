import React, { useState, useRef, useEffect, memo } from 'react'

import { ReactComponent as TimerIcon } from 'assets/images/dashboard/timer-icon.svg'

import './style.scss'

const CountdownTimer = memo(({ testTime, onChangeTimeLeft, onTimedOut }) => {
  const [timer, setTimer] = useState({
    minutes: '00',
    seconds: '00',
  })
  const timerRef = useRef(null)

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date())
    const seconds = Math.floor((total / 1000) % 60)
    const hours = Math.floor((total / 1000 / 60 / 60) % 24)
    const minutes = Math.floor((total / 1000 / 60) % 60) + hours * 60

    return {
      total,
      hours,
      minutes,
      seconds,
        }
  }

  const startTimer = (e) => {
    const { total, minutes, seconds } = getTimeRemaining(e)
    if (total >= 0) {
      const newTime = {
        minutes: minutes,
        seconds: seconds,
      }
      setTimer(newTime)

      if (onChangeTimeLeft) onChangeTimeLeft(newTime)
      // setTimer({ minutes: minutes > 9 ? minutes : '0' + minutes, seconds: seconds > 9 ? seconds : '0' + seconds })
    } else {
      if (onTimedOut) onTimedOut()
      clearInterval(timerRef.current)
    }
  }

  const clearTimer = (e) => {
    const { minutes, seconds } = getTimeRemaining(e)
    setTimer({
      minutes: minutes,
      seconds: seconds,
    })

    if (timerRef.current) clearInterval(timerRef.current)
    const id = setInterval(() => {
      startTimer(e)
    }, 1000)
    timerRef.current = id
  }

  const getDeadTime = (limitedSeconds) => {
    let deadline = new Date()

    deadline.setSeconds(deadline.getSeconds() + limitedSeconds)
    return deadline
  }

  useEffect(() => {
    clearTimer(getDeadTime(testTime))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testTime])

  const getRemainingTimeText = () => {
    let returnText = `${timer.minutes} phút ${timer.seconds} giây`
    return timer.minutes === 0 && timer.seconds === 0 ? returnText : 'Còn ' + returnText
  }

  return (
    <div className='countdown-timer'>
      <TimerIcon />
      <span
        className={`countdown-timer__time-left ${timer.minutes === 0 ? 'countdown-timer__time-left--red' : ''}`}
      >{getRemainingTimeText()}</span>
    </div>
  )
})

export default CountdownTimer
