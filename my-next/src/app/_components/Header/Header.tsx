
import Link from "next/link";
import React from 'react';
import classes from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.headerList}>
          <li className={classes.headerItem}>
            <Link href="/" className={classes.headerLink}>Blog</Link>
          </li>
          <li className={classes.headerItem}>
            <Link href="/contact" className={classes.headerLink}>お問い合わせ</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
