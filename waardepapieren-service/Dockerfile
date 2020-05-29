FROM node:10
RUN mkdir /app
COPY .babelrc package.json package-lock.json /app/

WORKDIR /app
RUN npm install --production
COPY src/* src/
COPY configuration/* configuration/
CMD npm start
