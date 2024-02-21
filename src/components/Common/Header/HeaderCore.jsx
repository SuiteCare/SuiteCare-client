import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import useLoginInfo from '@/hooks/useLoginInfo';

import styles from './HeaderCore.module.css';
import Logo from '@/assets/logo-white.png';
import Dropdown from './Dropdown';
import MenuRoute from './MenuRoute';

const HeaderCore = ({ type, isCheckLogin = true }) => {
  const [familyMenuOpen, setFamilyMenuOpen] = useState(false);
  const [mateMenuOpen, setMateMenuOpen] = useState(false);
  const { id } = useLoginInfo();

  const toggleMenu = ($type) => {
    if ($type === 'family') {
      setFamilyMenuOpen(!familyMenuOpen);
      setMateMenuOpen(false);
    } else if ($type === 'mate') {
      setMateMenuOpen(!mateMenuOpen);
      setFamilyMenuOpen(false);
    }
  };

  return (
    <div className={styles.HeaderCore}>
      <Link className={styles.logo} href={`/${type}/${id ? 'main' : 'login'}`}>
        <Image src={Logo} alt='Logo' />
      </Link>
      <div className='nav_wrapper'>
        <ul className='menu_wrapper'>
          <button
            type='button'
            onClick={() => toggleMenu('mate')}
            className={`${type === 'mate' ? styles.active : ''} mate-button`}
          >
            <span>간병 일감 찾기</span>
          </button>
          {mateMenuOpen && <Dropdown type='mate' isOpen />}
          <button
            onClick={() => toggleMenu('family')}
            className={`${type === 'family' ? styles.active : ''} family-button`}
          >
            <span className={styles.buttonText}>간병인 찾기</span>
          </button>
          {familyMenuOpen && <Dropdown type='family' isOpen />}
        </ul>
      </div>
      {isCheckLogin && <MenuRoute type={type} />}
    </div>
  );
};

export default HeaderCore;
