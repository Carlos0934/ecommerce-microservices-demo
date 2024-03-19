FROM node:20.0-alpine 

# Create app directory

WORKDIR /app 

# Copy package.json and package-lock.json

COPY package*.json ./

# Install app dependencies

RUN npm install

# Bundle app source

COPY . .

# Expose port
EXPOSE 8002

# Start the app

CMD ["npm", "start"]


