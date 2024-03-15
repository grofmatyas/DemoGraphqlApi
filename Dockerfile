FROM node:20.11.1-alpine 
WORKDIR /usr/src/app

COPY . .
RUN yarn install
RUN yarn run build

ENV NODE_ENV PROD
USER node
COPY package.json .
COPY .example.env .

EXPOSE 3000
CMD yarn start
