import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ko';

import useModal from '@/components/Common/Modal/useModal';
import FamilyCalendarModal from './FamilyCalendarModal';
import {
  getComponents,
  getSettingProps,
  customDayPropGetter,
  messages,
} from '@/components/Common/Calendar/CalendarSettingProps';
import { stringToColor } from '@/utils/calculators';

const localizer = momentLocalizer(moment);

const FamilyCalendar = () => {
  const [eventList, setEventList] = useState([]);
  const [modalData, setModalData] = useState(null);
  const { isModalVisible, openModal, closeModal } = useModal();

  useEffect(() => {
    const getEventList = () => {
      // 서버와 통신해서 다음 데이터를 받아온다고 가정한다.
      const rawData = {
        patient_name: '김환자',
        diagnosis: '중풍',
        mate_name: '박간병',
        start_date: '2023-12-18',
        end_date: '2024-2-1',
        weekdays: ['월', '목', '토', '일'],
        start_time: '09:00',
        end_time: '17:00',
      };

      let currentStartDate = moment(`${rawData.start_date} ${rawData.start_time}`);
      let currentEndDate = moment(`${rawData.start_date} ${rawData.end_time}`);
      const endDate = moment(`${rawData.end_date} ${rawData.end_time}`);
      const { weekdays } = rawData;

      const events = [];

      // 주어진 범위 내의 출근 요일에 해당하는 날짜를 별개의 이벤트로 추가
      while (currentEndDate.isSameOrBefore(endDate, 'day')) {
        const dayOfWeek = moment(currentEndDate).format('ddd');
        if (weekdays.includes(dayOfWeek)) {
          const event = {
            title: `${rawData.patient_name} 님 (${rawData.diagnosis})`,
            mate: `간병인 ${rawData.mate_name} 님`,
            start: new Date(currentStartDate),
            end: new Date(currentEndDate),
            color: stringToColor(rawData.patient_name + rawData.diagnosis + rawData.mate_name),
          };
          events.push(event);
        }
        currentStartDate = currentStartDate.add(1, 'day');
        currentEndDate = currentEndDate.add(1, 'day');
      }

      setEventList(events);
    };

    getEventList();
  }, []);

  return (
    <>
      <Calendar
        className='Calendar'
        localizer={localizer}
        events={eventList}
        culture='ko-KR'
        startAccessor='start'
        endAccessor='end'
        views={['month', 'week', 'agenda']}
        timeslots={2} // step={30}와 동일
        messages={messages}
        dayPropGetter={customDayPropGetter}
        {...getComponents(openModal, setModalData)}
        {...getSettingProps()}
      />
      {isModalVisible && <FamilyCalendarModal modalData={modalData} closeModal={closeModal} />}
    </>
  );
};

export default FamilyCalendar;
