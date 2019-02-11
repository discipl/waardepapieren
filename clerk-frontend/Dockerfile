FROM node:10
RUN mkdir /app
ADD package.json package-lock.json /app/
ENV REACT_APP_EPHEMERAL_ENDPOINT=http://localhost:8080/api/eph
ENV REACT_APP_EPHEMERAL_WEBSOCKET_ENDPOINT=ws://localhost:8080/api/eph-ws
WORKDIR /app
RUN npm install
ADD src /app/src
ADD public /app/public

RUN npm run build

FROM nginx:1.15.8
ADD nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=0 /app/build /usr/share/nginx/html