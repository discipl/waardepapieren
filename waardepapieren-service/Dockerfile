FROM node:10
RUN mkdir /app
RUN mkdir /ephemeral-certs
RUN mkdir /certs
RUN mkdir /app/configuration
ADD .babelrc package.json package-lock.json /app/
ADD src/* app/src/
ENV WAARDEPAPIEREN_CONFIG /app/configuration/waardepapieren-config.json
WORKDIR /app
RUN npm install --production
ADD pre-start.sh /app
CMD ./pre-start.sh && npm start
