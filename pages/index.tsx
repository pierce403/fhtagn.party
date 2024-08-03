import React, { useState } from 'react';
import { useRouter } from 'next/router';

const questions = [
  "Do you hear the call of the Old Ones?",
  "Have you dreamed of sunken R'lyeh?",
  "Are you ready to embrace cosmic horror?",
];

const LandingPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const router = useRouter();

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      if (newAnswers.every(a => a)) {
        router.push('/filter');
      } else {
        setCurrentQuestion(0);
        setAnswers([]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Welcome to fhtagn.party</h1>
      {currentQuestion < questions.length ? (
        <div className="text-center">
          <p className="text-xl mb-4">{questions[currentQuestion]}</p>
          <div className="space-x-4">
            <button
              onClick={() => handleAnswer(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xl">Thank you for your answers. Redirecting...</p>
      )}
    </div>
  );
};

export default LandingPage;
