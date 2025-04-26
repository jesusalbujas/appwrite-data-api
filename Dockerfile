FROM node:20-alpine

LABEL maintainer="jesusramirez35000@gmail.com"

WORKDIR /opt/

COPY ./package.json ./

RUN npm install

COPY ./models ./models

COPY ./controller ./controller

# Start the api
CMD ["npm", "start"]
