FROM node:16
EXPOSE 3001
WORKDIR /var/www
COPY ./ /var/www
RUN npm install -g npm@8.9.0
RUN npm i
RUN npm run build
CMD node /var/www/dist/main.js

