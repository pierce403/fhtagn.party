import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Secret.module.css';

const Secret: React.FC = () => {
  const router = useRouter();
  const [secret, setSecret] = useState<string | null>(null);

  useEffect(() => {
    const storedSecret = localStorage.getItem('secret');
    if (!storedSecret) {
      router.push('/');
    } else {
      setSecret(storedSecret);
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>You made it!</h1>
      <p className={styles.message}>
        Congratulations! You have successfully passed the challenge.
      </p>
      {secret && (
        <p className={styles.secret}>
          Your secret code is: <span className={styles.secretCode}>{secret}</span>
        </p>
      )}
      <button className={styles.button} onClick={() => router.push('/')}>
        Return to Home
      </button>
    </div>
  );
};

export default Secret;
