FROM node:10
RUN mkdir /app
ADD index.js package.json package-lock.json /app/
WORKDIR /app
# Copy data file dependencies
# A wildcard is used to ensure all data files are copied
COPY data*.json ./
RUN npm install --production
CMD npm start