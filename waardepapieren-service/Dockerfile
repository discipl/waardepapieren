FROM node:10
RUN mkdir /app
ADD .babelrc package.json package-lock.json /app/
ADD src/* app/src/
WORKDIR /app
RUN npm install --production
CMD npm start