FROM node:10
RUN mkdir /app
ADD package.json package-lock.json /app/
ENV REACT_APP_EPHEMERAL_ENDPOINT=https://localhost:443/api/eph
ENV REACT_APP_EPHEMERAL_WEBSOCKET_ENDPOINT=wss://localhost:443/api/eph-ws
WORKDIR /app
RUN npm install --unsafe-perm
ADD public /app/public
ADD scripts /app/scripts
ADD src /app/src
ARG CERTIFICATE_HOST
ENV REACT_APP_CERTIFICATE_HOST=${CERTIFICATE_HOST}
RUN npm run build

FROM nginx:1.15.8
ADD nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=0 /app/build /usr/share/nginx/html
