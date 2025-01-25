# build stage
FROM node:21 as build-stage
WORKDIR /app
COPY package*.json ./

RUN yarn install
COPY . .
RUN yarn build

# move file stage
FROM busybox
WORKDIR /build
COPY --from=build-stage /app/dist/. .
ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["sh", "/entrypoint.sh"]