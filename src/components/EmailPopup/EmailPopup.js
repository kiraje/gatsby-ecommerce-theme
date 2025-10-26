import React, { useState } from 'react';
import * as styles from './EmailPopup.module.css';

const EmailPopup = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(email);
      }
      onClose();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.popupContent}>
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close popup"
      >
        ×
      </button>

      <div className={styles.imageSection}>
        <div className={styles.discountBadge}>
          <span className={styles.discountAmount}>15%</span>
          <span className={styles.discountText}>OFF</span>
        </div>
      </div>

      <div className={styles.contentSection}>
        <h2 className={styles.title}>Welcome to Sydney</h2>
        <p className={styles.subtitle}>
          Subscribe to our newsletter and get 15% off your first order
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.emailInput}
              disabled={isSubmitting}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'SUBSCRIBING...' : 'GET MY DISCOUNT'}
          </button>
        </form>

        <p className={styles.disclaimer}>
          By subscribing, you agree to receive marketing emails from Sydney.
        </p>
      </div>
    </div>
  );
};

export default EmailPopup;
