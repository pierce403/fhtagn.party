import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Question {
  text: string;
  type: 'boolean' | 'text' | 'multiple';
  options?: string[];
  correctAnswer?: string | boolean;
}

const questions: Question[] = [
  {
    text: "Do you hear the call of the Old Ones?",
    type: "boolean",
    correctAnswer: true
  },
  {
    text: "Which of these is NOT a Great Old One?",
    type: "multiple",
    options: ["Cthulhu", "Azathoth", "Yog-Sothoth", "Dagon"],
    correctAnswer: "Dagon"
  },
  {
    text: "Are you ready to embrace cosmic horror?",
    type: "boolean",
    correctAnswer: true
  },
  {
    text: "Is the phrase 'Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn' familiar to you?",
    type: "boolean",
    correctAnswer: true
  }
];

const LandingPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | boolean)[]>([]);
  const router = useRouter();

  const handleAnswer = (answer: string | boolean) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const allCorrect = newAnswers.every((a, index) =>
        a === questions[index].correctAnswer
      );
      if (allCorrect) {
        router.push('/filter');
      } else {
        setCurrentQuestion(0);
        setAnswers([]);
      }
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    switch (question.type) {
      case 'boolean':
        return (
          <div className="space-x-4">
            <button
              onClick={() => handleAnswer(true)}
              className="fancy-button"
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="fancy-button bg-green-800 hover:bg-green-700 text-white border-green-600"
            >
              No
            </button>
          </div>
        );
      case 'multiple':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="fancy-button bg-green-700 hover:bg-green-600 text-white w-full border-green-500"
              >
                {option}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>fhtagn.party - Cosmic Horror Awaits</title>
        <meta name="description" content="Embrace the unknown at fhtagn.party" />
      </Head>
      <div className="min-h-screen bg-black text-green-100 flex flex-col items-center justify-center p-4 bg-[url('/tentacle-bg.png')] bg-cover bg-center bg-blend-overlay bg-opacity-80">
        <div className="max-w-2xl w-full bg-green-900 bg-opacity-90 p-8 rounded-xl shadow-2xl border border-green-500 text-center">
          <div className="center-text">
            <h1 className="text-5xl font-bold mb-8 text-green-300">Welcome to fhtagn.party</h1>
            <p className="text-lg mb-8 text-green-200">
              Dare to delve into the depths of cosmic horror? Answer these questions to test your readiness for the unknown.
            </p>
            {currentQuestion < questions.length ? (
              <div>
                <p className="text-2xl mb-6 text-white">{questions[currentQuestion].text}</p>
                {renderQuestion()}
                <div className="mt-8 text-sm text-green-400">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
              </div>
            ) : (
              <p className="text-xl text-green-200">Thank you for your answers. Redirecting to the depths beyond...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
