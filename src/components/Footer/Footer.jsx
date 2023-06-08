import React from 'react'
import styles from './Footer.module.css'
import logo from '../../images/logo.svg'
const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footer}>
        <div className={styles.center}>
          <div className={styles.logoContainer}>
            <img src={logo} alt="logo" className={styles.logo} />
          </div>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} Tatvasoft.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer