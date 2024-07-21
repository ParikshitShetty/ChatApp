Welcome to the Realtime Chat Application! This README will guide you through the setup, configuration, and usage of the application.
Table of Contents

    Features
    Tech Stack
    Installation

Features

    Realtime Messaging: Chat with users in real-time.
    User Authentication: User login and registration.
    User Profiles: Customizable user profiles.
    Chat Rooms: Join chat rooms.

Tech Stack

    Frontend:
        React.js
        Jotai
        Socket.io-client
        Tailwind
    Backend:
        Node.js
        Express.js
        Socket.io
        Redis
    Deployment:
        Docker

Installation
    Make Sure you have docker installed.
    cd into ChatApp folder <br>
    Run `Docker compose up --build -d` to run(Windows).<br>
    OR <br>
    Run redis-server to run this app.<br>
    For redis-server on windows use WSL.<br>
    You can cd into server and client folders seperately.<br>
    And run `npm run dev` to run server & and client.<br>
    
Prerequisites

    Node.js (v18 or higher)
    Redis
    Docker (optional for containerized deployment)