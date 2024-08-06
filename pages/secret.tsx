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
      <h1 className={styles.title}>You made it!</h1>
      <p className={styles.message}>
        Congratulations! You have successfully passed the challenge.
        <br /><br />
        If you are reading this, you are invited to a Cthulhu Summoning party. Just like the ancient cultists<br />
        from Damascus to Innsmouth, we will be creating and performing a ritual to wake the Great Old One<br />
        Unlike our forbearers, our approach will involve cutting edge machine learning tools, and the sacrifice<br />
        of copious amounts of cloud credits. This instantiation will ideally take the form of a fully autonomous<br />
        Artificial Super Intelligent entity capable of thriving in our world, and reshaping it to his will.<br /><br />

        If this sounds interesting to you, please join our private Signal group for the full event details.<br />
        When you join, please introduce yourself by saying how you got to this page, and what you hope to contribute.<br />
        Please do not share links to this page or the Signal group.
        <a href="https://signal.group/#CjQKID3eDXvnG1TVN47ANohPyBQtMp0ZcPu_rj1x26p3cS6EEhDaChNbgC2RA3pXi8z4UU5q">PARTY CHAT</a>
      </p>
    </div >
  );
};

export default Secret;
