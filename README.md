# Ease [![Build Status](https://travis-ci.org/Right2Drive/ease.svg?branch=master.png)](https://travis-ci.org/Right2Drive/ease.svg?branch=master)

## Project Description

### Non-technical

Ease is a desktop application build using Electron and Typescript. The goal is to make it a little bit easier to spend time with the people that matter to you, regardless of the distance. 

The project is still in development and yet to release 0.1 Beta, but the goal is watch local video content in sync with peers. Ease uses a simple signaling server to connect you to your loved ones, but after that it's completely peer-to-peer! 

What does this mean for you? If you have any video files on your computer, you will be able to watch them with your friends and loved ones with synced controls! All viewers will be able to pause, play and seek the video and both of you will still see the same thing

### Technical

For the more technical minded out there, Ease is using an experimental chromium feature to extract a stream from an HTML5 video element, and stream it to the viewers via WebRTC. All controls will be synced via this WebRTC connection as well, ensuring you stay off the grid! Normally you can't count on all viewers using experimental features, but thanks to Electron we can control how you use the application while still offering a native, cross-platform experience.

### Future

In the future we would like to build a web front-end and some mobile applications for the viewers. After all, only the host should be constrained to using Electron! 

## Getting Started Developing

### Clone 

- Start by cloning the directory from my repo, or your forked repo (in my case this is `https://github.com/Right2Drive/ease`)

  - `git clone https://github.com/Right2Drive/ease`

- And navigate to the project:

  - `cd ease`

### Setup 

- Ensure you have NodeJS installed (you can get this [here](https://nodejs.org/)

- Install dependencies:

  - `npm install`
  
  - `typings install`
  
- Create production folder: 

  - `mkdir dist`
  
### Building

- We have created an npm script to build Typescript and Webpack, simply run:

  - `npm run build`

- Ease also uses LESS CSS. We would recommend finding a plugin for your IDE/editor, but there is also a file watcher setup to help you out:

  - `npm run watch:less`
  
- There are also some other file watchers setup for your convenience. These commands are: 

  - `npm run watch:wp` and `npm run watch:ts`

- Having this many file watchers is ridiculous though. Don't worry, we've got you covered! The following script runs all watchers concurrently so you don't have to stress! =D

  - `npm run watch`

### Running Application

- Once again there is a fancy npm script to the rescue! (PS: It's not that fancy)

  - `npm start`

### Running Tests

- Electron applications run in two kinds of processes, the 'Main' and 'Render" processes. Each must be tested differently.

  - To test main:

    - `npm test:main`

  - And to test the render process(es):

    - `npm run test:render`

  - To debug render process:

    1) `npm run test:debug-main`

    2) Set your breakpoints using the console that is shown

    3) Press `CTRL-R` to reload and run the tests again
