# Blog App
 ![NPM](https://img.shields.io/badge/nextjs-11.0.0-blueviolet) ![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)
 
## Overview
This a simple blogging web application made with [Next.js](https://nextjs.org/), [Editor.js](https://editorjs.io/) and [Material UI](https://material-ui.com/).
The app allows users to signup through Email verification, login through JWT token based authentication, create blogs through the Editor.js interface, edit blogs, view them, upload profile image etc. It uses a backed API made with Node.js, Express.js, MongoDB, and Cloudinary for asset hosting.
[API repo link](https://github.com/shucoll/blog-app--api)
 
This project is bootstrapped with [Next.js](https://nextjs.org/).

## [Live DEMO](https://blog-app-webapp.vercel.app/)

## Installation

 First clone the repo
```sh
git clone https://github.com/shucoll/blog-app--webapp  
```

Install the dependencies
```sh
npm install
```

Add and configure .env.local file
In the .env.local file in project root directory add two environment variables
```sh
NEXT_PUBLIC_BACKEND_URI = url-where-backend-is-hosted(eg, http://localhost:5000)
NEXT_PUBLIC_CLOUDINARY_URI = https://res.cloudinary.com/your-cloudinary-cloud-name/image/upload
```

Run the development version
```sh
npm run dev
```

Build production version
```sh
npm run build
```

Run production version
```sh
npm start
```