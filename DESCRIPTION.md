# fhtagn.party Application Description

## Purpose
The "fhtagn.party" application is a Next.js/TypeScript web application designed with a dark and minimal aesthetic. It aims to engage users with a unique experience that combines interactive surveys, timed challenges, and a sense of accomplishment upon completion. The application is intended for personal use and is fit for deployment on Vercel.

## Stages
The application consists of three main stages:
- **Landing Page**: The entry point of the application, hosted at '/', greets users and invites them to take a survey with a mix of question types.
- **Reverse Captcha Challenge**: Hosted on '/filter', this stage presents a timed challenge where users must correctly classify images as "cephalopod" or "crustacean" within a 20-second time limit.
- **Secret Page**: Hosted on '/secret', this page congratulates users on passing the challenge and completing the application.

## Technical Overview
- The landing page is implemented in `pages/index.tsx` and includes a survey component that dynamically renders questions and records user responses.
- The reverse captcha challenge is handled by `pages/filter.tsx`, which utilizes a timer and image classification logic to present and evaluate the challenge.
- The secret page is served by `pages/secret.tsx` and provides a congratulatory message upon successful completion of the challenge.
- Global styles are defined in `styles/globals.css` and ensure a consistent dark and minimal aesthetic across the application.
- The application's color scheme and button styling have been customized to the user's preference for a green and black theme with fancy-looking buttons.

## Implementation Details
- The application is built using Next.js, a React framework that enables server-side rendering and static site generation.
- TypeScript is used to ensure type safety and improve the maintainability of the codebase.
- The image assets for the reverse captcha challenge are optimized for quick loading and minimal space usage, adhering to the user's specifications.
- The application's deployment configuration is set up for Vercel, which provides a seamless deployment and hosting solution.

## Future Considerations
- The application's image sourcing process for the reverse captcha challenge may be refined to ensure the relevance and quality of the images.
- Further enhancements to the user interface and user experience may be considered based on user feedback and testing results.
