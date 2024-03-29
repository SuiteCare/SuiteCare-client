import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';

import useModal from '@/hooks/useModal';
import axiosInstance from '@/services/axiosInstance';

import styles from './PendingReservation.module.css';
import tablestyles from '@/components/Common/ManageTable.module.css';
import MateDetailModal from './MateDetailModal';

import { calAge, genderToKo } from '@/utils/calculators.js';

const ApplyMateForm = ({ selectedRecId }) => {
  const { isModalVisible, openModal } = useModal();
  const [selectedModal, setSelectedModal] = useState(null);

  const closeModal = () => {
    // 모달을 보이지 않게 하기 위해 상태를 초기화
    setSelectedModal(null);
  };

  const [maModalData, setMaModalData] = useState({});
  const [selectedMate, setSelectedMate] = useState(null);
  const [modalType, setModalType] = useState(null);

  const {
    data: applyMateList,
    isError: isApplyMateListError,
    isLoading: isApplyMateListLoading,
  } = useQuery(
    ['applyMateList', selectedRecId],
    async () => {
      const { data: applyMateData } = await axiosInstance.get(`/api/v1/recruitment/${selectedRecId}/M`, {
        params: {
          recruitment_id: selectedRecId,
        },
      });
      console.log('applyMateList', selectedRecId, applyMateData);

      return applyMateData;
    },
    {
      enabled: Boolean(selectedRecId),
    },
  );

  useEffect(() => {
    console.log('applyMateList', applyMateList);
  }, [applyMateList]);

  const getApplyMateDetail = async (mateId) => {
    console.log(mateId);
    try {
      const applyMateDetailPromise = axiosInstance.get(`/api/v1/mate/resume/${mateId}`);
      const applyMateDataPromise = axiosInstance.get(`/api/v1/recruitment/${selectedRecId}/M`);
      const [applyMateDetailResponse, applyMateDataResponse] = await Promise.all([
        applyMateDetailPromise,
        applyMateDataPromise,
      ]);

      const matchedMate = applyMateDataResponse.data.find((mate) => mate.mate_resume_id === mateId);

      setMaModalData((prevData) => ({
        ...prevData,
        ...applyMateDetailResponse.data,
        matchedMate: matchedMate ?? {},
      }));

      setSelectedMate(matchedMate.mate_resume_id);
      console.log('간병인', selectedMate);
      console.log('ma', maModalData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApplyMateDetailClick = (mateId) => {
    getApplyMateDetail(mateId);
    openModal();
    setSelectedModal('ApplyMateDetail');
    setModalType('Apply');
  };

  const mutation = useMutation(async (mateId) => {
    await getApplyMateDetail(mateId);

    try {
      const body = {
        recruitment_id: selectedRecId,
        mate_id: selectedMate,
      };

      console.log('request body', body);

      const isConfirmed = window.confirm('예약을 확정하시겠습니까?');

      if (isConfirmed) {
        const response = await axiosInstance.post(`/api/v1/reservation`, body);

        if (response.data === 1) {
          alert('예약이 확정되었습니다.');
          console.log('1', response.data);
          window.location.reload();
        } else if (response.data > 1) {
          alert('이미 확정되었습니다.');
          console.log('2', response.data);
          window.location.reload();
        } else {
          console.log('데이터 제출 실패');
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error occurred while fetching modal data:', error);
      return {};
    } finally {
      closeModal();
    }
  });

  const handleAccept = async (mateId) => {
    const mateDetail = await getApplyMateDetail(mateId);
    console.log('mateDetail', mateDetail);

    mutation.mutate(mateDetail);
  };

  return (
    <div className={tablestyles.ManageTable}>
      <table className={styles.table_margin}>
        <thead>
          <tr>
            <th>아이디</th>
            <th>성명</th>
            <th>성별</th>
            <th>나이</th>
            <th>주요 서비스</th>
            <th>간병인 상세정보</th>
            <th>간병 수락</th>
          </tr>
        </thead>
        <tbody>
          {applyMateList?.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <div className='error'>아직 지원한 간병인이 없습니다.</div>
              </td>
            </tr>
          ) : (
            applyMateList?.map((e) => (
              <tr key={e.mate_resume_id}>
                <td>{e.mate_resume_id}</td>
                <td>{e.name}</td>
                <td>{genderToKo(e.gender)}성</td>
                <td> 만 {calAge(e.birthday)}세</td>
                <td>{e.mainservice}</td>
                <td>
                  <button type='button' onClick={() => handleApplyMateDetailClick(e.mate_resume_id)}>
                    상세정보 보기
                  </button>
                </td>
                <td>
                  <button type='button' onClick={() => handleAccept(e.mate_resume_id)}>
                    간병 확정하기
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {isModalVisible && selectedModal === 'ApplyMateDetail' && (
        <MateDetailModal modalData={maModalData} closeModal={closeModal} modalType={modalType} />
      )}
    </div>
  );
};

export default ApplyMateForm;
