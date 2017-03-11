# Ease [![Build Status](https://travis-ci.org/Right2Drive/ease.svg?branch=master)](https://travis-ci.org/Right2Drive/ease.svg?branch=master)

Ease is a desktop application with the goal of making it a little bit easier watch movies with the people that matter to you, regardless of the distance. 

Ease lets you broadcast your own local content to your friends and loved ones, completely in sync! All the audio and video sharing is peer-to-peer, ensuring your content stays private and safe, and we only use a small signaling server to help you discover other users.

In sync... what does this really mean for you? Well, if you click pause, it pauses for everyone. If you seek, it seeks for everyone. Best of all, everyone watching can do these things too! All the content is completely synced, allowing for a more personal experience (and avoiding the good old "3... 2... 1... Play!").

If you are looking for a similar experience for remote content (youtube etc), we suggest looking at Gaze or Rabb.it, both are great products!

### Technical

For the more technical minded out there, Ease is using an experimental chromium feature to extract a stream from an HTML5 video element, and stream it to the viewers via WebRTC. All controls will be synced via this WebRTC connection as well, ensuring you stay off the grid! Normally you can't count on all viewers using experimental features, but thanks to Electron we can control how you use the application while still offering a native, cross-platform experience.

### Future

In the future we aspire to building a web client, or perhaps some mobile apps, for the peers (the host will unfortunately be constrained to electron). If you want to see more features, please open an issue with the `Feature Request` tag, and we will be happy to take a look :octocat:

## Getting Started Developing

### Clone 

- Start by cloning the directory from the repo (`https://github.com/Right2Drive/ease`), or your forked repo

  - `git clone https://github.com/Right2Drive/ease`

- And navigate to the project:

  - `cd ease`

### Setup 

- Ensure you have NodeJS installed (you can get this [here](https://nodejs.org/))

- Run the setup script:

  - `npm run setup`
  
### Building

- We have created an npm script to build Typescript and Webpack, simply run:

  - `npm run build` or `npm run rebuild` to rebuild

- Ease also uses LESS CSS. We would recommend finding a plugin for your IDE/editor, but there is also a file watcher setup to help you out:

  - `npm run watch:less`
  
- There are also some other file watchers setup for your convenience. These commands are: 

  - `npm run watch:wp` and `npm run watch:ts`

- Having this many file watchers is ridiculous though. Don't worry, we've got you covered! The following script runs all watchers concurrently so you don't have to stress! :octocat:

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

  - Some of the tests for the render process don't need to be run in an electron environment. These are run via:

    - `npm run test:generic`

  - To debug render process:

    1) `npm run test:debug-render`

    2) Set your breakpoints using the console that is shown

    3) Press `CTRL-R` to reload and run the tests again

  - Debugging main process and generic tests

    - If you are using vscode, you can find an example `launch.json` [here](https://gist.github.com/Right2Drive/b1812090383600cbf54d5d4c56c6a286)

    - If you are using some other editor/IDE, I'm afraid right now you'll have to figure it out for yourself. Feel free to share your configurations with us, and we can add links in the README :octocat:


### Issues

- Feel free to open any issues you find [here](https://github.com/Right2Drive/ease/issues)

- The project uses ZenHub for issue tracking, so if you want to see a more detailed overview of where the project is you can download the extension (free) [here](https://www.zenhub.com/)

### Thanks

- A huge thanks to all the open source projects that have made this possible, Ease is our way of giving back :octocat: :heart:
