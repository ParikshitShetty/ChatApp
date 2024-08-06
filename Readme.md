Welcome to the Realtime Chat Application! This README will guide you through the setup, configuration, and usage of the application.
Table of Contents

- Features
- Tech Stack
- Installation

## Features

- Realtime Messaging: Chat with users in real-time.
- Realtime transfer of files: File sharing is enabled
- User Profiles: Customizable user profiles.
- Chat Rooms: Join chat rooms.

## Tech Stack

- Frontend:
    -  React.js
    -  Jotai
    -  Socket.io-client
    -  Tailwind CSS
- Backend:
    -  Node.js
    -  Express.js
    -  Socket.io
    -  Mongo DB
- Deployment:
    - Docker
    - Native
## Installation

You can run this app either using Docker or natively

### For Docker based deployment

- Clone the project using
    -       git clone https://github.com/ParikshitShetty/ChatApp.git
- Make sure you have docker installed in your system
- For Windows
    - Move into the ChatApp folder using cd command and run the command given below
    -       Docker compose up --build -d
    - After the above command is successfully run open any browser and naviagte to the url `http://localhost:5173`

- For Linux / Mac
    - Move into the ChatApp folder
    - Open docker-compose.yml and in the 10th line change the volume map from `C:/mongo-chat-data/data/db:/data/db` to `/home/mongo-chat-data/data/db:/data/db` this and save the file
    - Run the command given below
    -       Docker-compose up --build -d
    - After the above command is successfully run open any browser and naviagte to the url `http://localhost:5173`

### For Native deployment

- Make sure you have node.js installed
- Move into ChatApp folder using `cd` command
- Both the client and server folder are there in the same app 
- Move into those folders and run the below command in both client and server folders
    -       npm install
- After the command is run successfully in the server folder run the below command to run the app 
    -       npm run app
- After the above command is successfully run open any browser and naviagte to the url `http://localhost:5173`

## Prerequisites

    Node.js (v18 or higher)
    MongoDB
    Docker (optional for containerized deployment)

# Login Page
![login](https://github.com/ParikshitShetty/ChatApp/blob/main/client/public/img/login.png?raw=true)

# Home Page
![home](https://github.com/ParikshitShetty/ChatApp/blob/main/client/public/img/home.png?raw=true)

# Chat
![chat](https://github.com/ParikshitShetty/ChatApp/blob/main/client/public/img/chat.png?raw=true)

# Group Chat
![groupchat](https://github.com/ParikshitShetty/ChatApp/blob/main/client/public/img/groupchat.png?raw=true)