import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import usePatientList from '@/hooks/usePatientList';

import styles from './ReservationForm.module.css';
import { PatientInfo } from './PatientInfo';
import DaumPostcode from '@/components/Common/DaumPostcode';

import TimePicker from '@/utils/TimePicker';
import { calTimeDiff, weekdayDic, countWeekdays } from '@/utils/calculators';

const ReservationForm = () => {
  const navigator = useRouter();

  const [loginId, setLoginId] = useState(null);
  const patientList = usePatientList(loginId);
  const [patientInfo, setPatientInfo] = useState();

  const today = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date()
    .getDate()
    .toString()
    .padStart(2, '0')}`;

  const [formData, setFormData] = useState({
    location: '병원', // 병원 or 집
    start_date: today, // 날짜 형식 YYYY-MM-DD
    end_date: today, // 날짜 형식 YYYY-MM-DD
    wage: '15000',
  });

  const [address, setAddress] = useState({
    postcode: '',
    roadAddress: '',
    jibunAddress: '',
    detailAddress: '',
  });
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [weekdayBoolean, setWeekdayBoolean] = useState([true, true, true, true, true, true, true]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLoginId(JSON.parse(sessionStorage.getItem('login_info'))?.login_id);
    }
  }, []);

  const handlePatientSelectChange = (e) => {
    if (e.target.value === 'add') {
      if (window.confirm('입력된 내용이 초기화됩니다. 환자 추가 페이지로 이동하시겠습니까?')) {
        navigator.push('/family/addpatient');
      }
    } else {
      const selectedPatient = patientList[e.target.value - 1];
      setPatientInfo(selectedPatient);
      setFormData((prevData) => ({
        ...prevData,
        patient_id: selectedPatient.id,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleWeekdayCheckboxWrapperClick = (index) => {
    const newArr = [...weekdayBoolean];
    newArr[index] = !newArr[index];

    setWeekdayBoolean(newArr);
  };

  const selectAllWeekday = (e) => {
    if (weekdayBoolean.every((v) => v === true)) {
      e.currentTarget.children[0].checked = false;
      setWeekdayBoolean([false, false, false, false, false, false, false]);
    } else {
      e.currentTarget.children[0].checked = true;
      setWeekdayBoolean([true, true, true, true, true, true, true]);
    }
  };

  const validateAddress = () => {
    if (!address.postcode || !address.roadAddress || !address.jibunAddress || !address.detailAddress) {
      alert('주소를 입력하세요.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddress()) return false;

    const dataForRequest = {
      family_id: loginId,
      patient_id: patientInfo?.id,
      ...formData,
      start_time: startTime,
      end_time: endTime,
      weekday: weekdayBoolean.reduce((acc, v, i) => {
        if (v) acc.push(i);
        return acc;
      }, []),
      postcode: address.postcode,
      road_address: address.roadAddress,
      jibun_address: address.jibunAddress,
      detail_address: address.detailAddress,
    };

    try {
      console.log('wjsekf', dataForRequest);
      const response = await axios.post('/api/v1/reservation', dataForRequest);
      if (response.data) {
        alert('예약 신청이 완료되었습니다.');
      } else {
        alert('예약 신청에 실패하였습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={`${styles.ReservationForm} content_wrapper`}>
      <form onSubmit={handleSubmit}>
        <div className='input_wrapper'>
          <label>간병받을 환자</label>
          <select onChange={handlePatientSelectChange}>
            <option>환자 선택</option>
            {patientList.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.diagnosis_name})
              </option>
            ))}
            <option value='add'>새로운 환자 추가하기</option>
          </select>
        </div>

        <hr />

        {patientInfo ? (
          <>
            <div className={styles.grid_wrapper}>
              <div className={styles.patient_info_wrapper}>
                <PatientInfo patientInfo={patientInfo} styles={styles} navigator={navigator} />
              </div>

              <div className={styles.reservation_info_wrapper}>
                <div className='input_wrapper'>
                  <label>주소</label>
                  <div className={styles.input_with_button}>
                    <span>장소 종류</span>
                    <select name='location' onChange={handleInputChange}>
                      <option value='병원'>병원</option>
                      <option value='자택'>자택</option>
                    </select>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.3rem' }}>
                      <span>우편번호</span>
                      <span>도로명주소</span>
                      <span>지번주소</span>
                      <span>상세주소</span>
                    </div>
                    <DaumPostcode address={address} setAddress={setAddress} />
                  </div>
                </div>

                <div className='input_wrapper'>
                  <label>간병 기간</label>
                  <div>
                    <input type='date' name='start_date' onChange={handleInputChange} defaultValue={today} /> ~
                    <input type='date' name='end_date' onChange={handleInputChange} defaultValue={today} />
                    <p>
                      (총{' '}
                      {countWeekdays(
                        formData.start_date,
                        formData.end_date,
                        weekdayBoolean.reduce((acc, v, i) => {
                          if (v) acc.push(i);
                          return acc;
                        }, []),
                      )}
                      일)
                    </p>
                  </div>
                </div>

                <div className='input_wrapper'>
                  <div>
                    <label>출퇴근요일</label>
                    <div className={styles.checkbox_wrapper} onClick={selectAllWeekday}>
                      <input type='checkbox' defaultChecked />
                      <span>전체 선택</span>
                    </div>
                  </div>

                  <div className={styles.weekdays}>
                    {weekdayBoolean.map((v, i) => {
                      return (
                        <div
                          key={weekdayDic[i]}
                          className={styles.checkbox_wrapper}
                          onClick={() => handleWeekdayCheckboxWrapperClick(i)}
                        >
                          <input type='checkbox' name='weekday' value={i} checked={v} onChange={() => ''} />
                          <span>{weekdayDic[i]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className='input_wrapper'>
                  <label>출퇴근시간</label>
                  <div>
                    <div className={styles.timepicker_wrapper}>
                      <TimePicker time={startTime} setTime={setStartTime} start={6} end={22} />~
                      <TimePicker time={endTime} setTime={setEndTime} start={6} end={22} />
                    </div>
                    <p>(총 {calTimeDiff(startTime, endTime)}시간)</p>
                  </div>
                </div>

                <div className='input_wrapper'>
                  <label>제시 시급</label>
                  <div>
                    <input
                      type='number'
                      min='9860'
                      max='1000000'
                      name='wage'
                      placeholder='15000'
                      onChange={handleInputChange}
                    />
                    원
                  </div>
                </div>
              </div>
            </div>

            <hr />
            <div className='button_wrapper'>
              <button type='submit'>간병 신청하기</button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>간병을 받을 환자를 선택하세요.</div>
        )}
      </form>
    </div>
  );
};

export default ReservationForm;
