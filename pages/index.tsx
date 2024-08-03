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
    text: "What is the name of the sunken city from Lovecraft's mythos?",
    type: "text",
    correctAnswer: "R'lyeh"
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
  }
];

const LandingPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | boolean)[]>([]);
  const [textInput, setTextInput] = useState('');
  const router = useRouter();

  const handleAnswer = (answer: string | boolean) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTextInput('');
    } else {
      const allCorrect = newAnswers.every((a, index) =>
        a === questions[index].correctAnswer
      );
      if (allCorrect) {
        router.push('/filter');
      } else {
        setCurrentQuestion(0);
        setAnswers([]);
        setTextInput('');
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
              className="bg-green-900 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="bg-red-900 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              No
            </button>
          </div>
        );
      case 'text':
        return (
          <div>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              onClick={() => handleAnswer(textInput)}
              className="bg-purple-900 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-lg ml-2 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Submit
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
                className="bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-lg block w-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                {option}
              </button>
            ))}
          </div>
        );
    }
  };

  return (
    <>
      <Head>
        <title>fhtagn.party - Cosmic Horror Awaits</title>
        <meta name="description" content="Embrace the unknown at fhtagn.party" />
      </Head>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 bg-[url('/tentacle-bg.png')] bg-cover bg-center">
        <div className="max-w-2xl w-full bg-black bg-opacity-80 p-8 rounded-xl shadow-2xl">
          <h1 className="text-5xl font-bold mb-8 text-center text-purple-300">Welcome to fhtagn.party</h1>
          <p className="text-lg mb-8 text-center text-gray-300">
            Dare to delve into the depths of cosmic horror? Answer these questions to test your readiness for the unknown.
          </p>
          {currentQuestion < questions.length ? (
            <div className="text-center">
              <p className="text-2xl mb-6 text-green-300">{questions[currentQuestion].text}</p>
              {renderQuestion()}
              <div className="mt-8 text-sm text-gray-400">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>
          ) : (
            <p className="text-xl text-center">Thank you for your answers. Redirecting to the depths beyond...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default LandingPage;
