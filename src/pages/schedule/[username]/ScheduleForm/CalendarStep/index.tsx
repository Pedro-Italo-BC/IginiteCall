import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Calendar } from '../../../../../components/Calendar'
import { api } from '../../../../../lib/axios'
import {
  Container,
  TimePiker,
  TimePikerHeader,
  TimePikerItem,
  TimePikerList,
} from './styles'

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
}

export function CanlendarStep({ onSelectDateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const router = useRouter()
  const username = String(router.query.username)

  const isDateSelected = !!selectedDate

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null

  const describedDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availability } = useQuery<Availability>(
    ['availability', selectedDateWithoutTime],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      })

      return response.data
    },

    {
      enabled: !!selectedDate,
    },
  )

  function handleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()

    onSelectDateTime(dateWithTime)
  }

  return (
    <Container isTimePikerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimePiker>
          <TimePikerHeader>
            {weekDay} <span>{describedDate}</span>
          </TimePikerHeader>

          <TimePikerList>
            {availability?.possibleTimes.map((hour) => {
              return (
                <TimePikerItem
                  key={hour}
                  disabled={!availability.availableTimes.includes(hour)}
                  onClick={() => handleSelectTime(hour)}
                >
                  {String(hour).padStart(2, '0')}:00h
                </TimePikerItem>
              )
            })}
          </TimePikerList>
        </TimePiker>
      )}
    </Container>
  )
}