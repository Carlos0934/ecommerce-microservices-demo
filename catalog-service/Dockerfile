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
EXPOSE 8000

ARG AWS_ACCESS_KEY_ID 
ARG AWS_SECRET_ACCESS_KEY

ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY



# Start the app

CMD ["npm", "start"]
