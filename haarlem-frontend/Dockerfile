FROM node:10
ARG CERTIFICATE_HOST
ARG IPV8_HOST
ENV REACT_APP_EPHEMERAL_ENDPOINT=https://localhost:443/api/eph
ENV REACT_APP_EPHEMERAL_WEBSOCKET_ENDPOINT=wss://localhost:443/api/eph-ws
ENV REACT_APP_CERTIFICATE_HOST=${CERTIFICATE_HOST}
ENV REACT_APP_IPV8_HOST=${IPV8_HOST}
RUN mkdir /app
WORKDIR /app

COPY discipl-waardepapieren-component-0.3.2.tgz /app/discipl-waardepapieren-component-0.3.2.tgz
COPY discipl-paper-wallet-0.8.3.tgz /app/discipl-paper-wallet-0.8.3.tgz
COPY discipl-paper-wallet-0.8.3.tgz /discipl-paper-wallet/discipl-paper-wallet-0.8.3.tgz
COPY package.json package-lock.json /app/
RUN npm install --unsafe-perm

COPY public /app/public
COPY scripts /app/scripts
RUN npm run prestart

FROM nginx:1.15.8

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=0 /app/public /usr/share/nginx/html
