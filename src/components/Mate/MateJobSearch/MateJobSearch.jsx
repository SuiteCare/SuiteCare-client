import React, { useState } from 'react';
import axios from 'axios';

import SearchForm from './JobSearchForm';
import SearchResult from './SearchResult';

const MateJobSearch = () => {
  const [searchData, setSearchData] = useState([]);

  const getSearchData = async ($condition) => {
    try {
      const response = await axios.get('/api/v1/search-reservation', { params: $condition });

      if (response.data) {
        setSearchData(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error occurred while fetching search data:', error);
    }
  };

  const handleSearch = async ($condition) => {
    if (!getSearchData($condition)) {
      alert('검색 실패');
    }
  };

  return (
    <div className='MateJobSearch content_wrapper'>
      <SearchForm onSearch={handleSearch} />
      <SearchResult data={searchData} />
    </div>
  );
};

export default MateJobSearch;
