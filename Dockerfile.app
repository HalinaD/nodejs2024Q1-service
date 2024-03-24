ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine as build-stage

WORKDIR /app

COPY package.json ./

RUN npm i --only=prod --omit=dev && npm i @nestjs/cli

COPY . .

RUN npx prisma generate

FROM node:${NODE_VERSION}-alpine as runtime-stage

WORKDIR /app

COPY --from=build-stage /app .

EXPOSE ${PORT}

CMD [  "npm", "run", "start:dev" ]
