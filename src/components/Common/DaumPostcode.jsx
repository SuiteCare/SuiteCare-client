import React, { useState, useEffect } from 'react';

const DaumPostcode = ({ address, setAddress }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const closeDaumPostcode = () => {
    setIsPopupVisible(false);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const execDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setAddress({
          postcode: data.zonecode,
          roadAddress: data.roadAddress,
          jibunAddress: data.jibunAddress,
          detailAddress: '',
        });

        setIsPopupVisible(false);
      },
    }).open();
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [id]: value,
    }));
  };

  const renderPopup = () => {
    if (!isPopupVisible) return null;

    return (
      <div
        id='layer'
        style={{
          display: 'block',
          position: 'fixed',
          overflow: 'hidden',
          zIndex: 1,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <img
          src='//t1.daumcdn.net/postcode/resource/images/close.png'
          id='btnClosePopup'
          style={{
            cursor: 'pointer',
            position: 'absolute',
            right: '-3px',
            top: '-3px',
            zIndex: 1,
          }}
          onClick={closeDaumPostcode}
          alt='닫기 버튼'
        />
      </div>
    );
  };

  return (
    <div className='DaumPostcode'>
      <input
        type='text'
        id='postcode'
        placeholder='우편번호'
        value={address.postcode}
        onChange={handleInputChange}
        maxLength={5}
        pattern='[0-9]{5}'
      />
      <button type='button' onClick={execDaumPostcode}>
        우편번호 찾기
      </button>
      <input
        type='text'
        id='roadAddress'
        placeholder='도로명주소'
        value={address.roadAddress}
        onChange={handleInputChange}
      />
      <input
        type='text'
        id='jibunAddress'
        placeholder='지번주소'
        value={address.jibunAddress}
        onChange={handleInputChange}
      />
      <input
        type='text'
        id='detailAddress'
        placeholder='상세주소'
        value={address.detailAddress}
        onChange={handleInputChange}
      />

      {renderPopup()}
    </div>
  );
};

export default DaumPostcode;
