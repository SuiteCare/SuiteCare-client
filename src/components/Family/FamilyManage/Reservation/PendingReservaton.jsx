import { useState } from 'react';
import { useRouter } from 'next/router';

import useModal from '@/hooks/useModal';
import axiosInstance from '@/services/axiosInstance';
import useLoginInfo from '@/hooks/useLoginInfo';

import styles from './PendingReservation.module.css';
import ApplyMateForm from './ApplyMateForm';
import OfferMateForm from './OfferMateForm';
import PatientDetailModal from './PatientDetailModal';
import RecruitmentDetailModal from '../../../Common/Modal/Detail/RecruitmentDetailModal';

const PendingReservation = ({ recruitmentList }) => {
  const navigator = useRouter();

  const { isModalVisible, openModal } = useModal();
  const [selectedModal, setSelectedModal] = useState(null);

  const { id } = useLoginInfo();

  const [modalData, setModalData] = useState({});
  const [reModalData, setReModalData] = useState({});

  const [selectedRecId, setSelectedRecId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const closeModal = () => {
    setSelectedModal(null);
  };

  const handleSelectChange = (e) => {
    const newValue = e.target.value;

    if (newValue === 'add') {
      if (window.confirm('새로운 간병예약 신청 페이지로 이동하시겠습니까?')) {
        navigator.push('/family/recruitment');
      }
    } else {
      const selectedRecruitment = recruitmentList?.find((v) => v.id === +newValue);
      const selectPatient = selectedRecruitment.patient_name;

      setSelectedRecId(selectedRecruitment?.id);
      setSelectedPatient(selectPatient);

      console.log(selectedPatient);
    }
  };

  const getPatientDetail = async ($event) => {
    setModalData($event);
    try {
      const patientPromise = axiosInstance.get(`/api/v1/recruitment/${selectedRecId}/patient`);
      const recruitmentDataPromise = axiosInstance.get('/api/v1/pendingRecruitment', { params: { id } });
      const [patientResponse, recruitmentDataResponse] = await Promise.all([patientPromise, recruitmentDataPromise]);
      const recruitmentResponse = recruitmentDataResponse.data.find((recruitment) => recruitment.id === selectedRecId);

      setModalData((prevData) => ({
        ...prevData,
        ...patientResponse.data,
        ...(recruitmentResponse || {}), // recruitmentResponse가 undefined이면 빈 객체를 병합
      }));
    } catch (error) {
      console.error(error);
    }
    console.log('m', modalData);
  };

  const getRecruitmentDetail = async ($event) => {
    setReModalData($event);
    try {
      const recruitmentdetailPromise = await axiosInstance.get(`/api/v1/recruitment/${selectedRecId}/detail`);
      const recruitmentDataPromise = axiosInstance.get('/api/v1/pendingRecruitment', { params: { id } });
      const [recruitmentdetailResponse, recruitmentDataResponse] = await Promise.all([
        recruitmentdetailPromise,
        recruitmentDataPromise,
      ]);
      const recruitmentResponse = recruitmentDataResponse.data.find((recruitment) => recruitment.id === selectedRecId);

      setReModalData((prevData) => ({
        ...prevData,
        ...recruitmentdetailResponse.data,
        ...(recruitmentResponse || {}),
      }));
      console.log('r', reModalData);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePatientDetailClick = ($event) => {
    getPatientDetail($event);
    openModal();
    setSelectedModal('PatientDetail');
  };

  const handleRecruitmentDetailClick = ($event) => {
    getRecruitmentDetail($event);
    openModal();
    setSelectedModal('RecruitmentDetail');
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className={styles.PendingReservation}>
      <div className={`${styles.select_reservation} input_wrapper`}>
        <label>간병공고 목록</label>
        <select onChange={handleSelectChange}>
          <option onSelect={handleReset}>간병공고 선택</option>
          {recruitmentList?.map((e) => (
            <option key={e.id} value={e.id}>
              {e.patient_name} | {e.start_date} ~ {e.end_date}
            </option>
          ))}
          <option value='add'>새로운 간병 공고 등록하기</option>
        </select>
      </div>

      <hr />

      {selectedRecId ? (
        <>
          <div className={styles.button_wrapper}>
            <button type='button' onClick={() => handlePatientDetailClick(selectedRecId)}>
              환자 정보 보기
            </button>
            <button
              type='button'
              className={styles.second_button}
              onClick={() => handleRecruitmentDetailClick(selectedRecId)}
            >
              공고 정보 보기
            </button>
            {isModalVisible && (
              <>
                {selectedModal === 'PatientDetail' && (
                  <PatientDetailModal modalData={modalData} closeModal={closeModal} />
                )}
                {selectedModal === 'RecruitmentDetail' && (
                  <RecruitmentDetailModal reModalData={reModalData} closeModal={closeModal} />
                )}
              </>
            )}
          </div>
          <span />
          <h3>내가 제안한 간병인 리스트</h3>
          <OfferMateForm selectedRecId={selectedRecId} reModalData={reModalData} modalData={modalData} />
          <h3>지원한 간병인 리스트</h3>
          <ApplyMateForm selectedRecId={selectedRecId} modalData={modalData} reModalData={reModalData} />
        </>
      ) : (
        <div className='no_result'>정보를 확인할 간병 공고를 선택하세요.</div>
      )}
    </div>
  );
};

export default PendingReservation;
