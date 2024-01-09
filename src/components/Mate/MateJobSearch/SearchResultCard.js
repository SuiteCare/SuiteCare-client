import styles from './SearchResultCard.module.css';

import { calAge, calTimeDiff, countWeekdays, genderToKo, weekdayDic } from '@/utils/calculators.js';

const SearchResultCard = ({ data, showDetail }) => {
  const dueDate = Math.ceil((new Date(data.start_date) - new Date()) / (1000 * 3600 * 24));

  const weekDays = data.day.split(',').map((e) => weekdayDic[e]);
  const [startTime, endTime] = [data.start_time.slice(0, 5), data.end_time.slice(0, 5)];

  const handleApply = () => {
    alert('지원 기능 개발 중');
  };

  const expiredAlert = () => {
    alert('만료된 건입니다.');
  };

  return (
    <div className={`${styles.card} ${dueDate <= 0 ? styles.expired : ''}`}>
      <div className={styles.top}>
        <span className={data.location === '병원' ? styles.hospital : styles.home}>{data.location}</span>
        <span className={styles.dday}>
          지원 마감
          {dueDate > 0 ? (
            <>
              까지 <b>D-{dueDate}</b>
            </>
          ) : (
            <>됨</>
          )}
        </span>
      </div>
      {/* title */}
      <div className={styles.userInfo_wrapper}>
        <div className={styles.title}>
          <label>{data.road_address}</label>
        </div>
        {/* title */}
        {/* body */}
        <div className={styles.userInfo}>
          <label>진단명</label>
          <span>{data.diagnosis_name}</span>
        </div>
        <div className={styles.userInfo}>
          <label>나이/성별</label>
          <span>
            만 {calAge(data.birthday)}세 {genderToKo(data.gender)}성
          </span>
        </div>
        <div className={styles.userInfo}>
          <label>간병 기간</label>
          <span>
            {data.start_date} ~ {data.end_date}{' '}
            <span>(총 {countWeekdays(data.start_date, data.end_date, weekDays)}일)</span>
          </span>
        </div>
        <div className={styles.userInfo}>
          <label>간병 요일</label>
          {weekDays.join(', ')}
        </div>
        <div className={styles.userInfo}>
          <label>출퇴근시간</label>
          <span>
            {startTime} ~ {endTime}{' '}
            <span>
              (총 {calTimeDiff(startTime, endTime)}
              시간)
            </span>
          </span>
        </div>
        <div className={styles.userInfo}>
          <label>제시 시급</label>
          <span>{data.wage.toLocaleString()}원</span>
        </div>
        <div className={styles.userInfo}>
          <label> 예상 총 급여</label>
          <span>
            {(
              data.wage *
              calTimeDiff(startTime, endTime) *
              countWeekdays(data.start_date, data.end_date, weekDays)
            ).toLocaleString()}
            원
          </span>
        </div>
      </div>
      {/* body */}
      {/* bottom */}
      <div className={styles.search_button_wrapper}>
        <button onClick={dueDate <= 0 ? expiredAlert : () => showDetail(data.mate_id)}>상세정보 보기</button>
        <button onClick={dueDate <= 0 ? expiredAlert : () => handleApply(data.mate_id)}>간병 지원하기</button>
      </div>

      {/* bottom */}
    </div>
  );
};

export default SearchResultCard;
