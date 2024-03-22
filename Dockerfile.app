FROM node:latest

WORKDIR /app

COPY package*.json ./



COPY . .


EXPOSE 4000


CMD [ "npm", "start" ]
