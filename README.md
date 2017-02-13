# Ease

## Project Description

Ease is a desktop application build using Electron and Typescript. The goal is to make it a little bit easier to spend time with the people that matter to you, regardless of the distance. 

## Getting Started

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

- I have created an npm script to build Typescript and Webpack, simply run:

  - `npm run build`

- Ease also uses LESS CSS. I would recommend finding a plugin for your IDE/editor, but there is also a file watcher setup to help you out:

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
