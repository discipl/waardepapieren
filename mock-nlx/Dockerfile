FROM node:10
RUN mkdir /app
ADD index.js package.json package-lock.json /app/
WORKDIR /app
RUN npm install --production
CMD npm start