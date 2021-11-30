FROM node:15.11.0 as builder

ENV NODE_ENV production

WORKDIR /opt/app
COPY package.json package-lock.json snowpack.config.js tsconfig.json /opt/app/

RUN npm i

RUN npm run prepare

COPY src /opt/app/src
RUN npm run build
COPY server /opt/app/server

EXPOSE 2222

CMD node /opt/app/server/server.js