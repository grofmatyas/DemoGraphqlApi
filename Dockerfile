FROM node:20.11.1-alpine 
WORKDIR /usr/src/app

COPY . .
RUN npm ci
RUN npm run build

ENV NODE_ENV PROD
USER node
COPY package.json .
COPY .example.env .

EXPOSE 3000
CMD npm start
