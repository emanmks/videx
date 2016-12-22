# Videx - Video Explorer

A multi-platform portable Video Explorer built on top of electron.

![Videx.png](https://bitbucket.org/repo/qdb7dj/images/3036422887-Videx.png)

## Dependencies
 - Operating System : Linux, Windows or OSX
 - NPM installed in your machine
 - Git is installed in your machine

## How to develop on linux
Clone the repo
```
git clone git@bitbucket.org:emanmks/videx.git
cd videx
```

Install electron locally in your project
```
npm i electron-prebuilt --save-dev
```

To run and debug
```
./node_modules/.bin/electron .
```

## How to develop on windows
Clone the repo
```
git clone git@bitbucket.org:emanmks/videx.git
cd videx
```

Install electron locally in your project
```
npm i electron-prebuilt --save-dev
```

To run and debug
```
.\node_modules\.bin\electron .
```

## How to deploy
For the asier way, please install electron-packager-interactive first.
```
npm install -g electron-packager-interactive
```
This node module will help you to build executable file interactively.

### Usage
Just
```
electron-packager-interactive
or
epi
```
complete step by step to create the electron-packager settings and wait for the packages to be created.