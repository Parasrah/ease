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
  
### Building Typescript

- I have created an npm script to build Typescript and Webpack, simply run:

  - `npm run build`
  
- There are also some file watchers setup for your convenience. These commands are: 

  - `npm run watch-webpack` and `npm run watch-ts`

### Running Application

- Once again there is a fancy npm script to the rescue! (PS: It's not that fancy)

  - `npm start`

### Running Tests

- Electron applications run in two kinds of processes, the 'Main' and 'Render" processes. Each must be tested differently.

  - To test main:

    - `npm test`

  - And to test the render process(es):

    - `npm run test-render`
