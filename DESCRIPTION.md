# fhtagn.party App Description

## Introduction
fhtagn.party is a web application featuring a unique reverse captcha system. Unlike traditional captchas that require humans to prove they're not robots, our reverse captcha challenges users to prove they are, in fact, robots. This innovative approach adds an element of fun and creativity to the user experience while still providing a layer of security.

## Architecture
The application is built using Next.js, a React framework that enables server-side rendering and generating static websites. This architecture choice provides benefits such as improved performance, better SEO, and a great developer experience.

## Dependencies
- Next.js: The core framework for building the application
- React: For building the user interface
- Node.js: The JavaScript runtime
- npm: For package management
- Additional dependencies can be found in the `package.json` file

## Environment Setup
1. Clone the repository: `git clone https://github.com/pierce403/fhtagn.party.git`
2. Navigate to the project directory: `cd fhtagn.party`
3. Install dependencies: `npm install`
4. Create a `.env.local` file in the root directory and add any necessary environment variables
5. Run the development server: `npm run dev`

## Features
- Reverse Captcha: The primary feature of the app, challenging users to prove they are robots
- Image Recognition: Users are presented with a set of images and must select those that a robot would identify
- Timed Challenges: Users must complete the reverse captcha within a specified time limit
- Score Tracking: The app keeps track of user performance across multiple attempts

## User Flow
1. User navigates to the fhtagn.party website
2. User is presented with the reverse captcha challenge
3. User selects images they believe a robot would identify
4. User submits their selections within the time limit
5. App provides feedback on the user's performance
6. User can retry the challenge or proceed based on their score

## Interaction Points
- Image Selection: Users click or tap on images to select them
- Submit Button: Users click to submit their selections
- Timer Display: Shows remaining time for the challenge
- Score Display: Shows the user's current score
- Retry Button: Allows users to attempt the challenge again

## Expected Behaviors
- The app should load quickly and display the reverse captcha challenge
- Images should be randomly selected from the available pool for each challenge
- The timer should start automatically when the challenge is presented
- Clicking on an image should visually indicate selection
- Submitting before the timer expires should evaluate the user's selections
- The app should provide clear feedback on whether the user passed or failed the challenge
- The retry option should reset the challenge with a new set of images
- The app should maintain consistent performance across different devices and browsers

## Conclusion
fhtagn.party offers a unique twist on traditional captcha systems, providing both security and entertainment. By challenging users to think like robots, it creates an engaging experience that sets it apart from conventional web applications. Whether used for fun or as a genuine security measure, fhtagn.party demonstrates innovative thinking in user interaction design.
