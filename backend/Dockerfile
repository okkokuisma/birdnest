FROM node:16.18-alpine

WORKDIR /usr/src/app

COPY --chown=node:node ./dist dist/
COPY --chown=node:node ./build build/
COPY --chown=node:node ./migrations migrations/
COPY --chown=node:node ./package.json ./package-lock.json ./

ENV NODE_ENV=production

RUN npm ci

USER node

CMD npm start