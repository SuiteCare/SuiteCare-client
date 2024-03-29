import { useState } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import axiosInstance from '@/services/axiosInstance';
import useLoginInfo from '@/hooks/useLoginInfo';

import HistoryTable from './HistoryTable';
import Loading from '@/components/Common/Modal/Loading';

const FamilyHistory = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { id } = useLoginInfo();

  const navigator = useRouter();

  const { data, isError, isLoading } = useQuery(
    ['reservationList', id],
    async () => {
      const response = await axiosInstance.get('/api/v1/reservation/family');
      return response.data.reverse();
    },
    {
      enabled: Boolean(id),
    },
  );

  return (
    <div className='FamilyHistory'>
      {isLoading && <Loading />}
      <div style={{ textAlign: 'right' }}>
        <button type='button' onClick={() => navigator.push('/family/recruitment')}>
          신규 간병 공고 등록하기
        </button>
      </div>
      <div className='tab_wrapper'>
        <div onClick={() => setActiveTab(0)} className={activeTab === 0 ? 'active' : ''}>
          예약 내역
        </div>
        <div onClick={() => setActiveTab(1)} className={activeTab === 1 ? 'active' : ''}>
          완료 내역
        </div>
      </div>
      {activeTab === 0 && <HistoryTable data={data} />}
      {activeTab === 1 &&
        (data.length > 0 ? <HistoryTable data={data} /> : <div className='error'>완료된 간병 내역이 없습니다.</div>)}
    </div>
  );
};

export default FamilyHistory;
