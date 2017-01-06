# Videx - Video Explorer

A multi-platform portable Video Explorer built on top of electron.

![Videx2016-12-23 00:58:28.png](https://bitbucket.org/repo/qdb7dj/images/98512012-Videx2016-12-23%2000:58:28.png)

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

## Playing AVI file
Playing .avi file is a very special case in this project. It's not that easy to play .avi file using html. That's why we need to convert on-the-fly the avi file to mp4.

### FFMPEG
First of all you need to install FFMPEG in your development environment and production environment.
For ubuntu (16.04) user you can simply run :
```
sudo apt update
sudo apt install ffmpeg
```
For windows and OSX, please find out how to install from FFMPEG official page: https://ffmpeg.org/download.html

### NodeJS Fluent-FFMPEG
Now after finishing installation of ffmpeg, now you need to install nodejs fluent-ffmpeg to your project:
```
npm install fluent-ffmpeg
```

## Dependency for Searching Features
```
npm install find-in-files
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

### Warning!
Make sure to include FFMPEG library into your portable application.