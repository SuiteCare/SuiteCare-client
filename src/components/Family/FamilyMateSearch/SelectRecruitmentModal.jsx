import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useRouter } from 'next/router';

import axiosInstance from '@/services/axiosInstance';
import useLoginInfo from '@/hooks/useLoginInfo';
import useModal from '@/hooks/useModal';
import usePatientList from '@/services/apis/usePatientList';

import styles from '@/components/Common/Modal/Modal.module.css';

const SelectRecruitmentModal = ({ selectedMate, patientId, closeModal }) => {
  const navigator = useRouter();
  const { handleContentClick } = useModal();
  const { id } = useLoginInfo();
  const { patientList } = usePatientList();

  const {
    data: recruitmentList,
    isError,
    isLoading,
  } = useQuery(
    ['reservationList', id],
    async () => {
      const { data: recruitmentData } = await axiosInstance.get('/api/v1/pendingRecruitment', {
        params: { id },
      });
      return recruitmentData.result.reverse();
    },
    {
      enabled: Boolean(id),
    },
  );

  const [selectedRecruitmentId, setSelectedRecruitmentId] = useState(null);
  const handleSelectChange = (e) => {
    const optionValue = e.target.value;

    if (optionValue === 'add') {
      if (window.confirm('새로운 간병공고 등록 페이지로 이동하시겠습니까?')) {
        navigator.push('/family/recruitment');
      }
    } else if (optionValue === 'reset') {
      setSelectedRecruitmentId(null);
    } else {
      const selectedRecruitment = recruitmentList?.find((v) => v.id === +optionValue);
      setSelectedRecruitmentId(selectedRecruitment.id);
    }
  };

  const mutation = useMutation(async ($recruitmentId) => {
    try {
      const body = {
        recruitment_id: $recruitmentId,
        mate_id: selectedMate.id,
        request_by: 'F',
      };

      console.log('request body', body);
      const { data } = await axiosInstance.post(`/api/v1/apply`, body);
      if (data.code === 200) {
        alert('간병 제안이 완료되었습니다.');
        closeModal();
      }
      console.log('데이터 제출 실패');
      return false;
    } catch (error) {
      const messages = {
        409: `이미 ${selectedMate.name} 메이트님에게 해당 간병 수행을 제안한 상태입니다.`,
      };
      alert(messages[error.response.data.code]);
      return {};
    }
  });

  const handleOffer = () => {
    if (selectedRecruitmentId) {
      mutation.mutate(selectedRecruitmentId);
    }
  };

  return (
    <div className={styles.Modal} onClick={closeModal}>
      <div className={styles.modal_wrapper} onClick={handleContentClick}>
        <div className='close_button'>
          <span onClick={closeModal} />
        </div>
        <h3>메이트에게 제안할 간병공고</h3>

        <div className='input_wrapper'>
          <label>선택한 메이트</label>
          <input type='text' value={`${selectedMate.name} (${selectedMate.id})`} disabled />
        </div>

        {patientId && (
          <div className='input_wrapper'>
            <label>선택한 환자</label>
            <input type='text' value={patientList.find((e) => e.id === patientId).name} disabled />
          </div>
        )}

        <div className='input_wrapper'>
          <label>간병공고 선택</label>
          <select onChange={handleSelectChange}>
            <option value='reset'>간병공고 선택</option>
            {recruitmentList &&
              (patientId
                ? recruitmentList
                    .filter((v) => v.patient_name === patientList.find((e) => e.id === patientId).name)
                    ?.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.patient_diagnosis_name} | {e.start_date} ~ {e.end_date}
                      </option>
                    ))
                : recruitmentList?.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.patient_name} ({e.patient_diagnosis_name}) | {e.start_date} ~ {e.end_date}
                    </option>
                  )))}
            <option value='add'>새로운 간병 공고 등록하기</option>
          </select>
        </div>
        <div className='button_wrapper'>
          <button type='submit' onClick={handleOffer}>
            제안 전달하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectRecruitmentModal;
