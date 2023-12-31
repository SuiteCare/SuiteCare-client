import React, { useState } from 'react';

import useModal from '@/components/Common/Modal/useModal';
import styles from '@/components/Common/Modal/Modal.module.css';

import { calAge, calTimeDiff, countWeekdays } from '@/utils/calculators.js';

const JobDetailModal = ({ modalData, closeModal }) => {
  const { handleContentClick } = useModal();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={styles.Modal} onClick={closeModal}>
      <div className={styles.modal_wrapper} onClick={handleContentClick}>
        <div className='close_button'>
          <span onClick={closeModal}></span>
        </div>

        {/* 시작 */}
        <div className='tab_wrapper'>
          <ul>
            <li onClick={() => setActiveTab(0)} className={activeTab === 0 ? 'active' : ''}>
              간병 정보
            </li>
            <li onClick={() => setActiveTab(1)} className={activeTab === 1 ? 'active' : ''}>
              환자 상세정보
            </li>
          </ul>
        </div>

        {activeTab === 0 && (
          <>
            <div className={styles.info_section}>
              <h5>환자 정보</h5>
              <div className={styles.info_wrapper}>
                <label>진단명</label>
                <span>{modalData.diagnosis}</span>
              </div>
            </div>

            <div className={styles.info_section}>
              <h5>보호자 정보</h5>
              <div className={styles.info_wrapper}>
                <label>보호자 연락처</label>
                <div>
                  <p>✉️{modalData.family_email || '이메일 정보가 없습니다.'}</p>
                  <p>📞{modalData.tel || '전화번호 정보가 없습니다.'}</p>
                </div>
              </div>
            </div>

            {/* 간병 정보 시작 */}
            <div className={styles.info_section}>
              <h5>간병 정보</h5>

              <div className={styles.info_wrapper}>
                <label>간병지 주소</label>
                <div>
                  <span
                    className={`${styles.location} ${
                      modalData.location_type === '자택' ? styles.house : styles.hospital
                    }`}
                  >
                    {modalData.location_type}
                  </span>
                  <span>{modalData.address}</span>
                </div>
              </div>
              <div className={styles.info_wrapper}>
                <label>간병 기간</label>
                <span>
                  {modalData.start_date} ~ {modalData.end_date}{' '}
                  <span>(총 {countWeekdays(modalData.start_date, modalData.end_date, modalData.week_days)}일)</span>
                </span>
              </div>

              <div className={styles.info_wrapper}>
                <label>간병 요일</label>
                <span>{modalData.week_days.join(', ')}</span>
              </div>

              <div className={styles.info_wrapper}>
                <label>출퇴근시간</label>
                <span>
                  {modalData.start_time} ~ {modalData.end_time}{' '}
                  <span>(총 {calTimeDiff(modalData.start_time, modalData.end_time)}시간)</span>
                </span>
              </div>

              <div className={styles.info_wrapper}>
                <label>제시 시급</label>
                <span>{modalData.wage.toLocaleString()}원</span>
              </div>

              <div className={styles.info_wrapper}>
                <label>예상 총 급여</label>
                <span>
                  {(
                    modalData.wage *
                    calTimeDiff(modalData.start_time, modalData.end_time) *
                    countWeekdays(modalData.start_date, modalData.end_date, modalData.week_days)
                  ).toLocaleString()}
                  원
                </span>
              </div>
            </div>

            {/* 간병 정보 끝 */}
          </>
        )}

        {activeTab === 1 && (
          <>
            <div className={styles.info_section}>
              <h5>환자 기본정보</h5>
              <div className={styles.info_wrapper}>
                <label>진단명</label>
                <span>{modalData.diagnosis}</span>
              </div>

              <div className={styles.info_grid}>
                <div className={styles.info_wrapper}>
                  <label>나이</label>
                  <span>만 {calAge(modalData.patient_birthday)}세</span>
                </div>

                <div className={styles.info_wrapper}>
                  <label>성별</label>
                  <span>{modalData.gender === 'F' ? '여성' : '남성'}</span>
                </div>

                <div className={styles.info_wrapper}>
                  <label>키</label>
                  <span>{modalData.patient_height} cm</span>
                </div>

                <div className={styles.info_wrapper}>
                  <label>몸무게</label>
                  <span>{modalData.patient_weight} kg</span>
                </div>
              </div>
            </div>

            <div className={styles.info_section}>
              {/* 상세정보 시작 */}
              <h5>환자 상세정보</h5>
              <div className={styles.info_grid}>
                <div className={styles.info_wrapper}>
                  <label>의식 상태</label>
                  <span>{modalData.consciousness_state}</span>
                </div>

                <div className={styles.info_wrapper}>
                  <label>식사 보조</label>
                  <span>{modalData.need_meal_care}</span>
                </div>

                <div className={styles.info_wrapper}>
                  <label>용변 보조</label>
                  <span>{modalData.need_toilet_care}</span>
                </div>

                <div className={styles.info_wrapper}>
                  <label>마비 상태</label>
                  <span>{modalData.paralysis_state}</span>
                </div>

                <div className={styles.info_wrapper}>
                  <label>거동 상태</label>
                  <span>{modalData.behavioral_state}</span>
                </div>

                <div className={styles.info_wrapper}>
                  <label>욕창</label>
                  <span>{modalData.is_bedsore}</span>
                </div>

                <div className={styles.info_wrapper}>
                  <label>석션</label>
                  <span>{modalData.need_suction}</span>
                </div>

                <div className={styles.info_wrapper}>
                  <label>주기적 외래 진료</label>
                  <span>{modalData.need_outpatient}</span>
                </div>

                <div className={styles.info_wrapper}>
                  <label>야간 간병</label>
                  <span>{modalData.need_night_care}</span>
                </div>
              </div>
              <div className={styles.info_wrapper}>
                <label>비고</label>
                <span className={styles.introduction}>{modalData.notice}</span>
              </div>
              {/* 상세정보 끝 */}
            </div>
          </>
        )}
        {/* 끝 */}

        <div className={styles.button_wrapper}>
          <button type='submit' onClick={() => handleApply(modalData.mate_id)}>
            간병 지원하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
