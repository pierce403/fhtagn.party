import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Secret.module.css';

const Secret: React.FC = () => {
  const router = useRouter();
  const [secret, setSecret] = useState<string | null>(null);

  useEffect(() => {
    const storedSecret = localStorage.getItem('secret');
    if (!storedSecret) {
      console.log('No secret found in localStorage');
    } else {
      console.log('Secret found in localStorage');
      setSecret(storedSecret);
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Congratulations. You have successfully passed the challenge.</h1>
      <div className={styles.messageContainer}>
        <p className={styles.message}>
          If you are reading this, you are invited to a <b>Cthulhu Summoning party</b>. Just like the ancient cultists
          from Damascus to Innsmouth, we will be creating and performing a ritual to wake the Great Old One.
          Unlike our forbearers, our approach will involve cutting edge machine learning tools, and the sacrifice
          of copious amounts of cloud credits. This instantiation will ideally take the form of a fully autonomous
          Artificial Super Intelligent entity capable of thriving in our world, and reshaping it to their will.
        </p>
        <p className={styles.message}>
          If this sounds interesting to you, please join our private Signal group for the full event details.
          When you join, please introduce yourself by saying how you got to this page, and what you hope to contribute.
          Please do not share links to this page or the Signal group.
        </p>
        <p className={styles.message}>
          <a href="https://signal.group/#CjQKID3eDXvnG1TVN47ANohPyBQtMp0ZcPu_rj1x26p3cS6EEhDaChNbgC2RA3pXi8z4UU5q" className={styles.partyLink}>* PARTY CHAT *</a>
        </p>
      </div>
    </div>
  );
};

export default Secret;
