import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/Filter.module.css';

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
  const [timeLeft, setTimeLeft] = useState(200);
  const [currentImage, setCurrentImage] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [currentImageType, setCurrentImageType] = useState<'cephalopod' | 'crustacean'>('cephalopod');
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [isEndingChallenge, setIsEndingChallenge] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const challengeDuration = 200; // seconds

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
    console.log('endChallenge called. Stack trace:', new Error().stack);

    if (isEndingChallenge || challengeCompleted || isRedirecting) {
      console.log('Challenge already ended, completed, or redirecting, skipping');
      return;
    }

    setIsEndingChallenge(true);
    setChallengeCompleted(true);
    setIsRedirecting(true);
    console.log('Challenge ending flags set');

    setChallengeStarted(false);
    console.log('Challenge ended. challengeStarted set to false');

    if (timerRef.current) {
      console.log('Clearing timer');
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    console.log('Challenge result:', { correctAnswers, totalAnswered, timeLeft });
    if (correctAnswers >= 10) {
      console.log('Challenge passed. Attempting to fetch secret');
      try {
        const response = await fetch('/api/getSecret');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.secret) {
          console.log('Secret obtained successfully');
          localStorage.setItem('secret', data.secret);
          try {
            console.log('Attempting to redirect to: /secret');
            await router.push('/secret');
          } catch (error) {
            console.error('Error redirecting to secret page:', error);
          }
        } else {
          throw new Error('Server response did not contain a secret');
        }
      } catch (error: unknown) {
        console.error('Error obtaining secret:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message, error.stack);
          alert(`An error occurred: ${error.message}. Please try again.`);
        } else {
          console.error('Unknown error:', error);
          alert('An unknown error occurred. Please try again.');
        }
        setIsRedirecting(false);
      }
    } else {
      console.log('Challenge failed. Final states:', { correctAnswers, totalAnswered, timeLeft });
      alert(`Challenge failed. You correctly classified ${correctAnswers} out of ${totalAnswered} images${timeLeft === 0 ? ' but ran out of time' : ''}.`);
      setIsRedirecting(false);
    }

    // Reset all challenge-related states
    console.log('Resetting challenge-related states');
    setCorrectAnswers(0);
    setTotalAnswered(0);
    setCurrentImage('');
    setIsEndingChallenge(false);
    setChallengeCompleted(false);

    console.log('Exiting endChallenge. States reset.');
  }, [correctAnswers, totalAnswered, challengeStarted, timeLeft, isEndingChallenge, challengeCompleted, isRedirecting, router]);

  const startChallenge = useCallback(() => {
    if (challengeStarted) return; // Prevent starting multiple challenges

    setChallengeStarted(true);
    setChallengeCompleted(false);
    setTimeLeft(200); // Set to 20 seconds to start the challenge
    setCorrectAnswers(0);
    setTotalAnswered(0);
    setIsEndingChallenge(false);
    setIsRedirecting(false);

    // TODO lol hardcode
    console.log('Challenge starting. Initial states:', { timeLeft: 200, correctAnswers: 0, totalAnswered: 0 });

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
      if (newTotal >= 10) {
        console.log('Challenge completion condition met');
        console.log('About to call endChallenge. Current state:', { correctAnswers: isCorrect ? correctAnswers + 1 : correctAnswers, newTotal, timeLeft });
        endChallenge();
      }
      return newTotal;
    });

    if (!isEndingChallenge) {
      loadNextImage();
    }

    console.log('handleAnswer completed. Current state:', { correctAnswers: isCorrect ? correctAnswers + 1 : correctAnswers, totalAnswered: totalAnswered + 1, timeLeft, isEndingChallenge });
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
        <h1>Cephalopod or Crustacean Challenge</h1>
        <p>Classify 10 images correctly within 20 seconds to pass the challenge and proceed to the next stage!</p>
        <div className={styles.modal}>
          {!challengeStarted ? (
            <>
              <h2>Ready to start the challenge?</h2>
              <button onClick={startChallenge} className="fancy-button">Start Challenge</button>
            </>
          ) : (
            <>
              <h2>Classify the Image</h2>
              <p className={styles.timer}>Time left: {timeLeft} seconds</p>
              {currentImage && (
                <img
                  src={currentImage}
                  alt="Creature to classify"
                  onError={handleImageError}
                  className={styles.challengeImage}
                />
              )}
              <div className={styles.buttonContainer}>
                <button onClick={() => handleAnswer('cephalopod')} className="fancy-button">Cephalopod</button>
                <button onClick={() => handleAnswer('crustacean')} className="fancy-button">Crustacean</button>
              </div>
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
