FROM node:latest

WORKDIR /app

COPY package*.json ./



COPY . .


EXPOSE ${PORT}


CMD [ "npm", "start" ]
