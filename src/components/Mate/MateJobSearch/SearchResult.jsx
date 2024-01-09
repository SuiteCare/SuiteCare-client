import { React, useState } from 'react';

import useModal from '@/hooks/useModal';

import styles from './SearchResult.module.css';
import SearchResultCard from './SearchResultCard';
import JobDetailModal from './JobDetailModal';

const SearchResult = ({ data }) => {
  const [modalData, setModalData] = useState({});
  const { isModalVisible, openModal, closeModal } = useModal();
  const [sortOption, setSortOption] = useState('');

  const handleShowModal = async (defaultData) => {
    // const combinedData = { ...defaultData, ...(await getModalData(defaultData.mate_id)) }; API 완성되면 되돌려야 함
    const combinedData = {
      ...defaultData,
      ...{},
    };
    setModalData(combinedData);
    openModal();
  };

  const sortOptions = {
    wage_asc: (a, b) => a.wage - b.wage,
    wage_desc: (a, b) => b.wage - a.wage,
    start_date_asc: (a, b) => new Date(a.start_date) - new Date(b.start_date),
    start_date_desc: (a, b) => new Date(b.start_date) - new Date(a.start_date),
  };

  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);
  };

  const sortedData = [...data].sort(sortOptions[sortOption]);

  return (
    <div className={`${styles.SearchResult} Form_wide`}>
      <div className={styles.search_header}>
        <h3>검색 결과 ({data.length ? data.length : 0}건)</h3>
        <select value={sortOption} onChange={handleSortChange}>
          <option value=''>정렬 없음</option>
          <option value='start_date_asc'>시작일 오름차순</option>
          <option value='start_date_desc'>시작일 내림차순</option>
          <option value='wage_asc'>시급 오름차순</option>
          <option value='wage_desc'>시급 내림차순</option>
        </select>
      </div>
      <div className={styles.card_wrapper}>
        {sortedData.length > 0 ? (
          sortedData.map((item) => (
            <SearchResultCard data={item} key={item.id} showDetail={() => handleShowModal(item)} />
          ))
        ) : (
          <div className={styles.no_result}>검색 결과가 없습니다.</div>
        )}
      </div>
      {isModalVisible && <JobDetailModal modalData={modalData} closeModal={closeModal} />}
    </div>
  );
};

export default SearchResult;
