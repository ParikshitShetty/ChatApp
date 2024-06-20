FROM node:18-alpine

# Setting CWD
WORKDIR /app

# Copy both package and package-lock json files
COPY package.json .
COPY package-lock.json .

# Installing dependencies
RUN npm install

# Copy the folder
COPY . .

# Expose the app
EXPOSE 5173

# Run the server
CMD [ "npm", "run", "dev"]