FROM node:20.8-alpine 

# Create app directory

WORKDIR /app 

# Copy package.json and package-lock.json

COPY package*.json ./

# Install app dependencies

RUN npm install

# Bundle app source

COPY . .

# Expose port
EXPOSE 8000



# Start the app

CMD ["npm", "start"]
