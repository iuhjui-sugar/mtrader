FROM node:alpine
EXPOSE 1337
WORKDIR /var/wwww
COPY ./* /var/www/
RUN npm install
ENTRYPOINT [ "npm run start" ]
