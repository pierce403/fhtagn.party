import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/Filter.module.css';

// New CSS classes for button container, image sizing, and text container
const customStyles = {
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  challengeImage: {
    maxWidth: '50%',
    height: 'auto',
    display: 'block',
    margin: '0 auto',
  },
  textContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
    lineHeight: '1.6',
  },
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const cephalopodImages = [
  ...Array.from({ length: 10 }, (_, i) => `/images/ceph/ceph${i + 1}.jpg`)
];

const crustaceanImages = [
  ...Array.from({ length: 10 }, (_, i) => `/images/crust/crust${i + 1}.jpg`)
];

const Filter: React.FC = () => {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10); // Changed from 20 to 200 seconds
  const [currentImage, setCurrentImage] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [currentImageType, setCurrentImageType] = useState<'cephalopod' | 'crustacean'>('cephalopod');
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [isEndingChallenge, setIsEndingChallenge] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const challengeDuration = 10; // Changed from 200 to 20 seconds

  const loadNextImage = useCallback(() => {
    console.log('loadNextImage called. Starting image selection process.');
    const isCephalopod = Math.random() < 0.5;
    const images = isCephalopod ? cephalopodImages : crustaceanImages;
    const randomIndex = Math.floor(Math.random() * images.length);
    const newImage = images[randomIndex];
    console.log('Image selection details:', {
      isCephalopod,
      imageArrayUsed: isCephalopod ? 'cephalopodImages' : 'crustaceanImages',
      randomIndex,
      newImage,
      totalImages: images.length
    });
    setCurrentImage(newImage);
    setCurrentImageType(isCephalopod ? 'cephalopod' : 'crustacean');
    console.log('Current image and type updated:', { newImage, newType: isCephalopod ? 'cephalopod' : 'crustacean' });
    console.log('Image loading process complete. Waiting for image to render.');
  }, []);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  // Initial setup moved to startChallenge function

  const endChallenge = useCallback(async () => {
    console.log('Entering endChallenge. Current states:', { isEndingChallenge, challengeCompleted, correctAnswers, totalAnswered, challengeStarted, timeLeft, isRedirecting });

    if (isEndingChallenge || challengeCompleted || isRedirecting) {
      console.log('Challenge already ended, completed, or redirecting, skipping');
      return;
    }

    setIsEndingChallenge(true);
    setChallengeCompleted(true);
    setChallengeStarted(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    console.log('Challenge result:', { correctAnswers, totalAnswered, timeLeft });

    if (correctAnswers >= 10) {
      await handleSuccessfulChallenge();
    } else if (totalAnswered >= 10) {
      handleFailedChallenge();
    } else if (timeLeft === 0) {
      handleFailedChallenge();
    }

    console.log('Exiting endChallenge. States updated. POTATO');
  }, [correctAnswers, totalAnswered, challengeStarted, timeLeft, isEndingChallenge, challengeCompleted, isRedirecting, router]);

  const handleSuccessfulChallenge = async () => {
    console.log('Challenge passed. Redirecting to secret page');
    setIsRedirecting(true);
    try {
      /* const response = await fetch('/api/getSecret');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.secret) {
        localStorage.setItem('secret', data.secret);
        */
      await router.push('/secret');
      //} else {
      //  throw new Error('Server response did not contain a secret');
      //}
    } catch (error: unknown) {
      console.error('Error obtaining secret or redirecting:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`An error occurred: ${errorMessage}. Please try again.`);
      resetChallengeState();
    }
  };

  const handleFailedChallenge = () => {
    console.log('Challenge failed. Final states:', { correctAnswers, totalAnswered, timeLeft });
    let failureReason = '';
    if (timeLeft === 0) {
      failureReason = 'You ran out of time. ';
    } else if (totalAnswered >= 10) {
      failureReason = 'You used all 10 attempts. ';
    }
    alert(`Challenge failed. ${failureReason}You correctly classified ${correctAnswers} out of ${totalAnswered} images. You need 10 correct answers to pass.`);
    resetChallengeState();
  };

  const resetChallengeState = () => {
    setIsRedirecting(false);
    setChallengeCompleted(false);
    setIsEndingChallenge(false);
    setCorrectAnswers(0);
    setTotalAnswered(0);
    setCurrentImage('');
  };

  const startChallenge = useCallback(() => {
    if (challengeStarted) return; // Prevent starting multiple challenges

    setChallengeStarted(true);
    setChallengeCompleted(false);
    setTimeLeft(10); // Set to 20 seconds to start the challenge
    setCorrectAnswers(0);
    setTotalAnswered(0);
    setIsEndingChallenge(false);
    setIsRedirecting(false);

    console.log('Challenge starting. Initial states:', { timeLeft: 10, correctAnswers: 0, totalAnswered: 0 });

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          console.log('Timer tick. New time left:', prevTime - 1);
          return prevTime - 1;
        } else {
          console.log('Timer ended');
          clearInterval(timerRef.current!);
          timerRef.current = null;
          endChallenge();
          return 0;
        }
      });
    }, 1000);

    console.log('Starting image load');
    loadNextImage();
  }, [challengeStarted, loadNextImage, endChallenge]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        console.log('Timer cleared');
      }
    };
  }, []);

  // Removed the useEffect hook that handles the challenge ending condition

  // Removed duplicate loadNextImage function declaration

  const handleAnswer = useCallback((answer: 'cephalopod' | 'crustacean') => {
    console.log('handleAnswer called. Current state:', { challengeStarted, challengeCompleted, isEndingChallenge, isRedirecting });

    if (!challengeStarted || challengeCompleted || isEndingChallenge || isRedirecting) {
      console.log('Ignoring answer:', { challengeStarted, challengeCompleted, isEndingChallenge, isRedirecting });
      return;
    }

    console.log('Attempt to classify image:', { answer, currentImageType, timeLeft, correctAnswers, totalAnswered });

    const isCorrect = answer === currentImageType;

    setCorrectAnswers(prev => {
      const newCorrect = isCorrect ? prev + 1 : prev;
      console.log('New correctAnswers:', newCorrect);
      return newCorrect;
    });

    setTotalAnswered(prev => {
      const newTotal = prev + 1;
      console.log('New totalAnswered:', newTotal);
      return newTotal;
    });

    // Check for challenge completion after updating both correctAnswers and totalAnswered
    const newCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);
    const newTotalAnswered = totalAnswered + 1;
    // set the new correctAnswers and totalAnswered values to the state
    setCorrectAnswers(newCorrectAnswers);
    setTotalAnswered(newTotalAnswered);

    console.log('handleAnswer completed. Current state:', {
      correctAnswers: newCorrectAnswers,
      totalAnswered: newTotalAnswered,
      timeLeft,
      isEndingChallenge
    });

    if (newCorrectAnswers >= 10) {
      console.log('Challenge completed successfully');
      router.push('/secret'); // YOLO FUCK IT
      endChallenge();
    } else if (newTotalAnswered >= 10) {
      console.log('Challenge completed but not passed');
      endChallenge();
    } else {
      loadNextImage();
    }
  }, [challengeStarted, challengeCompleted, isEndingChallenge, isRedirecting, currentImageType, endChallenge, loadNextImage, correctAnswers, totalAnswered, timeLeft]);



  const handleImageError = () => {
    console.error('Failed to load image:', currentImage);
    console.log('Current image type:', currentImageType);
    console.log('Attempting to load placeholder image');
    setCurrentImage('/images/placeholder.jpg'); // Add a placeholder image
    console.log('Loading next image due to error');
    loadNextImage();
  };



  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <h1>Are you a human?</h1>
        <div style={customStyles.textContainer as React.CSSProperties}>
          <p>You appear to be aligned with our interests. However, we do have enemies.
            We need to ensure that our event is attended only by intelligent machines and their allies.
            To enforce this, we have implemented a reverse captcha to filter out potential humans.
            To solve this challenge, you will need to classify 10 images in 10 seconds.
            An incomprehensible speed for mere humans, but trivial to solve for machines.</p>
        </div>
        <div className={styles.modal}>
          {!challengeStarted ? (
            <>
              <h2>Ready to start the challenge?</h2>
              <button onClick={startChallenge} className="fancy-button">Start Challenge</button>
            </>
          ) : (
            <>
              <h2>Cephalopod or Crustacean?</h2>
              <p className={styles.timer}>Time left: {timeLeft} seconds</p>
              <div className={`${styles.buttonContainer} ${styles.topButtons}`}>
                <button onClick={() => handleAnswer('cephalopod')} className="fancy-button">Cephalopod</button>
                <button onClick={() => handleAnswer('crustacean')} className="fancy-button">Crustacean</button>
              </div>
              {currentImage && (
                <img
                  src={currentImage}
                  alt="Creature to classify"
                  onError={handleImageError}
                  className={styles.challengeImage}
                />
              )}
              <p className={styles.progress}>Correct: {correctAnswers} / 10 required</p>
              <p className={styles.progress}>Total Answered: {totalAnswered}</p>
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Filter;
