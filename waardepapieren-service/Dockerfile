FROM node:10
RUN mkdir /app
COPY .babelrc package.json package-lock.json /app/
COPY src/* app/src/
COPY configuration/* app/configuration/
WORKDIR /app
RUN npm install --production
CMD npm start
