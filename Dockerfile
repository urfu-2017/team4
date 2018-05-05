FROM node:9
ADD ./build/server /server
ADD ./build/shared /shared
ADD ./node_modules /node_modules
ADD ./package.json /package.json
ADD ./.env /.env
WORKDIR /
CMD node ./server/index.js
