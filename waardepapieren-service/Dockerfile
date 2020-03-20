FROM node:10
RUN mkdir /app
ADD .babelrc package.json package-lock.json /app/
ADD src/* app/src/
ADD configuration/* app/configuration/
ENV WAARDEPAPIEREN_CONFIG /app/configuration/waardepapieren-config.json
ENV WAARDEPAPIEREN_VERBLIJFPLAATSHISTORIE_CONFIG /app/configuration/waardepapieren-verblijfplaatshistorie-config.json
WORKDIR /app
RUN npm install --production
CMD npm start
