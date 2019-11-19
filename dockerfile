FROM node:10.15.0-alpine

EXPOSE 3000

WORKDIR /app

COPY package.json /home/app
COPY package-lock.json /home/app

RUN npm install

COPY . .

CMD npm run setup-dbs && npm run migrate:rollback && npm run migrate:latest && npm run seed