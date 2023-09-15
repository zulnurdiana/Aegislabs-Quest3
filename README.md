





<!-- Getting Started -->
## 	:toolbox: Getting Started

<!-- Prerequisites -->
### :bangbang: Prerequisites

This project uses NPM as package manager

* Install node.js version 16.13.1 <a href="https://nodejs.org/en/blog/release/v16.13.1">*here*<a/> <br />
  Make sure your node.js and npm already install in your device using, open cmd and run:
  ```bash
  node -v
  npm -v
  ```


  <!-- Installation -->
### :running: Run Locally With NPM

Follow this step to run this repository code in your local device:
  1. Open git bash and Clone the repo
   ```sh
   git clone https://github.com/zulnurdiana/Aegislabs-Quest-3
   ```
  2. Go to project folder 
  ``` sh
  cd Aegislabs-Quest-3
  ``` 
3. Open the project at VS Code 
  ``` sh
  code . 
  ``` 
  4. open terminal & install Package
  ``` sh
  npm install
  ``` 
  5.  Start the server
   ```sh
   npm start, or
   npm run dev (using nodemon)
   ```
  
  _Note:_
  1. Make sure you change the value of .env file
  2. Setup .env file to your local environment


## 📁 Folder Structure

```
+---public
|   \---css
|           tailwind.css
|
+---src
|   |   app.css
|   |   data-source.ts
|   |   index.ts
|   |
|   +---controllers
|   |       otp.controller.ts
|   |       payment.controller.ts
|   |       product.controllers.ts
|   |       user.controller.ts
|   |
|   +---entity
|   |       Order.ts
|   |       OTP.ts
|   |       Product.ts
|   |       User.ts
|   |
|   +---middleware
|   |       verifyImage.ts
|   |       verifyToken.ts
|   |
|   +---routes
|   |       ejs.route.ts
|   |       otp.route.ts
|   |       payment.route.ts
|   |       product.route.ts
|   |       user.route.ts
|   |
|   +---utils
|   |       Manager.ts
|   |       Multer.ts
|   |
|   \---views
|           dashboard.ejs
|           detailProduct.ejs
|           failed.ejs
|           login.ejs
|           register.ejs
|           success.ejs
|           verify_otp.ejs
|
\---upload

```

<!-- Usage -->
## :eyes: Usage
  After you running the server you can testing it at postman, you can see our <a href="https://documenter.getpostman.com/view/18895824/2s9YC5xsMp">**API Documentation**</a> for more detail 

<!-- TechStack -->
### :space_invader: Tech Stack
  <h4>BackEnd:</h4>
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" />


  <h4>Frontend:</h4>
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  
  
  <h4>Database:</h4>
  <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" />

<h4>Tools:</h4>
  <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101" />
  <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" />
  <img src="https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white" />


